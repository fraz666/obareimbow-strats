export interface Strategy {
  code: string;
  players: (string | null)[];
  traces: TraceGroupByLayer;
}

export type TraceGroupByLayer = { [key: string]: TraceGroupByPlayer };
export type TraceGroupByPlayer = { [key: number]: TraceGroupByStroke };
export type TraceGroupByStroke = {x: number, y: number}[][];