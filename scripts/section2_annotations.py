"""Section 2: Annotations Analysis for MLPC 2026 Task 3.

Generates all figures and prints statistics for Section 2 of the report:
  2a: Annotator agreement (IoU-based)
  2b: Label aggregation (mean threshold)
  2c: Label characteristics (frequency, co-occurrence)
"""

import sys
import numpy as np
import pandas as pd
from collections import defaultdict

sys.path.insert(0, str(__import__("pathlib").Path(__file__).resolve().parent))
from utils import (
    iter_npz_files, load_npz, CLASS_NAMES, SHORT_CLASS_NAMES,
    FIGURES_DIR, setup_plotting,
)


def compute_agreement(annotations, threshold=0.5):
    """Compute segment-level IoU agreement between all annotator pairs.

    Args:
        annotations: array of shape [T, C, A], values 0-1
        threshold: binarization threshold

    Returns:
        per_class_iou: array [C] mean IoU per class across pairs
        overall_iou: float, mean across classes
        n_pairs: int, number of annotator pairs
    """
    T, C, A = annotations.shape
    if A < 2:
        return None, None, 0

    binary = (annotations >= threshold).astype(np.float32)
    per_class_ious = []

    for c in range(C):
        pair_ious = []
        for i in range(A):
            for j in range(i + 1, A):
                a_i = binary[:, c, i]
                a_j = binary[:, c, j]
                intersection = np.sum(a_i * a_j)
                union = np.sum(np.clip(a_i + a_j, 0, 1))
                if union > 0:
                    pair_ious.append(intersection / union)
        if pair_ious:
            per_class_ious.append(np.mean(pair_ious))
        else:
            per_class_ious.append(np.nan)

    per_class_iou = np.array(per_class_ious)
    valid = ~np.isnan(per_class_iou)
    overall = np.nanmean(per_class_iou) if valid.any() else np.nan
    n_pairs = A * (A - 1) // 2
    return per_class_iou, overall, n_pairs


def section_2a():
    """Compute annotator agreement metrics."""
    print("=" * 60)
    print("SECTION 2a: Annotator Agreement")
    print("=" * 60)

    all_class_ious = defaultdict(list)
    own_ious = []
    other_ious = []
    n_files_multi = 0

    for fname, npz in iter_npz_files():
        ann = npz["annotations"]
        T, C, A = ann.shape
        if A < 2:
            continue

        n_files_multi += 1
        is_own = npz["is_own_recording"]

        binary = (ann >= 0.5).astype(np.float32)

        for i in range(A):
            for j in range(i + 1, A):
                for c in range(C):
                    a_i = binary[:, c, i]
                    a_j = binary[:, c, j]
                    intersection = np.sum(a_i * a_j)
                    union = np.sum(np.clip(a_i + a_j, 0, 1))
                    if union > 0:
                        iou = intersection / union
                        all_class_ious[c].append(iou)

                # Own vs other: compute file-level IoU for this pair
                flat_i = binary[:, :, i].ravel()
                flat_j = binary[:, :, j].ravel()
                inter = np.sum(flat_i * flat_j)
                uni = np.sum(np.clip(flat_i + flat_j, 0, 1))
                if uni > 0:
                    pair_iou = inter / uni
                    if is_own[i] or is_own[j]:
                        own_ious.append(pair_iou)
                    else:
                        other_ious.append(pair_iou)

    # Per-class mean IoU
    print(f"\nFiles with 2+ annotators: {n_files_multi}")
    print(f"\n{'Class':<30s} {'Mean IoU':>10s} {'N pairs':>10s}")
    print("-" * 52)
    class_mean_ious = []
    for c, name in enumerate(CLASS_NAMES):
        if all_class_ious[c]:
            m = np.mean(all_class_ious[c])
            class_mean_ious.append(m)
            print(f"{name:<30s} {m:>10.3f} {len(all_class_ious[c]):>10d}")
        else:
            class_mean_ious.append(np.nan)
            print(f"{name:<30s} {'N/A':>10s} {'0':>10s}")

    overall = np.nanmean(class_mean_ious)
    print(f"\n{'Overall mean':<30s} {overall:>10.3f}")

    # Own vs other
    own_mean = np.mean(own_ious) if own_ious else float("nan")
    other_mean = np.mean(other_ious) if other_ious else float("nan")
    print(f"\nOwn recording pairs: mean IoU = {own_mean:.3f} (n={len(own_ious)})")
    print(f"Other recording pairs: mean IoU = {other_mean:.3f} (n={len(other_ious)})")

    return class_mean_ious, own_mean, other_mean


