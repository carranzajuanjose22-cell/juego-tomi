import type { GameRecord, EndReason } from '../types/game';
const STORAGE_KEY = 'tlachtli-game-history-v1';
export function getHistory(): GameRecord[] {
 try {
  const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((item): item is GameRecord => item && typeof item.id === 'string' &&
   Number.isFinite(item.score) && item.score >= 0 && Number.isInteger(item.level) && item.level > 0 &&
   typeof item.date === 'string' && Number.isFinite(Date.parse(item.date)) &&
   (item.playerName === undefined || typeof item.playerName === 'string') &&
   ['Game Over','Partida abandonada','FIN DEL JUEGO'].includes(item.reason));
 } catch { return []; }
}
export function addGameRecord(playerName: string, score: number, level: number, reason: EndReason): boolean {
 const record: GameRecord = { id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
  playerName: playerName.trim().slice(0,20), score, level, date: new Date().toISOString(), reason };
 try { localStorage.setItem(STORAGE_KEY, JSON.stringify([record, ...getHistory()].slice(0,100))); return true; }
 catch { return false; }
}
export function clearHistory(): boolean {
 try { localStorage.removeItem(STORAGE_KEY); return true; } catch { return false; }
}
export function getRanking(history: GameRecord[] = getHistory()) {
 return [...history].sort((a,b) => b.score-a.score || Date.parse(b.date)-Date.parse(a.date)).slice(0,5);
}
