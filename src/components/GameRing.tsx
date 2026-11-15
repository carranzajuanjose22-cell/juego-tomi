import { memo } from 'react';
import { RING_CENTER_X as X, RING_CENTER_Y as Y, RING_INNER_RADIUS as R, RING_HITBOX_THICKNESS as T } from '../utils/ballPhysics';
export default memo(function GameRing({foreground=false}:{foreground?:boolean}) {
 const outer=R+T;
 return <g transform={`translate(${X} ${Y})`}>
 <defs><linearGradient id="hoop-stone" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#eee0b7"/><stop offset=".35" stopColor="#b4a47f"/><stop offset="1" stopColor="#6b705a"/></linearGradient></defs>
 {foreground ? <path d={`M-11 ${R}Q1 ${R+8} 14 ${R-3}L22 ${outer-7}Q3 ${outer+10}-13 ${outer-2}Z`} fill="url(#hoop-stone)" stroke="#535b46" strokeWidth="1.5"/> : <>
 <ellipse cx="22" cy="12" rx="40" ry={outer+15} fill="#192c23" opacity=".26"/>
 <path d={`M9 ${-outer}L28 ${-outer+8}Q60 0 28 ${outer+8}L9 ${outer}Z`} fill="#666b53" stroke="#4c5340" strokeWidth="2"/>
 <ellipse cx="4" rx="34" ry={outer} fill="url(#hoop-stone)" stroke="#514d38" strokeWidth="3"/>
 <ellipse rx="29" ry={outer-4} fill="none" stroke="#e2d2a5" strokeWidth="1.5" opacity=".65"/>
 <ellipse rx="20" ry={R} fill="#243b30" stroke="#625f44" strokeWidth="3"/>
 <path d={`M0 ${-R}Q-30 0 0 ${R}`} fill="none" stroke="#f0dcb1" strokeWidth="2"/>
 {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <path key={i} d={`M${Math.sin(a)*25} ${Math.cos(a)*(R+6)}l${Math.sin(a)*4} ${Math.cos(a)*5}`} stroke="#766d4e" strokeWidth="2"/>;})}
 {[-R-7,R+7].map(y=><path key={y} d={`M-5 ${y}L2 ${y-5}L9 ${y}L2 ${y+5}Z`} fill="#447460" stroke="#314c3c"/>) }
 <path d={`M17 ${-outer+10}l5 7-4 7 M-20 21l6 5-3 9`} fill="none" stroke="#5d604c" strokeWidth="1.2"/>
 </>}
 </g>;
});
