"""Shared utilities for MLPC 2026 Task 3 data exploration."""

import os
import numpy as np
import pandas as pd
from pathlib import Path

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "MLPC2026_dataset_development"
FIGURES_DIR = PROJECT_DIR / "figures"
NPZ_DIR = DATA_DIR / "audio_features"

CLASS_NAMES = [
    "bell_ringing", "coffee_machine", "cutlery_dishes", "door_open_close",
    "footsteps", "keyboard_typing", "keychain", "light_switch", "microwave",
    "phone_ringing", "running_water", "toilet_flushing", "vacuum_cleaner",
    "wardrobe_drawer_open_close", "window_open_close",
]

SHORT_CLASS_NAMES = [
    "bell", "coffee", "cutlery", "door", "foot", "keyboard", "keychain",
    "light", "micro", "phone", "water", "toilet", "vacuum", "wardrobe", "window",
]


def load_npz(filename):
    """Load a single NPZ file and return as dict.

    Note: allow_pickle=True is required because NPZ files contain
    object arrays (string class names, annotator IDs) from the
    course-provided academic dataset.
    """
    path = NPZ_DIR / filename
    return dict(np.load(str(path), allow_pickle=True))


def iter_npz_files():
    """Yield (filename, npz_dict) for all NPZ files sorted by name."""
    filenames = sorted(f for f in os.listdir(str(NPZ_DIR)) if f.endswith(".npz"))
    for fname in filenames:
        yield fname, load_npz(fname)


def load_annotations_csv():
    """Load the annotations CSV file."""
    return pd.read_csv(str(DATA_DIR / "annotations.csv"))


def load_metadata_csv():
    """Load the metadata CSV file."""
    return pd.read_csv(str(DATA_DIR / "metadata.csv"))


def setup_plotting():
    """Configure matplotlib for publication-quality figures."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    plt.rcParams.update({
        "figure.dpi": 150,
        "savefig.dpi": 300,
        "savefig.bbox": "tight",
        "font.size": 9,
        "axes.titlesize": 10,
        "axes.labelsize": 9,
        "xtick.labelsize": 8,
        "ytick.labelsize": 8,
        "legend.fontsize": 8,
        "figure.figsize": (5.5, 3.5),
    })
    return plt
