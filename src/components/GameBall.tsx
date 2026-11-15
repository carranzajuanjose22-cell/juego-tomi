import { forwardRef } from 'react';
import { BALL_RADIUS } from '../utils/ballPhysics';

const GameBall = forwardRef<SVGGElement, {}>((props, ref) => {
  return (
    <g ref={ref} filter="url(#ball-shadow)"
        style={{
          transform: `translate(-1000px, -1000px)`, // hidden by default until positioned
          transformOrigin: 'center',
          transition: 'none' // managed by RAF
        }}>
      <circle cx="0" cy="0" r={BALL_RADIUS} fill="url(#rubber)" stroke="#111d18" strokeWidth="1.5" />
      <path d="M-12-6Q2 0 12-8 M-10 10Q0 1 13 7" fill="none" stroke="#6e7566" opacity=".4" />
      <circle cx="-5" cy="-6" r="4" fill="rgba(255,255,255,0.08)" />
    </g>
  );
});

export default GameBall;
