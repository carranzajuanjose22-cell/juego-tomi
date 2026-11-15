export type EndReason = 'Game Over' | 'Partida abandonada' | 'FIN DEL JUEGO';

export interface GameRecord {
  id: string;
  playerName?: string;
  score: number;
  level: number;
  date: string; // ISO string
  reason: EndReason;
}
