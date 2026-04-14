"""Section 3: Audio Features Analysis for MLPC 2026 Task 3.

Generates all figures and prints statistics for Section 3 of the report:
  3a: Metadata distribution (devices, placement, environments)
  3b: Feature statistics (mean, std, min, max per feature group)
  3c: Feature correlation (heatmap of feature group correlations)
  3d: Bonus - t-SNE feature space visualization
"""

import sys
import numpy as np
import pandas as pd
from collections import defaultdict, Counter

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent))
from utils import (
    iter_npz_files, CLASS_NAMES, SHORT_CLASS_NAMES,
    FIGURES_DIR, setup_plotting, load_metadata_csv,
)

# Feature groups: (display_name, npz_key_prefix, dimensionality)
SCALAR_FEATURES = [
    ("ZCR", "zcr", 1),
    ("Flux", "flux", 1),
    ("Flatness", "flatness", 1),
    ("Centroid", "centroid", 1),
    ("Bandwidth", "bandwidth", 1),
    ("Contrast", "contrast", 7),
    ("Rolloff Low", "rolloff_low", 1),
    ("Rolloff High", "rolloff_high", 1),
    ("Energy", "energy", 1),
    ("Power", "power", 1),
]


def section_3a():
    """Analyze metadata distributions."""
    print("=" * 60)
    print("SECTION 3a: Metadata Distribution")
    print("=" * 60)

    plt = setup_plotting()
    meta = load_metadata_csv()

    # Normalize device names (case-insensitive grouping)
    meta["device_norm"] = meta["recording_device"].str.strip().str.title()

    # Group rare devices
    device_counts = meta["device_norm"].value_counts()
    top_devices = device_counts.head(10)
    other_count = device_counts.iloc[10:].sum()

    print(f"\nUnique devices (raw): {meta['recording_device'].nunique()}")
    print(f"Unique devices (normalized): {meta['device_norm'].nunique()}")

    # Placement
    placement = meta["device_placement"].value_counts()
    print(f"\nPlacement:\n{placement.to_string()}")

    # Environment
    env_counts = meta["recording_environment"].value_counts()
    top_envs = env_counts.head(8)
    other_env = env_counts.iloc[8:].sum()
    print(f"\nEnvironments:\n{env_counts.head(10).to_string()}")

    # Create combined figure
    fig, axes = plt.subplots(1, 3, figsize=(7.5, 3.0))

    # Device distribution
    dev_labels = list(top_devices.index) + ["Other"]
    dev_values = list(top_devices.values) + [other_count]
    axes[0].barh(range(len(dev_labels)), dev_values, color="#4C72B0")
    axes[0].set_yticks(range(len(dev_labels)))
    axes[0].set_yticklabels(dev_labels, fontsize=6)
    axes[0].invert_yaxis()
    axes[0].set_xlabel("Count")
    axes[0].set_title("Recording Devices")

    # Placement distribution
    axes[1].bar(placement.index, placement.values, color=["#55A868", "#C44E52"])
    axes[1].set_ylabel("Count")
    axes[1].set_title("Device Placement")

    # Environment distribution
    env_labels = list(top_envs.index) + ["Other"]
    env_values = list(top_envs.values) + [other_env]
    axes[2].barh(range(len(env_labels)), env_values, color="#DD8452")
    axes[2].set_yticks(range(len(env_labels)))
    axes[2].set_yticklabels(env_labels, fontsize=7)
    axes[2].invert_yaxis()
    axes[2].set_xlabel("Count")
    axes[2].set_title("Environments")

    plt.tight_layout()
    fig.savefig(str(FIGURES_DIR / "metadata_distribution.pdf"))
    plt.close()
    print(f"\nSaved: figures/metadata_distribution.pdf")


def section_3b():
    """Compute feature statistics across the entire dataset."""
    print("\n" + "=" * 60)
    print("SECTION 3b: Feature Statistics")
    print("=" * 60)

    # Collect statistics incrementally using Welford's method
    feature_keys = []
    for name, prefix, dim in SCALAR_FEATURES:
        feature_keys.append((name, f"{prefix}_mean", dim))
    feature_keys.append(("MFCC", "mfcc_mean", 32))
    feature_keys.append(("Delta MFCC", "mfcc_d_mean", 32))
    feature_keys.append(("Delta2 MFCC", "mfcc_d2_mean", 32))
    feature_keys.append(("Mel Spect.", "melspect_mean", 128))

    # Collect all values for each feature (use mean aggregation only)
    stats_data = {}
    for display_name, key, dim in feature_keys:
        stats_data[display_name] = {"values": []}

    n_segments = 0
    for fname, npz in iter_npz_files():
        for display_name, key, dim in feature_keys:
            arr = npz[key]  # [T, dim]
            # Average across dimensions to get scalar per segment
            if arr.shape[1] > 1:
                segment_means = np.mean(arr, axis=1)
            else:
                segment_means = arr[:, 0]
            stats_data[display_name]["values"].append(segment_means)
        n_segments += npz["annotations"].shape[0]

    print(f"\nTotal segments: {n_segments}")
    print(f"\n{'Feature':<16s} {'Mean':>10s} {'Std':>10s} {'Min':>10s} {'Max':>10s}")
    print("-" * 58)

    results = []
    for display_name, key, dim in feature_keys:
        all_vals = np.concatenate(stats_data[display_name]["values"])
        m = np.mean(all_vals)
        s = np.std(all_vals)
        mn = np.min(all_vals)
        mx = np.max(all_vals)
        print(f"{display_name:<16s} {m:>10.4f} {s:>10.4f} {mn:>10.4f} {mx:>10.4f}")
        results.append((display_name, m, s, mn, mx))

    return results


