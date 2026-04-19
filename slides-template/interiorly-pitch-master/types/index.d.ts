declare module "react-katex" {
  import * as React from "react";
  export interface MathComponentProps {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
  }
  export class InlineMath extends React.Component<MathComponentProps> {}
  export class BlockMath extends React.Component<MathComponentProps> {}
}

type SocketMessage = {
  msg: string;
  rank?: number;
  success?: boolean;
  output?: {
    error?: string;
    data?: string[][];
  };
  avg_event_process_time?: number;
  queue_size?: number;
};

interface ImageBatch {
  prompt: string;
  timestamp: number;
  batch: string[];
}

interface AnimationComponent {
  id: number;
  component: JSX.Element;
}
