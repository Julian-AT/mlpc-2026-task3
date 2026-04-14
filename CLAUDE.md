# MLPC 2026 Task 3: Data Exploration

## Project Overview

This is a master's level Machine Learning and Pattern Classification course assignment from Johannes Kepler University Linz. The task involves exploratory data analysis of a Sound Event Detection (SED) dataset for smart home environments.

**Deadline:** April 16th, 23:59
**Total Points:** 25 (22 report + 3 slides)

## Repository Structure

```
project/
├── CLAUDE.md                    # This file
├── mlpc_report.tex              # Main LaTeX report (NeurIPS 2023 format)
├── figures/                     # Generated figures for the report
├── scripts/                     # Analysis scripts
│   ├── section2_annotations.py
│   ├── section3_features.py
│   └── utils.py
└── data/                        # Symlink or path to dataset
    ├── annotations.csv
    ├── metadata.csv
    └── audio_features/
        └── *.npz
```

## Dataset Location

The dataset is extracted at: `/home/claude/dataset/`
- `annotations.csv` - 37,420 annotation rows
- `metadata.csv` - Recording metadata
- `audio_features/` - 3,656 NPZ files with precomputed features

## Writing Standards

### LaTeX Style Requirements
- Use NeurIPS 2023 template formatting
- No em-dashes (use commas or semicolons instead)
- No informal language or AI-typical phrasing
- Professional, master's level academic writing
- Reference all figures and tables in text (e.g., "Table~\ref{tab:name}")
- Use `booktabs` for tables (no vertical rules)
- Use `\texttt{}` for class names and technical terms

### Figure Standards
- Save as PDF or PNG (PDF preferred for vector graphics)
- Use consistent color schemes
- Include proper axis labels and legends
- Caption should be descriptive and self-contained

## Section 2: Annotations (6 points)

### 2a: Annotator Agreement (2 points)
Quantify agreement between annotators:
- Compute overall inter-annotator agreement metric (e.g., Fleiss' kappa, Krippendorff's alpha, or IoU-based agreement)
- Compute class-wise agreement scores
- Analyze whether annotators perform differently on their own recordings vs others' recordings
- Present results in a table

### 2b: Convert Annotations to Labels (2 points)
Aggregate raw annotations into binary prediction targets:
- The NPZ files contain `annotations` array of shape `[T, C, A]` where T=time segments, C=classes, A=annotators
- Values range from 0.0 (no overlap) to 1.0 (full overlap)
- Define and justify an aggregation strategy (e.g., majority vote, threshold-based, union)
- Discuss assumptions made and potential sources of error
- Show example of aggregation on one recording

### 2c: Label Characteristics (2 points)
Analyze the resulting label distribution:
- Frequency of each class (bar chart)
- Average and total duration per class
- Class co-occurrence matrix (heatmap)
- Distribution across recording locations/environments
- Identify class imbalance issues

## Section 3: Audio Features (6 points + 2 bonus)

### 3a: Metadata Distribution (2 points)
Analyze recording metadata from NPZ files or metadata.csv:
- Distribution of recording devices
- Distribution of device placements (mobile vs static)
- Distribution of recording environments/locations
- Present as tables or bar charts

### 3b: Feature Statistics (2 points)
Compute statistics for audio features:
- Mean, std, min, max across the dataset
- Focus on key feature groups: MFCCs, spectral features, energy
- Present in a summary table

### 3c: Feature Correlation (2 points)
Analyze feature relationships:
- Correlation matrix for feature categories
- Identify highly correlated feature groups
- Discuss implications for feature selection
- Use heatmap visualization

### 3d: Feature Space Visualization (BONUS - 2 points)
Dimensionality reduction visualization:
- Select representative features (e.g., MFCC means, spectral features)
- Apply PCA, UMAP, or t-SNE
- Color by class label or metadata
- Use high-quality subset (high agreement, single class per segment)

## Section 4: Conclusions (2 points)

### 4a: Dataset Biases
Identify at least 3 biases from collection/annotation phases:
- Recording device bias
- Environment/location bias
- Annotator bias (own vs others' recordings)
- Class frequency imbalance
- Discuss consequences for model training

### 4b: Dataset Suitability
- Is the dataset suitable for training SED systems?
- What aspects will make classification challenging?

### 4c: Broader Impact
- Positive applications of SED technology
- Potential negative impacts or misuse scenarios
- Ethical considerations and mitigation measures

## Data Loading Code

### Loading NPZ files
```python
import numpy as np

npz = dict(np.load('path/to/file.npz', allow_pickle=True))

# Key arrays:
# npz['annotations']      # [T, C, A] annotation overlaps
# npz['class_names']      # [C] class name strings
# npz['annotator_ids']    # [A] annotator IDs
# npz['is_own_recording'] # [A] bool array
# npz['end_time']         # [T] segment end times
# npz['mfcc_mean']        # [T, 32] MFCC features
# npz['melspect_mean']    # [T, 128] Mel spectrogram
# etc.
```

### Loading CSV files
```python
import pandas as pd

annotations = pd.read_csv('annotations.csv')
# Columns: filename, annotator_id, annotation, onset, offset, is_own_recording

metadata = pd.read_csv('metadata.csv')
# Columns: filename, collector_id, target_classes, non_target_classes,
#          recording_device, device_placement, recording_environment,
#          scene_description, license
```

## Class Names (15 classes)
```
bell_ringing, coffee_machine, cutlery_dishes, door_open_close, footsteps,
keyboard_typing, keychain, light_switch, microwave, phone_ringing,
running_water, toilet_flushing, vacuum_cleaner, wardrobe_drawer_open_close,
window_open_close
```

## Current Progress

- [x] Section 1a: Annotation verification (completed in Label Studio)
- [x] Section 1b: Summary of disagreements (written)
- [x] Section 1c: Case study (written)
- [ ] Section 2a: Annotator agreement analysis
- [ ] Section 2b: Label aggregation
- [ ] Section 2c: Label characteristics
- [ ] Section 3a: Metadata distribution
- [ ] Section 3b: Feature statistics
- [ ] Section 3c: Feature correlation
- [ ] Section 3d: Feature visualization (bonus)
- [ ] Section 4: Conclusions
- [ ] Slides (3 content slides)

## Commands

```bash
# Compile LaTeX
pdflatex mlpc_report.tex

# Run analysis scripts
python scripts/section2_annotations.py
python scripts/section3_features.py
```