def section_3c():
    """Compute feature correlations between feature groups."""
    print("\n" + "=" * 60)
    print("SECTION 3c: Feature Correlation")
    print("=" * 60)

    plt = setup_plotting()
    import seaborn as sns

    # Feature groups to correlate (use _mean aggregation, average across dims)
    corr_features = [
        ("MFCC", "mfcc_mean"),
        ("dMFCC", "mfcc_d_mean"),
        ("d2MFCC", "mfcc_d2_mean"),
        ("MelSpect", "melspect_mean"),
        ("Energy", "energy_mean"),
        ("Power", "power_mean"),
        ("ZCR", "zcr_mean"),
        ("Flux", "flux_mean"),
        ("Flatness", "flatness_mean"),
        ("Centroid", "centroid_mean"),
        ("Bandwidth", "bandwidth_mean"),
        ("Contrast", "contrast_mean"),
        ("RollLow", "rolloff_low_mean"),
        ("RollHigh", "rolloff_high_mean"),
    ]

    # Sample for efficiency: use every file but subsample segments
    all_features = {name: [] for name, _ in corr_features}

    for fname, npz in iter_npz_files():
        for name, key in corr_features:
            arr = npz[key]
            if arr.shape[1] > 1:
                vals = np.mean(arr, axis=1)
            else:
                vals = arr[:, 0]
            all_features[name].append(vals)

    # Build dataframe
    data = {}
    for name, _ in corr_features:
        data[name] = np.concatenate(all_features[name])
    df = pd.DataFrame(data)

    corr_matrix = df.corr()
    print(f"\nCorrelation matrix shape: {corr_matrix.shape}")
    print(corr_matrix.to_string(float_format=lambda x: f"{x:.2f}"))

    # Heatmap - save for later combining with t-SNE
    fig, ax = plt.subplots(figsize=(5.5, 4.5))
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool), k=1)
    sns.heatmap(
        corr_matrix, mask=mask, annot=True, fmt=".2f", cmap="RdBu_r",
        center=0, vmin=-1, vmax=1, ax=ax, square=True,
        annot_kws={"size": 5}, linewidths=0.5,
        xticklabels=corr_matrix.columns, yticklabels=corr_matrix.columns,
    )
    ax.set_xticklabels(ax.get_xticklabels(), rotation=45, ha="right", fontsize=6)
    ax.set_yticklabels(ax.get_yticklabels(), fontsize=6)
    ax.set_title("Feature Group Correlation Matrix")
    plt.tight_layout()
    fig.savefig(str(FIGURES_DIR / "feature_correlation.pdf"))
    plt.close()
    print(f"\nSaved: figures/feature_correlation.pdf")

    return corr_matrix


