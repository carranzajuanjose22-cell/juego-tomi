import { memo, useMemo, useRef, type RefObject } from 'react';
import type {PlayerPose} from '../utils/playerAnimation';
export function usePlayerRig() {
  const body=useRef<SVGGElement>(null),frontLeg=useRef<SVGGElement>(null),backLeg=useRef<SVGGElement>(null);
  const frontArm=useRef<SVGGElement>(null),backArm=useRef<SVGGElement>(null),head=useRef<SVGGElement>(null);
  const cloth=useRef<SVGGElement>(null),lift=useRef<SVGGElement>(null),shadow=useRef<SVGEllipseElement>(null);
  return useMemo(()=>({body,frontLeg,backLeg,frontArm,backArm,head,cloth,lift,shadow}),[]);
}
type PlayerRig=ReturnType<typeof usePlayerRig>;
function transform(ref:RefObject<SVGGElement|null>,value:string){ref.current?.setAttribute('transform',value);}
export function applyPlayerPose(r:PlayerRig,p:PlayerPose) {
  transform(r.lift,`translate(0 ${p.lift})`);
  transform(r.body,`translate(${p.bodyX} ${p.bodyY}) rotate(${p.bodyAngle} 0 13)`);
  transform(r.frontLeg,`rotate(${p.frontLeg} 12 23)`);
  transform(r.backLeg,`rotate(${p.backLeg} -12 23)`);
  transform(r.frontArm,`rotate(${p.frontArm} 13 -31)`);
  transform(r.backArm,`rotate(${p.backArm} -17 -30)`);
  transform(r.head,`rotate(${p.head} -3 -43)`);
  transform(r.cloth,`rotate(${p.cloth} 5 16)`);
  r.shadow.current?.setAttribute('rx',String(39*p.shadowScale));
  r.shadow.current?.setAttribute('opacity',String(p.shadowOpacity));
}

/** Layered original SVG, sized for the existing hip anchor and 90 px foot baseline.
 * Clothing is an artistic interpretation, not a claim of historical reconstruction. */
