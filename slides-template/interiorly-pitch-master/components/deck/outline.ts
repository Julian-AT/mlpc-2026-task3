/**
 * Single source of truth for slide order (mirrors `mlpc_report.tex` narrative).
 * Keys must match exports in `components/pitch/slides/index.tsx`.
 */
export const MLPC_SLIDE_KEYS = [
  "SlideMlpcTitle",
  "SlideMlpcOverview",
  "SlideMlpcFailureModes",
  "SlideMlpcCaseStudy",
  "SlideMlpcAgreement",
  "SlideMlpcIouMafs",
  "SlideMlpcAggregation",
  "SlideMlpcLabels",
  "SlideMlpcMetadata",
  "SlideMlpcFeatures",
  "SlideMlpcCorrTsne",
  "SlideMlpcConclusions",
  "SlideMlpcImpact",
] as const;

export type MlpcSlideKey = (typeof MLPC_SLIDE_KEYS)[number];

export const MLPC_SLIDE_COUNT = MLPC_SLIDE_KEYS.length;

/** Human-readable map for maintainers (report section → slide). */
export const MLPC_OUTLINE = [
  { key: "SlideMlpcTitle", report: "Title + abstract", notes: "Dataset scale, SED context" },
  { key: "SlideMlpcOverview", report: "§1 Verify…", notes: "Acceptance criteria, goals" },
  { key: "SlideMlpcFailureModes", report: "§1.2", notes: "Step-reveal four failure modes" },
  { key: "SlideMlpcCaseStudy", report: "§1.3 + Table", notes: "002871 interactive table" },
  { key: "SlideMlpcAgreement", report: "§2.1 + Table", notes: "Per-class IoU bar chart, own vs other" },
  { key: "SlideMlpcIouMafs", report: "§2.1 IoU definition", notes: "Mafs interval IoU scene" },
  { key: "SlideMlpcAggregation", report: "§2.2", notes: "Majority vote + threshold sweep" },
  { key: "SlideMlpcLabels", report: "§2.3 + Fig", notes: "Frequency bars + co-occurrence heatmap" },
  { key: "SlideMlpcMetadata", report: "§3.1 + Fig", notes: "Devices, placement, environments" },
  { key: "SlideMlpcFeatures", report: "§3.2 Table", notes: "Feature summary stats" },
  { key: "SlideMlpcCorrTsne", report: "§3.3–3.4 + Fig", notes: "Correlation heatmap + t-SNE scatter" },
  { key: "SlideMlpcConclusions", report: "§4.1–4.2", notes: "Biases + recommendations" },
  { key: "SlideMlpcImpact", report: "§4.3 + disclosure", notes: "Privacy + links" },
] as const satisfies ReadonlyArray<{ key: MlpcSlideKey; report: string; notes: string }>;
