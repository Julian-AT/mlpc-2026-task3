import raw from "@/data/mlpc-deck-data.json";

export type MlpcDeckData = {
  source: string;
  disclaimer?: string | null;
  aggregation?: {
    thresholdSweep: { threshold: number; deltaOverallIou: number }[];
    singleAnnotatorShare: number;
  };
  caseStudy?: {
    file: string;
    agreementPct: number;
    rows: { class: string; annotatorA: number; annotatorB: number }[];
    totals: { annotatorA: number; annotatorB: number };
  };
  agreement: {
    perClassIou: { class: string; iou: number }[];
    overall: number;
    ownPairs: { mean: number; n: number };
    otherPairs: { mean: number; n: number };
    bootstrapCi95: [number, number];
    permutationP: number;
    filesWithTwoPlusAnnotators: number;
    totalRecordings: number;
  };
  labels: {
    totalSegments: number;
    classSegments: { class: string; count: number; pct: number }[];
    cooccurrenceCond: number[][];
  };
  metadata: {
    devices: { label: string; count: number }[];
    placement: { label: string; count: number }[];
    environments: { label: string; count: number }[];
    uniqueDevices: number;
    medianDurationSec: number;
    iqrSec: [number, number];
    durationRangeSec: [number, number];
  };
  features: {
    stats: { feature: string; mean: number; std: number; min: number; max: number }[];
    correlation: { labels: string[]; matrix: number[][] };
  };
  tsne: { points: { x: number; y: number; classIndex: number; class: string }[]; note?: string };
};

export const mlpcDeckData = raw as MlpcDeckData;

export const CLASS_COLOR: Record<string, string> = {
  bell_ringing: "hsl(210 70% 55%)",
  coffee_machine: "hsl(25 85% 55%)",
  cutlery_dishes: "hsl(280 60% 60%)",
  door_open_close: "hsl(340 70% 55%)",
  footsteps: "hsl(145 55% 45%)",
  keyboard_typing: "hsl(200 80% 55%)",
  keychain: "hsl(50 90% 50%)",
  light_switch: "hsl(265 75% 60%)",
  microwave: "hsl(15 80% 55%)",
  phone_ringing: "hsl(190 70% 50%)",
  running_water: "hsl(200 90% 45%)",
  toilet_flushing: "hsl(160 45% 45%)",
  vacuum_cleaner: "hsl(220 20% 55%)",
  wardrobe_drawer_open_close: "hsl(30 60% 50%)",
  window_open_close: "hsl(175 60% 45%)",
};
