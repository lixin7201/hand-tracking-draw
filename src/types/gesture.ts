export interface HandLandmark {
  x: number;
  y: number;
  z: number;
}

export interface HandResults {
  multiHandLandmarks?: HandLandmark[][];
  multiHandWorldLandmarks?: HandLandmark[][];
  multiHandedness?: Array<{
    index: number;
    score: number;
    label: string;
  }>;
}

export type GestureType = 'fist' | 'one_finger' | 'two_fingers' | 'three_fingers' | 'five_fingers' | 'pinch' | 'peace' | 'ok';

export interface GestureState {
  currentGesture: GestureType | null;
  lastGesture: GestureType | null;
  pinchCount: number;
  lastPinchTime: number;
  mouseMode: boolean;
}