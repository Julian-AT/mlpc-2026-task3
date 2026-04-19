# MLPC 2026 Task 3 — interactive slide deck

## Run locally

```bash
cd slides-template/interiorly-pitch-master
npm install
npm run dev
```

Open `/en` (or `/de`) — slides use `?slide=N` in the URL.

## Deck data (`data/mlpc-deck-data.json`)

Charts and tables read from committed JSON. Regenerate from the course dataset (when `MLPC2026_dataset_development/` is present) or refresh the static fallback:

```bash
# from repo root
python3 scripts/export_deck_data.py
```

With the dataset, the export writes measured IoU, label counts, co-occurrence, metadata, feature stats, and correlation from NPZ/CSV. Without it, the script writes a **static_tex_fallback** aligned to the published `mlpc_report.tex` tables (see disclaimer string in JSON for schematic panels).

## Stack (per report deck)

- **Mafs** — draggable interval IoU scene (`components/deck/iou-interval-mafs.tsx`)
- **KaTeX** (`react-katex`) — equation blocks (`components/deck/math.tsx`)
- **Framer Motion** — transitions and animated metrics
- **Recharts** — bar charts inside `components/ui/chart.tsx` shell
- **`@use-gesture/react`** — pan on t-SNE scatter (`components/deck/tsne-scatter.tsx`)
