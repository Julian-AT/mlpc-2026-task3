"""Generate training data subset for in-browser TensorFlow.js demo.

Extracts ~2000 high-agreement segments from the MLPC dataset,
producing a JSON file with z-score normalized 47-dim features and
majority-vote binary labels for 15 sound classes.

Note: np.load with allow_pickle=True is required here because the NPZ
files from the course dataset store class_names as object arrays.
This is trusted course-provided data, not arbitrary user input.
"""

import numpy as np
import json
import os
import glob

DATA_DIR = "C:/Users/julia/Desktop/mlpc/MLPC2026_dataset_development/audio_features"
OUTPUT = "C:/Users/julia/Desktop/mlpc/slides-interactive/data/training-data.json"

FEATURE_KEYS = [
    "mfcc_mean",      # 32 dims
    "spectral_centroid_mean",  # 1
    "spectral_bandwidth_mean", # 1
    "spectral_rolloff_mean",   # 1
    "spectral_flatness_mean",  # 1
    "zero_crossing_rate_mean", # 1
    "rms_energy_mean",         # 1
]

TARGET_SEGMENTS = 2000

def load_npz(path):
    # allow_pickle=True needed for object arrays (class_names) in course dataset
    return dict(np.load(path, allow_pickle=True))

def compute_features(npz):
    """Extract 47-dim features from a single NPZ file (or fewer if some keys missing)."""
    parts = []
    for key in FEATURE_KEYS:
        if key in npz:
            arr = npz[key]
            if arr.ndim == 1:
                arr = arr.reshape(-1, 1)
            parts.append(arr)
    if not parts:
        return None
    return np.concatenate(parts, axis=1)

def compute_labels(npz, threshold=0.5):
    """Majority vote: binarize annotations at threshold, then take mean >= 0.5."""
    annotations = npz["annotations"]  # [T, C, A]
    binarized = (annotations >= threshold).astype(float)
    labels = (binarized.mean(axis=2) >= 0.5).astype(float)
    return labels  # [T, C]

def compute_agreement(npz, threshold=0.5):
    """Mean agreement across annotator pairs."""
    annotations = npz["annotations"]  # [T, C, A]
    binarized = (annotations >= threshold).astype(float)
    mean_ann = binarized.mean(axis=2)  # [T, C]
    agreement = np.maximum(mean_ann, 1 - mean_ann).mean(axis=1)  # [T]
    return agreement

def main():
    npz_files = sorted(glob.glob(os.path.join(DATA_DIR, "*.npz")))
    print(f"Found {len(npz_files)} NPZ files")

    all_features = []
    all_labels = []

    for path in npz_files:
        try:
            npz = load_npz(path)
            features = compute_features(npz)
            if features is None:
                continue
            labels = compute_labels(npz)
            agreement = compute_agreement(npz)

            mask = agreement >= 0.8
            if mask.sum() == 0:
                continue

            features = features[mask]
            labels = labels[mask]

            all_features.append(features)
            all_labels.append(labels)
        except Exception:
            continue

    features = np.concatenate(all_features, axis=0)
    labels = np.concatenate(all_labels, axis=0)
    print(f"Total high-agreement segments: {len(features)}")
    print(f"Feature dimensions: {features.shape[1]}")
    print(f"Label dimensions: {labels.shape[1]}")

    if len(features) > TARGET_SEGMENTS:
        indices = np.random.RandomState(42).choice(len(features), TARGET_SEGMENTS, replace=False)
        features = features[indices]
        labels = labels[indices]

    mean = features.mean(axis=0)
    std = features.std(axis=0)
    std[std == 0] = 1
    features = (features - mean) / std

    sample_npz = load_npz(npz_files[0])
    class_names = [str(c) for c in sample_npz["class_names"]]

    print(f"Final dataset: {len(features)} samples, {features.shape[1]} features, {labels.shape[1]} classes")
    print(f"Class names: {class_names}")
    print(f"Label distribution: {labels.sum(axis=0).astype(int).tolist()}")

    data = {
        "features": features.round(4).tolist(),
        "labels": labels.astype(int).tolist(),
        "classNames": class_names,
        "featureDim": int(features.shape[1]),
        "numClasses": int(labels.shape[1]),
        "numSamples": len(features),
    }

    with open(OUTPUT, "w") as f:
        json.dump(data, f)

    file_size = os.path.getsize(OUTPUT) / 1024
    print(f"Saved to {OUTPUT} ({file_size:.0f} KB)")

if __name__ == "__main__":
    main()