def section_3d_bonus():
    """Bonus: t-SNE feature space visualization."""
    print("\n" + "=" * 60)
    print("SECTION 3d: Feature Space Visualization (Bonus)")
    print("=" * 60)

    plt = setup_plotting()
    from sklearn.manifold import TSNE
    from sklearn.preprocessing import StandardScaler

    # Collect high-agreement, single-class segments
    feature_keys = [
        "mfcc_mean", "energy_mean", "zcr_mean", "centroid_mean",
        "bandwidth_mean", "flux_mean", "flatness_mean",
        "rolloff_low_mean", "rolloff_high_mean", "contrast_mean",
    ]

    segments_features = []
    segments_labels = []

    for fname, npz in iter_npz_files():
        ann = npz["annotations"]  # [T, C, A]
        T, C, A = ann.shape

        binary = (ann >= 0.5).astype(np.float32)
        mean_ann = np.mean(binary, axis=2)  # [T, C]
        labels = (mean_ann >= 0.5).astype(int)

        # Only high-agreement segments (all annotators agree)
        if A >= 2:
            agreement = np.min(binary, axis=2) + (1 - np.max(binary, axis=2))
            # agreement = 1 where all agree (all 1 or all 0)
            min_agreement = np.min(agreement, axis=1)  # per segment
        else:
            min_agreement = np.ones(T)

        for t in range(T):
            active = np.where(labels[t] > 0)[0]
            if len(active) == 1 and min_agreement[t] >= 0.8:
                feat_vec = []
                for key in feature_keys:
                    arr = npz[key][t]
                    if arr.shape[0] > 1:
                        feat_vec.extend(arr.tolist())
                    else:
                        feat_vec.append(float(arr[0]))
                segments_features.append(feat_vec)
                segments_labels.append(active[0])

    X = np.array(segments_features, dtype=np.float32)
    y = np.array(segments_labels)
    print(f"\nHigh-agreement single-class segments: {len(X)}")
    print(f"Feature dimensionality: {X.shape[1]}")

    # Class distribution in selected segments
    for c in range(15):
        n = np.sum(y == c)
        if n > 0:
            print(f"  {CLASS_NAMES[c]}: {n}")

    # Subsample if too large (cap at 10000 for t-SNE speed)
    if len(X) > 10000:
        rng = np.random.RandomState(42)
        idx = rng.choice(len(X), 10000, replace=False)
        X = X[idx]
        y = y[idx]
        print(f"Subsampled to {len(X)}")

    # Remove NaN/Inf
    valid = np.all(np.isfinite(X), axis=1)
    X = X[valid]
    y = y[valid]

    # Standardize
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # t-SNE
    print("Running t-SNE...")
    tsne = TSNE(n_components=2, perplexity=30, random_state=42, n_iter=1000)
    X_2d = tsne.fit_transform(X_scaled)

    # Plot - standalone t-SNE
    fig, ax = plt.subplots(figsize=(6, 5))
    colors = plt.cm.tab20(np.linspace(0, 1, 15))

    present_classes = sorted(set(y))
    for c in present_classes:
        mask = y == c
        ax.scatter(
            X_2d[mask, 0], X_2d[mask, 1],
            c=[colors[c]], s=3, alpha=0.5,
            label=CLASS_NAMES[c].replace("_", " "), rasterized=True,
        )

    ax.set_xlabel("t-SNE 1")
    ax.set_ylabel("t-SNE 2")
    ax.set_title("t-SNE of Audio Features (High-Agreement Segments)")
    ax.legend(
        fontsize=5, markerscale=3, ncol=2,
        loc="upper right", framealpha=0.8,
    )
    plt.tight_layout()
    fig.savefig(str(FIGURES_DIR / "tsne_features.pdf"))
    plt.close()
    print(f"Saved: figures/tsne_features.pdf")

    return X_2d, y, present_classes


def generate_combined_corr_tsne(corr_matrix, X_2d, y, present_classes):
    """Generate combined correlation + t-SNE figure."""
    plt = setup_plotting()
    import seaborn as sns

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.5, 3.5))

    # Left: correlation heatmap
    mask = np.triu(np.ones_like(corr_matrix, dtype=bool), k=1)
    sns.heatmap(
        corr_matrix, mask=mask, annot=True, fmt=".1f", cmap="RdBu_r",
        center=0, vmin=-1, vmax=1, ax=ax1, square=True,
        annot_kws={"size": 3.5}, linewidths=0.3,
        xticklabels=corr_matrix.columns, yticklabels=corr_matrix.columns,
        cbar_kws={"shrink": 0.6, "pad": 0.02},
    )
    ax1.set_xticklabels(ax1.get_xticklabels(), rotation=45, ha="right", fontsize=4.5)
    ax1.set_yticklabels(ax1.get_yticklabels(), fontsize=4.5)
    ax1.set_title("(a) Feature Correlation", fontsize=8)

    # Right: t-SNE scatter
    colors = plt.cm.tab20(np.linspace(0, 1, 15))
    for c in present_classes:
        c_mask = y == c
        ax2.scatter(
            X_2d[c_mask, 0], X_2d[c_mask, 1],
            c=[colors[c]], s=2, alpha=0.4,
            label=CLASS_NAMES[c].replace("_", " "), rasterized=True,
        )
    ax2.set_xlabel("t-SNE 1", fontsize=7)
    ax2.set_ylabel("t-SNE 2", fontsize=7)
    ax2.set_title("(b) t-SNE Feature Space", fontsize=8)
    ax2.legend(fontsize=4, markerscale=2.5, ncol=2,
               loc="upper right", framealpha=0.7)
    ax2.tick_params(labelsize=6)

    plt.tight_layout()
    fig.savefig(str(FIGURES_DIR / "features_combined.pdf"))
    plt.close()
    print(f"Saved: figures/features_combined.pdf")
    plt.tight_layout()
    fig.savefig(str(FIGURES_DIR / "tsne_features.pdf"))
    plt.close()
    print(f"Saved: figures/tsne_features.pdf")


if __name__ == "__main__":
    section_3a()
    section_3b()
    corr_matrix = section_3c()
    X_2d, y, present_classes = section_3d_bonus()
    generate_combined_corr_tsne(corr_matrix, X_2d, y, present_classes)
    print("\n" + "=" * 60)
    print("Section 3 analysis complete.")
