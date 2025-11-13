export interface Strategy {
  code: string;
  strokesByLayer: { [key: string]: {x: number, y: number}[][] };
}
