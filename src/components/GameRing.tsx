import { memo } from 'react';
import { RING_CENTER_X as X, RING_CENTER_Y as Y, RING_INNER_RADIUS as R } from '../utils/ballPhysics';
export default memo(function GameRing({ foreground = false }: { foreground?: boolean }) {
 return <g transform={`translate(${X} ${Y})`}>
 {foreground ? <path d={`M-9 ${R}H9V${R+15}H-9Z`} fill="#b6ac8a" stroke="#575e4d" strokeWidth="2"/> : <>
 <ellipse rx="34" ry="60" fill="#404d3f" opacity=".3" transform="translate(9 5)"/>
 <ellipse rx="23" ry={R+15} fill="#a89f7d" stroke="#525a49" strokeWidth="3"/>
 <ellipse rx="10" ry={R} fill="#273c32" stroke="#d3c69d" strokeWidth="3"/>
 {[-42,42].map(y=><path key={y} d={`M-6 ${y}L0 ${y-4}L6 ${y}L0 ${y+4}Z`} fill="#477b63"/>)}
 </>}
 </g>;
});
