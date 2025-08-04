export interface DrawingState {
  isDrawing: boolean;
  currentColor: string;
  brushSize: number;
  brushType: string;
  opacity: number;
  texture: number;
  scatter: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface DrawingPath {
  points: Point[];
  color: string;
  size: number;
  brushType: string;
  opacity: number;
}