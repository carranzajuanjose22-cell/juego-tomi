import { useEffect, useRef, useState } from 'react';
import Court, { Player } from './Court';
import GameBall from './GameBall';
import GameRing from './GameRing';
import ScoreDisplay from './ScoreDisplay';
import PowerMeter from './PowerMeter';
import HistoryPanel from './HistoryPanel';
import { GameEngine } from '../utils/gameEngine';
import { GameAudio } from '../utils/gameAudio';
import { BALL_BX, BALL_BY, RING_CENTER_X, RING_CENTER_Y, simulateTrajectory } from '../utils/ballPhysics';
import { addGameRecord } from '../utils/gameHistory';

const snapshot = (g: GameEngine) => ({score:g.score,level:g.level,lives:g.lives,combo:g.combo,
 phase:g.phase,paused:g.paused,angle:Math.round(g.angle),power:Math.round(g.power),message:g.message,event:g.event});
export default function Game({onReturnToMenu,playerName}:{onReturnToMenu:()=>void;playerName:string}) {
 const engine = useRef(new GameEngine());
 const audio = useRef(new GameAudio());
 const ball = useRef<SVGGElement>(null), player = useRef<SVGGElement>(null);
 const arc = useRef<SVGPathElement>(null), angleLabel = useRef<SVGTextElement>(null);
 const celebration = useRef<SVGGElement>(null);
 const recorded = useRef(false);
 const [ui,setUi] = useState(()=>snapshot(engine.current));
 const [muted,setMuted] = useState(false), [showHistory,setShowHistory] = useState(false);
 const [saveError,setSaveError] = useState(false);
 const sync = () => setUi(snapshot(engine.current));
 const record = (abandoned=false) => {
  if(recorded.current) return;
  recorded.current = true;
  const g = engine.current;
  setSaveError(!addGameRecord(playerName,g.score,g.level,abandoned?'Partida abandonada':'FIN DEL JUEGO'));
 };
 const togglePause = () => {const g=engine.current;if(g.phase==='gameover')return;if(g.paused)g.paused=false;else g.pause();sync();};
 const start = () => {audio.current.unlock();engine.current.startCharge();sync();};
 const release = () => {engine.current.release();sync();};
 const reset = () => {
  if(!recorded.current) record(true);
  engine.current = new GameEngine(); recorded.current=false;setShowHistory(false);setSaveError(false);sync();
 };
 const leave = () => {if(!recorded.current)record(true);onReturnToMenu();};
 useEffect(()=>{
  let frame=0,last=performance.now(),lastUi=0,previousEvent=0,previousSnapshot='';
  const loop=(now:number)=>{
   const g=engine.current;
   g.update((now-last)/1000);last=now;
   const moving = g.keys.has('a') || g.keys.has('d');
   const lean = g.phase==='flying' && g.phaseTime<.22 ? -12 : g.phase==='charging' ? -g.power*.06 : 0;
   const bob = moving && (g.phase==='ready'||g.phase==='charging') ? Math.sin(g.clock*18)*3 : 0;
   player.current?.setAttribute('transform',`translate(${BALL_BX+g.x-32} ${BALL_BY+8+bob}) rotate(${lean})`);
   if(ball.current) {
    const st=g.ball;
    const scale=g.phase==='scoring'?Math.max(.15,1-g.phaseTime*.9):1;
    const x=st?.x ?? BALL_BX+g.x, y=st?.y ?? BALL_BY;
    ball.current.style.transform=`translate(${x}px,${y}px) rotate(${st?.rot ?? 0}deg) scale(${scale})`;
    ball.current.style.opacity=g.phase==='gameover'?'0':g.phase==='scoring'?String(Math.max(0,1-g.phaseTime)): '1';
   }
   if(arc.current) {
    const aiming=g.phase==='ready'||g.phase==='charging';
    arc.current.setAttribute('d',aiming?simulateTrajectory(BALL_BX+g.x,BALL_BY,g.power || 52,g.angle,0,230):'');
   }
   if(angleLabel.current) {angleLabel.current.textContent=`${Math.round(g.angle)}°`;angleLabel.current.setAttribute('x',String(BALL_BX+g.x));}
   if(celebration.current) {
    const active=g.phase==='scoring';
    celebration.current.style.opacity=active?String(Math.max(0,1-g.phaseTime)): '0';
    celebration.current.setAttribute('transform',`translate(${RING_CENTER_X} ${RING_CENTER_Y}) scale(${1+g.phaseTime*1.8})`);
   }
   if(g.event!==previousEvent) {audio.current.play(g.scored);previousEvent=g.event;}
   if(g.phase==='gameover'&&!recorded.current)record();
   // Physics and SVG run at frame rate; React receives only changed HUD snapshots at 12 Hz.
   if(now-lastUi>80) {const next=snapshot(g),serialized=JSON.stringify(next);if(serialized!==previousSnapshot){setUi(next);previousSnapshot=serialized;}lastUi=now;}
   frame=requestAnimationFrame(loop);
  };
  frame=requestAnimationFrame(loop);
  const normalize=(key:string)=>({ArrowLeft:'a',ArrowRight:'d',ArrowUp:'w',ArrowDown:'s'}[key]||key.toLowerCase());
  const keydown=(e:KeyboardEvent)=>{
   const k=normalize(e.key);
   if(['a','d','w','s',' ','p','escape'].includes(k))e.preventDefault();
   if(e.repeat)return;
   const g=engine.current;
   if(k==='p'||k==='escape'){togglePause();return;}
   if(g.paused||g.phase==='gameover')return;
   if(['a','d','w','s'].includes(k))g.keys.add(k);
   if(k===' '){if(document.activeElement instanceof HTMLButtonElement)document.activeElement.blur();start();}
  };
  const keyup=(e:KeyboardEvent)=>{const k=normalize(e.key);if(['a','d','w','s',' '].includes(k))e.preventDefault();engine.current.keys.delete(k);if(k===' ')release();};
  const blur=()=>{if(engine.current.phase!=='gameover'){engine.current.pause();sync();}};
  const visibility=()=>{if(document.hidden)blur();};
  window.addEventListener('keydown',keydown,{passive:false});window.addEventListener('keyup',keyup,{passive:false});window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);
  return ()=>{cancelAnimationFrame(frame);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);audio.current.close();};
 },[playerName]);
 const direction=(key:string)=>(<button key={key} className="direction-button" aria-label={{a:'Mover a la izquierda',d:'Mover a la derecha',w:'Subir ángulo',s:'Bajar ángulo'}[key]}
  disabled={ui.paused||ui.phase==='gameover'} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);engine.current.keys.add(key);}}
  onPointerUp={()=>engine.current.keys.delete(key)} onPointerCancel={()=>engine.current.keys.delete(key)} onLostPointerCapture={()=>engine.current.keys.delete(key)}>{({a:'←',d:'→',w:'↑',s:'↓'})[key]}</button>);
 return <main className={`game-page ${ui.paused?'is-paused':''}`}>
 <header className="game-header"><div className="game-brand"><span className="eyebrow">PIEDRA & JADE</span><strong>La senda del aro</strong></div><div className="player-name">{playerName}<small>Nivel {ui.level} · Combo ×{ui.combo}</small></div><ScoreDisplay score={ui.score}/><div className="lives" aria-label={`${ui.lives} vidas restantes`}>{[0,1,2].map(i=><span key={i} className={i<ui.lives?'':'spent'}>◆</span>)}</div><button onClick={togglePause} disabled={ui.phase==='gameover'} aria-label={ui.paused?'Continuar partida':'Pausar partida'}>{ui.paused?'▶':'Ⅱ'}<span className="desktop-label"> Pausa</span></button><button onClick={()=>{audio.current.enabled=!audio.current.enabled;setMuted(!audio.current.enabled);audio.current.unlock();}} aria-label={muted?'Activar sonido':'Silenciar sonido'}>{muted?'Sonido: no':'Sonido: sí'}</button></header>
 <div className="court-stage"><svg viewBox="0 0 1024 576" role="img" aria-label="Cancha de piedra. Apuntá al aro de la pared derecha."><Court/><GameRing/><path ref={arc} fill="none" stroke="#f4e3b8" strokeWidth="3" strokeDasharray="4 9" opacity=".8"/>
 <g ref={player}><Player/></g><GameBall ref={ball}/><GameRing foreground/>
 <g ref={celebration} opacity="0" fill="none" stroke="#e8c67d"><circle r="52" strokeWidth="3"/><circle r="66" strokeDasharray="2 10" strokeWidth="7"/>{Array.from({length:12},(_,i)=><path key={i} d="M0-70L4-78L0-86L-4-78Z" fill={i%2?'#87bda0':'#ebcb88'} stroke="none" transform={`rotate(${i*30})`}/>)}</g>
 <text ref={angleLabel} x={BALL_BX} y={BALL_BY-45} textAnchor="middle" fill="#fff0cb" stroke="#263b30" strokeWidth=".5" fontSize="18" fontWeight="bold"/>
 </svg><div className="court-caption"><span>CANCHA DEL JADE</span><span>ATRAVESÁ EL ARO DE IZQUIERDA A DERECHA</span></div>
 {ui.message && <div key={ui.event} className={`shot-message ${ui.phase==='scoring'?'success':''}`} role="status">{ui.message}</div>}
 {(ui.paused||ui.phase==='gameover') && <div className="game-overlay"><section className="result-card" role="dialog" aria-modal="true" aria-labelledby="result-title">
 {showHistory?<><HistoryPanel/><button className="primary-button" onClick={()=>setShowHistory(false)}>Volver al resultado</button></>:<><span className="eyebrow">{ui.paused?'RESPIRÁ. ENCONTRÁ TU MOMENTO.':'TU HUELLA EN LA CANCHA'}</span><h1 id="result-title">{ui.paused?'En pausa':'Fin de la partida'}</h1><p>{playerName}</p><strong className="result-score">{ui.score.toLocaleString('es-AR')} <small>puntos</small></strong>{saveError&&<p role="alert">No se pudo guardar el resultado: el almacenamiento del navegador no está disponible.</p>}
 <div className="result-actions">{ui.paused?<button autoFocus className="primary-button" onClick={togglePause}>Continuar →</button>:<button autoFocus className="primary-button" onClick={reset}>Volver a jugar →</button>}<button onClick={ui.paused?reset:()=>setShowHistory(true)}>{ui.paused?'Reiniciar partida':'Historial y ranking'}</button><button onClick={leave}>Volver al inicio</button></div></>}
 </section></div>}
 </div>
 <footer className="game-controls"><div className="control-directions">{direction('a')}{direction('d')}<span>Posición</span>{direction('w')}{direction('s')}<span>Ángulo</span></div><PowerMeter power={ui.power} charging={ui.phase==='charging'}/><div className="strike-control"><button className="primary-button" disabled={ui.paused||!['ready','charging'].includes(ui.phase)} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);start();}} onPointerUp={release} onPointerCancel={()=>{engine.current.cancelCharge();sync();}} onLostPointerCapture={()=>{engine.current.cancelCharge();sync();}}>{ui.phase==='charging'?'Soltá para golpear':'Golpe de cadera'} <span>↗</span></button><small>Espacio: mantené y soltá · Flechas: mover y apuntar</small></div><button className="text-button" onClick={()=>{engine.current.pause();sync();}}>P / Esc</button></footer>
 </main>;
}
