import { useState } from 'react';
import courtBg from '../assets/court-background-clean.png';
import HistoryPanel from './HistoryPanel';
export const GAME_TITLE = 'La senda del aro';
export default function MainMenu({onNewGame,defaultName=''}:{onNewGame:(name:string)=>void;defaultName?:string}) {
 const [name,setName] = useState(defaultName);
 const [history,setHistory] = useState(false);
 return <main className="menu-page">
 <header className="site-header"><a className="wordmark" href="#inicio"><span aria-hidden="true">◈</span> PIEDRA & JADE</a><span className="edition">JUEGO DE PELOTA · EDICIÓN ARCADE</span><button className="text-button" onClick={()=>setHistory(!history)}>{history?'Volver al inicio':'Historial y ranking'} ↗</button></header>
 {history ? <div className="history-page"><HistoryPanel/></div> : <>
 <section className="menu-hero" id="inicio"><div className="hero-copy"><span className="eyebrow">PRECISIÓN. IMPULSO. TRADICIÓN.</span><h1>La senda<br/>del <em>aro.</em></h1><p className="hero-description">Entrá a la cancha de piedra. Encontrá el ángulo, medí tu fuerza y dejá tu huella.</p>
 <form onSubmit={e=>{e.preventDefault();if(name.trim())onNewGame(name.trim());}}><label htmlFor="player-name">TU NOMBRE EN LA CANCHA</label><input id="player-name" autoComplete="nickname" maxLength={20} placeholder="Nombre del jugador" required value={name} onChange={e=>setName(e.target.value)} /><button className="primary-button" disabled={!name.trim()}>Comenzar partida <span>→</span></button></form>
 <div className="hero-meta"><span>03 vidas de jade</span><span>Sin límite de tiempo</span><span>Tu mejor marca</span></div></div>
 <div className="hero-art"><img src={courtBg} alt="Ilustración de una cancha de piedra con relieves y un jugador de pelota"/><div className="art-caption"><span>01 / LA CANCHA</span><strong>Un golpe. Una oportunidad.</strong><small>Inspirado en el juego de pelota maya.</small></div><span className="art-seal" aria-hidden="true">◇</span></div></section>
 <section className="instructions" aria-label="Cómo jugar"><div><span className="eyebrow">EL ARTE DEL GOLPE</span><h2>Un objetivo.<br/>Encontrá tu trayectoria.</h2></div><div><b><kbd>←</kbd> <kbd>→</kbd> Posicionate</b><p>Movete por la cancha para encontrar el lugar del golpe.</p></div><div><b><kbd>↑</kbd> <kbd>↓</kbd> Ajustá el ángulo</b><p>Elevá o bajá la trayectoria. La guía te ayuda a apuntar.</p></div><div><b><kbd>Espacio</kbd> Cargá y soltá</b><p>Mantené para cargar potencia; soltá para golpear. P o Esc: pausa.</p></div></section>
 </>}
 <footer className="site-footer"><span>Creado por Tomás Corvalán</span><p>Adaptación de precisión inspirada en Mesoamérica. Las reglas, los combos y la guía de tiro son recursos arcade, no una reconstrucción histórica.</p><span>PIEDRA · CAUCHO · JADE</span></footer>
 </main>;
}
