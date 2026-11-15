import { useState } from 'react';
import { getHistory, getRanking, clearHistory } from '../utils/gameHistory';
export default function HistoryPanel() {
 const [history,setHistory] = useState(getHistory);
 const [tab,setTab] = useState<'recent'|'ranking'>('recent');
 const [error,setError] = useState('');
 const entries = tab === 'ranking' ? getRanking(history) : history.slice(0,10);
 return <section className="history-panel" aria-label="Historial y ranking">
 <div className="section-heading"><div><span className="eyebrow">LA HUELLA DE CADA PARTIDA</span><h2>El registro de la cancha</h2></div><span className="jade-seal" aria-hidden="true">◇</span></div>
 <div className="history-tabs"><button aria-pressed={tab==='recent'} onClick={()=>setTab('recent')}>Últimas partidas</button><button aria-pressed={tab==='ranking'} onClick={()=>setTab('ranking')}>Mejores 5</button></div>
 {entries.length ? <ol className="records">{entries.map((r,i)=><li key={r.id}><span className="record-position">{String(i+1).padStart(2,'0')}</span><div><strong>{r.playerName || 'Jugador anónimo'}</strong><small>{new Date(r.date).toLocaleString('es-AR',{dateStyle:'short',timeStyle:'short'})} · Nivel {r.level}{r.reason === 'Partida abandonada' ? ' · Abandonada' : ''}</small></div><b>{r.score.toLocaleString('es-AR')} <small>pts</small></b></li>)}</ol> : <p className="empty-state">La cancha espera tu primera partida.</p>}
 <div className="history-footer"><small>Guardado en este navegador · Hasta 100 partidas.<br/>El ranking considera esas partidas; no se comparte entre dispositivos.</small>{history.length>0 && <button className="text-button" onClick={()=>{if(window.confirm('¿Borrar el historial de este navegador?')) { if(clearHistory()) setHistory([]); else setError('No se pudo borrar el historial.'); }}}>Borrar historial</button>}</div>
 {error && <p role="alert">{error}</p>}
 </section>;
}