def section_2b():
    """Aggregate annotations to binary labels and show example."""
    print("\n" + "=" * 60)
    print("SECTION 2b: Label Aggregation")
    print("=" * 60)

    # Find a good example file: 3 annotators, diverse classes
    example_fname = None
    for fname, npz in iter_npz_files():
        ann = npz["annotations"]
        T, C, A = ann.shape
        if A >= 3:
            binary = (ann >= 0.5).astype(np.float32)
            mean_labels = np.mean(binary, axis=2)
            active_classes = np.sum(np.any(mean_labels >= 0.5, axis=0))
            if 2 <= active_classes <= 4:
                example_fname = fname
                break

    if example_fname is None:
        example_fname = "000004.npz"  # fallback

    npz = load_npz(example_fname)
    ann = npz["annotations"]
    T, C, A = ann.shape
    print(f"\nExample file: {example_fname} (T={T}, C={C}, A={A})")
    print(f"Target classes: {npz['target_classes']}")

    binary = (ann >= 0.5).astype(np.float32)
    mean_ann = np.mean(binary, axis=2)
    agg_labels = (mean_ann >= 0.5).astype(int)

    # Show active classes
    active = np.where(np.any(agg_labels > 0, axis=0))[0]
    print(f"\nActive classes in aggregated labels: {[CLASS_NAMES[i] for i in active]}")

    # Print a few segments for the active classes
    print(f"\n{'Seg':>4s} {'Time':>6s}", end="")
    for c_idx in active:
        short = SHORT_CLASS_NAMES[c_idx]
        for a in range(A):
            print(f" {short[:4]}_A{a}", end="")
        print(f" {short[:4]}_L", end="")
    print()

    for t in range(min(10, T)):
        time_str = f"{npz['start_time'][t]:.1f}"
        print(f"{t:>4d} {time_str:>6s}", end="")
        for c_idx in active:
            for a in range(A):
                val = binary[t, c_idx, a]
                print(f" {int(val):>6d}", end="")
            print(f" {agg_labels[t, c_idx]:>6d}", end="")
        print()

    return example_fname, active


def section_2c():
    """Analyze label characteristics after aggregation."""
    print("\n" + "=" * 60)
    print("SECTION 2c: Label Characteristics")
    print("=" * 60)

    plt = setup_plotting()
    import seaborn as sns

    class_segments = np.zeros(15, dtype=int)
    cooccurrence = np.zeros((15, 15), dtype=int)
    env_class_counts = defaultdict(lambda: np.zeros(15, dtype=int))

    total_segments = 0

    for fname, npz in iter_npz_files():
        ann = npz["annotations"]
        T, C, A = ann.shape
        binary = (ann >= 0.5).astype(np.float32)
        mean_ann = np.mean(binary, axis=2)
        labels = (mean_ann >= 0.5).astype(int)  # [T, C]

        class_segments += np.sum(labels, axis=0)
        total_segments += T

        # Co-occurrence
        for t in range(T):
            active = np.where(labels[t] > 0)[0]
            for i in active:
                for j in active:
                    cooccurrence[i, j] += 1

        # Environment
        env = str(npz["recording_environments"])
        if ";" in env:
            env = env.split(";")[0].strip()
        env = env.strip("[]'\" ")
        env_class_counts[env] += np.sum(labels, axis=0)

    # Print class frequencies
    print(f"\nTotal segments across all files: {total_segments}")
    print(f"\n{'Class':<30s} {'Segments':>10s} {'Duration(s)':>12s} {'% of total':>10s}")
    print("-" * 64)
    for c, name in enumerate(CLASS_NAMES):
        dur = class_segments[c] * 0.5
        pct = 100.0 * class_segments[c] / total_segments
        print(f"{name:<30s} {class_segments[c]:>10d} {dur:>12.1f} {pct:>10.2f}%")

    # Combined figure: class frequency + co-occurrence side by side
    diag = np.diag(cooccurrence).copy()
    diag[diag == 0] = 1
    cond_prob = cooccurrence / diag[:, None]
    np.fill_diagonal(cond_prob, 0)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(7.5, 3.2),
                                    gridspec_kw={"width_ratios": [1, 1.3]})
    colors = sns.color_palette("colorblind", 15)

    # Left: class frequency
    ax1.barh(range(15), class_segments, color=colors)
    ax1.set_yticks(range(15))
    ax1.set_yticklabels([n.replace("_", " ") for n in CLASS_NAMES], fontsize=6)
    ax1.set_xlabel("Positive segments", fontsize=7)
    ax1.invert_yaxis()
    ax1.set_title("(a) Class Frequency", fontsize=8)
    ax1.tick_params(axis="x", labelsize=6)

    # Right: co-occurrence heatmap
    short_labels = [n.replace("_", "\n") for n in SHORT_CLASS_NAMES]
    im = ax2.imshow(cond_prob, cmap="YlOrRd", aspect="auto", vmin=0, vmax=0.5)
    ax2.set_xticks(range(15))
    ax2.set_yticks(range(15))
    ax2.set_xticklabels(short_labels, fontsize=5, rotation=45, ha="right")
    ax2.set_yticklabels(short_labels, fontsize=5)
    ax2.set_title("(b) Co-occurrence P(col|row)", fontsize=8)
    plt.colorbar(im, ax=ax2, shrink=0.7, label="P(col|row)",
                 pad=0.02, aspect=20)

    plt.tight_layout()
    fig.savefig(str(FIGURES_DIR / "labels_combined.pdf"))
    plt.close()
    print(f"\nSaved: figures/labels_combined.pdf")

    return class_segments, cooccurrence


if __name__ == "__main__":
    class_ious, own_mean, other_mean = section_2a()
    example_fname, active_classes = section_2b()
    class_segments, cooccurrence = section_2c()
    print("\n" + "=" * 60)
    print("Section 2 analysis complete.")
