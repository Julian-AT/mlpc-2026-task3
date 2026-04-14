import * as tf from "@tensorflow/tfjs";

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
  perClassF1: number[];
}

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
}

const DEFAULT_CONFIG: TrainingConfig = {
  epochs: 20,
  batchSize: 64,
  learningRate: 0.001,
  validationSplit: 0.2,
};

export function createModel(featureDim: number, numClasses: number): tf.LayersModel {
  const model = tf.sequential();

  model.add(tf.layers.dense({
    inputShape: [featureDim],
    units: 128,
    activation: "relu",
    kernelInitializer: "heNormal",
  }));

  model.add(tf.layers.dropout({ rate: 0.3 }));

  model.add(tf.layers.dense({
    units: 64,
    activation: "relu",
    kernelInitializer: "heNormal",
  }));

  model.add(tf.layers.dense({
    units: numClasses,
    activation: "sigmoid",
  }));

  return model;
}

function computePerClassF1(
  predictions: Float32Array,
  labels: Float32Array,
  numSamples: number,
  numClasses: number,
  threshold = 0.5,
): number[] {
  const f1s: number[] = [];

  for (let c = 0; c < numClasses; c++) {
    let tp = 0, fp = 0, fn = 0;
    for (let i = 0; i < numSamples; i++) {
      const pred = predictions[i * numClasses + c] >= threshold ? 1 : 0;
      const label = labels[i * numClasses + c];
      if (pred === 1 && label === 1) tp++;
      else if (pred === 1 && label === 0) fp++;
      else if (pred === 0 && label === 1) fn++;
    }
    const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
    const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    f1s.push(f1);
  }

  return f1s;
}

export async function trainModel(
  features: number[][],
  labels: number[][],
  config: Partial<TrainingConfig> = {},
  onEpochEnd: (metrics: TrainingMetrics) => void,
  onBackendReady: (backend: string) => void,
): Promise<tf.LayersModel> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  // Try WebGPU first, fall back to WebGL
  try {
    await tf.setBackend("webgpu");
    await tf.ready();
  } catch {
    try {
      await tf.setBackend("webgl");
      await tf.ready();
    } catch {
      await tf.setBackend("cpu");
      await tf.ready();
    }
  }

  onBackendReady(tf.getBackend());

  const featureDim = features[0].length;
  const numClasses = labels[0].length;
  const numSamples = features.length;

  // Split into train/val
  const splitIdx = Math.floor(numSamples * (1 - cfg.validationSplit));
  const indices = Array.from({ length: numSamples }, (_, i) => i);
  // Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const trainFeatures = indices.slice(0, splitIdx).map(i => features[i]);
  const trainLabels = indices.slice(0, splitIdx).map(i => labels[i]);
  const valFeatures = indices.slice(splitIdx).map(i => features[i]);
  const valLabels = indices.slice(splitIdx).map(i => labels[i]);

  const xTrain = tf.tensor2d(trainFeatures);
  const yTrain = tf.tensor2d(trainLabels);
  const xVal = tf.tensor2d(valFeatures);
  const yVal = tf.tensor2d(valLabels);

  const model = createModel(featureDim, numClasses);

  model.compile({
    optimizer: tf.train.adam(cfg.learningRate),
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  await model.fit(xTrain, yTrain, {
    epochs: cfg.epochs,
    batchSize: cfg.batchSize,
    validationData: [xVal, yVal],
    callbacks: {
      onEpochEnd: async (epoch, logs) => {
        // Compute per-class F1 on validation set
        const preds = model.predict(xVal) as tf.Tensor;
        const predsData = await preds.data() as Float32Array;
        const labelsData = await yVal.data() as Float32Array;
        const perClassF1 = computePerClassF1(
          predsData,
          labelsData,
          valFeatures.length,
          numClasses,
        );
        preds.dispose();

        onEpochEnd({
          epoch: epoch + 1,
          loss: logs?.loss ?? 0,
          accuracy: logs?.acc ?? 0,
          valLoss: logs?.val_loss ?? 0,
          valAccuracy: logs?.val_acc ?? 0,
          perClassF1,
        });
      },
    },
  });

  // Cleanup tensors
  xTrain.dispose();
  yTrain.dispose();
  xVal.dispose();
  yVal.dispose();

  return model;
}
