import { forwardRef, memo } from 'react';
import { BALL_RADIUS as R } from '../utils/ballPhysics';
const GameBall = memo(forwardRef<SVGGElement>(function GameBall(_,ref) {
 return <g ref={ref} style={{transform:'translate(-1000px,-1000px)',transformOrigin:'0px 0px',transition:'none'}}>
 <circle r={R} fill="url(#rubber)" stroke="#14231c" strokeWidth="1.2"/>
 <g fill="none" stroke="#859083" opacity=".32" strokeWidth=".8"><path d="M-14-6Q-3 2 14-6 M-13 7Q1-1 13 9 M-4-15Q6-1-3 15"/><path d="M-10-9l3 1m14 17 3-1M3-10l2 2M-9 5l2 2"/></g>
 <ellipse cx="-5" cy="-6" rx="6" ry="4" fill="#b9c0a4" opacity=".12" transform="rotate(-35 -5 -6)"/>
 <circle r={R-2} fill="none" stroke="#050f0c" strokeWidth="1" opacity=".3"/>
 </g>;
}));
export default GameBall;