export default memo(function Player({rig:r}:{rig:PlayerRig}) {
  return <g stroke="#493a2a" strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
    <defs>
      <linearGradient id="player-skin" x1="0" y1="0" x2="1" y2=".4"><stop stopColor="#8b593d"/><stop offset=".34" stopColor="#c58b5c"/><stop offset=".65" stopColor="#bb8155"/><stop offset="1" stopColor="#86513a"/></linearGradient>
      <linearGradient id="player-shadow-skin" x2="1" y2=".7"><stop stopColor="#6e4935"/><stop offset=".65" stopColor="#a16e49"/><stop offset="1" stopColor="#76503a"/></linearGradient>
      <linearGradient id="player-cloth" x2=".8" y2="1"><stop stopColor="#547966"/><stop offset=".45" stopColor="#34594a"/><stop offset="1" stopColor="#203d32"/></linearGradient>
      <linearGradient id="player-belt" x2=".15" y2="1"><stop stopColor="#b68b59"/><stop offset=".25" stopColor="#826143"/><stop offset=".6" stopColor="#5d4935"/><stop offset="1" stopColor="#977449"/></linearGradient>
      <linearGradient id="player-linen" x2="1" y2=".4"><stop stopColor="#ae9a72"/><stop offset=".45" stopColor="#e0cda1"/><stop offset="1" stopColor="#bca67a"/></linearGradient>
      <linearGradient id="player-jade" x2="1" y2="1"><stop stopColor="#94a98a"/><stop offset=".4" stopColor="#54826a"/><stop offset="1" stopColor="#2d5340"/></linearGradient>
      <pattern id="player-weave" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 1H5M1 0V5" stroke="#e5d2a4" strokeWidth=".5" opacity=".16"/></pattern>
    </defs>
    <ellipse ref={r.shadow} cx="5" cy="92" rx="39" ry="6" fill="#223724" stroke="none" opacity=".26"/>
    <g ref={r.lift}>
      {/* Back leg: tapered thigh, bent knee, calf and individual foot silhouette. */}
      <g ref={r.backLeg}>
        <path d="M-24 17Q-10 11-1 25Q-4 42-14 55Q-17 59-18 65L-27 81Q-27 84-23 86L-19 87Q-16 91-22 92L-37 91Q-43 90-40 86L-34 78L-29 57Q-29 52-25 42Z" fill="url(#player-shadow-skin)"/>
        <path d="M-22 30Q-20 43-25 51M-22 65L-28 78" fill="none" stroke="#cf9e69" strokeWidth="2" opacity=".3"/>
        <path d="M-28 48Q-19 45-11 52L-15 65Q-24 68-30 61Z" fill="url(#player-cloth)"/>
        <path d="M-27 52l13 4m-14 2 12 4" stroke="#a5ac80" strokeWidth="1.4"/>
        <path d="M-36 83l11 5m-12 1h13" stroke="#4a3c2b"/>
      </g>
      {/* Front leg keeps the previous playable footprint. */}
      <g ref={r.frontLeg}>
        <path d="M4 18Q21 12 27 28L29 43Q31 49 32 53Q33 57 30 60L40 78Q42 82 49 84L55 87Q58 91 51 93H37Q32 92 31 87L25 77L14 62Q10 58 13 52L6 39Z" fill="url(#player-skin)"/>
        <path d="M20 31Q19 41 24 49M24 67L33 81" fill="none" stroke="#e0ad76" strokeWidth="2.2" opacity=".5"/>
        <path d="M20 63Q14 60 13 57L15 52Q23 56 30 52L32 58Q28 64 20 63" fill="#805439" stroke="none"/>
        <path d="M13 48Q22 44 31 49L33 58Q25 65 15 60Z" fill="url(#player-cloth)"/>
        <path d="M16 49Q23 47 29 50M17 57Q24 60 31 55" fill="none" stroke="#a5ac80" strokeWidth="1.3"/>
        <path d="M21 49l5 4-4 4-4-4Z" fill="url(#player-jade)"/>
        <path d="M34 83l10 6m-10 1h15m-8-5 1 5" stroke="#5c4630"/>
      </g>
      <g ref={r.body}>
        <g ref={r.backArm}>
          <path d="M-17-37Q-28-39-32-28L-40-13Q-44-7-39-1L-29 13Q-27 17-22 15L-19 12Q-18 9-22 6L-28-6L-18-20Z" fill="url(#player-shadow-skin)"/>
          <path d="M-36-12l9 4-4 9-9-5Z" fill="#506f59"/>
          <path d="M-35-10l6 3m-7 1 5 3" stroke="#c1b080"/>
          <path d="M-24 7l-4 3m2-1 4 4" fill="none" stroke="#654431" strokeWidth=".8"/>
        </g>
        {/* Rib cage, shoulder and waist, with restrained anatomical shading. */}
        <path d="M-9-45Q-14-39-22-37Q-29-32-24-21L-20-7Q-17 1-22 13Q-8 24 23 14L20 0Q19-9 25-21Q29-31 19-37L8-41L6-46Z" fill="url(#player-skin)"/>
        <path d="M-19-32Q-11-36-4-34L1-25Q-9-21-18-25M3-25Q13-21 21-27M0-21L-1-9Q4-4 13-8M-1-8L0 5" fill="none" stroke="#785039" strokeWidth="1.2" opacity=".7"/>
        <path d="M-20-33Q-13-37-7-34M6-32Q13-34 18-30M-15-17Q-11-12-12-6" fill="none" stroke="#e1b07b" strokeWidth="1.8" opacity=".5"/>
        <path d="M17-16Q11-3 15 12L22 13L19 0L23-14Z" fill="#654932" opacity=".25" stroke="none"/>
        <path d="M-18-36L-12-24M-22-31L-15-20" stroke="#456753" strokeWidth="2.8" opacity=".75"/>
        <g ref={r.frontArm}>
          <path d="M14-36Q24-39 29-30L35-23L43-34L44-40Q45-44 47-42L50-39Q54-38 53-34L51-27L40-12Q35-7 29-12L16-22Q10-28 14-36Z" fill="url(#player-skin)"/>
          <path d="M20-33Q25-30 28-24L33-20M38-22L44-32" fill="none" stroke="#edbd85" strokeWidth="1.8" opacity=".45"/>
          <path d="M38-26l9 6 5-9-9-6Z" fill="url(#player-cloth)"/>
          <path d="M41-28l7 5m-9-1 7 5" stroke="#c7ba8d" strokeWidth="1.1"/>
          <path d="M47-37l3 2m-4 0 3 2" stroke="#674834" strokeWidth=".8"/>
        </g>
        {/* Wrapped textile, uneven hem and a separately animated woven panel. */}
        <path d="M-23 8Q0 2 25 8L30 30Q14 39-22 31L-27 19Z" fill="url(#player-cloth)"/>
        <path d="M-23 8Q0 2 25 8L30 30Q14 39-22 31L-27 19Z" fill="url(#player-weave)" stroke="none"/>
        <path d="M-23 26Q-4 35 27 27M-19 29l-1 6m6-4-1 5m6-3v4m6-3v4" fill="none" stroke="#b3ad7b" strokeWidth="1"/>
        <g ref={r.cloth}>
          <path d="M-5 14L15 13L22 44L6 51L-4 43Z" fill="url(#player-linen)"/>
          <path d="M-2 18L12 17L18 41L7 46L0 40Z" fill="none" stroke="#975e40" strokeWidth="1.8"/>
          <path d="M7 23l6 7-4 8-6-7Z" fill="#54755a" stroke="none"/>
          <path d="M4 46v6m4-4v6m4-6 1 4m3-6 2 4" stroke="#c2ab7e"/>
          <path d="M-2 19L2 40" stroke="#f2dfb1" opacity=".45"/>
        </g>
        {/* Thick padded hip protector: the ball leaves beside its right edge. */}
        <path d="M-27 0Q-9 6 25-5Q32-4 33 4L32 17Q3 28-24 15L-29 8Z" fill="url(#player-belt)" strokeWidth="1.8"/>
        <path d="M-25 3Q-2 12 28-2M-24 12Q1 22 30 13" fill="none" stroke="#d2ab71" strokeWidth="1.3"/>
        {[-19,-12,-5,2].map(x=><path key={x} d={`M${x} 8l-1 5`} stroke="#dbc28b" strokeWidth="1"/>)}
        <path d="M18-5Q31-9 34 0L35 16Q29 22 19 20L14 11Z" fill="#574d36" stroke="#c1a16a" strokeWidth="1.6"/>
        <path d="M21-1Q28-4 30 2L31 13Q26 17 21 15L19 8Z" fill="url(#player-jade)"/>
        <path d="M24 2l4 5-3 5-3-4Z" fill="#a4b28a" stroke="#355740" strokeWidth=".7"/>
        <g ref={r.head}>
          <path d="M-10-52L-12-41Q-5-35 7-41L5-55" fill="url(#player-shadow-skin)"/>
          <path d="M-20-73Q-17-89-1-88Q11-87 14-77L14-67L19-61Q20-58 14-57Q13-46 4-44L-8-48Q-18-53-20-64Z" fill="url(#player-skin)"/>
          <path d="M-21-61Q-27-78-17-87Q-7-97 7-87L15-78L9-73L3-81Q-4-77-13-77L-13-60Z" fill="#20372b"/>
          <path d="M-20-78Q-12-88-2-87M-20-74Q-12-83-7-81" fill="none" stroke="#536148" strokeWidth="1.4"/>
          <path d="M-19-77Q-30-83-31-76L-24-61L-14-61" fill="#243d2e"/>
          <path d="M0-72Q6-76 12-70" fill="none" stroke="#563e2e" strokeWidth="1.7"/>
          <path d="M3-69Q7-72 11-69L7-66Z" fill="#d4c8a3" strokeWidth=".65"/>
          <ellipse cx="8" cy="-69" rx="1.2" ry="1.8" fill="#203027" stroke="none"/>
          <path d="M12-67L11-61L15-60M5-52L12-53M-1-55L1-49" fill="none" stroke="#78513a" strokeWidth=".8"/>
          <path d="M-4-64L6-61L3-58L-6-61" fill="#916047" stroke="none" opacity=".6"/>
          <path d="M-2-63L4-61M-4-60L1-58" stroke="#466953" strokeWidth="1.7"/>
          <path d="M-16-69Q-21-71-21-65Q-21-59-15-60" fill="#b87e52"/>
          <ellipse cx="-17" cy="-60" rx="4.4" ry="5.1" fill="url(#player-jade)" stroke="#38543d"/>
          <ellipse cx="-17" cy="-60" rx="1.4" ry="2" fill="#223e2d" stroke="none"/>
          {/* Low tied band and compact feathers preserve a readable athletic silhouette. */}
          <path d="M-24-80L10-85L14-77L-21-71Z" fill="url(#player-linen)"/>
          <path d="M-22-77L10-82" stroke="#a06440" strokeWidth="2"/>
          <path d="M-17-81Q-38-97-35-116Q-17-110-10-88 M-13-84Q-18-114-6-125Q6-107-3-84 M-2-83Q6-109 19-111Q18-94 7-81" fill="url(#player-cloth)" stroke="#304b38"/>
          <path d="M-32-110L-13-87M-6-117L-7-85M15-106L3-85" stroke="#9fa87a" strokeWidth=".9"/>
          <path d="M-22-77L10-82" stroke="#cfac71" strokeWidth="2.5"/>
          <path d="M-20-74L-25-67L-28-53L-24-52L-20-64L-16-72" fill="#a3774f"/>
        </g>
      </g>
    </g>
  </g>;
});
