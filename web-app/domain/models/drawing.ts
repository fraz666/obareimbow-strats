export interface DrawingStroke {
  playerId: number;
  color: string;
  tool: string;
  points: { x: number; y: number }[];
  layer: number;
}

export interface UtilityMarker {
  playerId: number;
  color: string;
  x: number;
  y: number;
  layer: number;
}