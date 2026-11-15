import { GAME_CONFIG as C } from './gameConfig.ts';
export const GRAVITY = C.physics.gravity;
export const MIN_SPEED = C.launch.minSpeed;
export const MAX_SPEED = C.launch.maxSpeed;
export const CHARGE_DURATION_MS = C.launch.chargeMs;
export const FIXED_STEP = C.physics.fixedStep;
export const RING_CENTER_X = C.ring.x, RING_CENTER_Y = C.ring.y;
export const RING_INNER_RADIUS = C.ring.innerRadius;
export const BALL_RADIUS = C.ball.radius, RING_HITBOX_THICKNESS = C.ring.thickness;
export const BALL_BX = C.ball.startX, BALL_BY = C.ball.startY;
export function powerToSpeed(power: number) {
  const p = Math.min(1, Math.max(0, power / 100));
  return MIN_SPEED + (MAX_SPEED - MIN_SPEED) * Math.pow(p, C.launch.curve);
}
export function createLaunchVelocity(power: number, angleDegrees: number) {
  const speed = powerToSpeed(power), a = angleDegrees * Math.PI / 180;
  return { vx: speed * Math.cos(a), vy: -speed * Math.sin(a) };
}
export type BallState = { x: number; y: number; vx: number; vy: number;
  rot: number; rotVel: number; timer: number; bounceCount: number };
export type Position = Pick<BallState, 'x' | 'y'>;
export function advanceBall(state: BallState) {
  // Exact constant-acceleration position update, shared by preview and live flight.
  state.x += state.vx * FIXED_STEP;
  state.y += state.vy * FIXED_STEP + 0.5 * GRAVITY * FIXED_STEP ** 2;
  state.vy += GRAVITY * FIXED_STEP;
  state.rot += state.rotVel * FIXED_STEP;
  state.timer += FIXED_STEP;
}
export type Contact = { kind: 'score' | 'rim' | 'ground' | 'wall'; t: number;
  x: number; y: number; nx: number; ny: number };
/** Earliest swept contact; lip hits take priority over a later hoop-plane crossing. */
export function findContact(prev: Position, curr: Position, ringY: number = RING_CENTER_Y): Contact | null {
  const dx = curr.x-prev.x, dy = curr.y-prev.y;
  let nearest: Contact | null = null;
  const add = (kind: Contact['kind'], t: number, nx: number, ny: number) => {
    if (t >= 0 && t <= 1 && (!nearest || t < nearest.t))
      nearest = { kind, t, x: prev.x+dx*t, y: prev.y+dy*t, nx, ny };
  };
  const radius = BALL_RADIUS + RING_HITBOX_THICKNESS/2;
  const a = dx*dx+dy*dy;
  if (a > 0) for (const y of [ringY-RING_INNER_RADIUS-RING_HITBOX_THICKNESS/2, ringY+RING_INNER_RADIUS+RING_HITBOX_THICKNESS/2]) {
    const ox=prev.x-RING_CENTER_X, oy=prev.y-y;
    const b=2*(ox*dx+oy*dy), c=ox*ox+oy*oy-radius*radius;
    const discriminant=b*b-4*a*c;
    if (discriminant < 0) continue;
    const t=c<0 ? 0 : (-b-Math.sqrt(discriminant))/(2*a);
    const cx=prev.x+dx*t-RING_CENTER_X, cy=prev.y+dy*t-y;
    const length=Math.hypot(cx,cy)||1;
    if (dx*cx+dy*cy < 0) add('rim',t,cx/length,cy/length);
  }
  if (dx>0 && prev.x<RING_CENTER_X && curr.x>=RING_CENTER_X) {
    const t=(RING_CENTER_X-prev.x)/dx;
    if (Math.abs(prev.y+dy*t-ringY)<=RING_INNER_RADIUS-BALL_RADIUS) add('score',t,0,0);
  }
  const floor=C.physics.floorY-BALL_RADIUS;
  if (dy>0 && prev.y<=floor && curr.y>=floor) add('ground',(floor-prev.y)/dy,0,-1);
  for (const [x,normal] of [[C.physics.leftWall+BALL_RADIUS,1],[C.physics.rightWall-BALL_RADIUS,-1]]) {
    if (dx*normal>=0) continue;
    const t=(x-prev.x)/dx, y=prev.y+dy*t;
    if (y+BALL_RADIUS>=C.physics.wallTop) add('wall',t,normal,0);
  }
  return nearest;
}
export function detectRingCrossing(prev: Position, curr: Position, ringY: number): 'score' | 'miss' | 'none' {
  const hit=findContact(prev,curr,ringY);
  return hit?.kind==='score'?'score':hit?.kind==='rim'?'miss':'none';
}
export function bounceBall(state: BallState, hit: Contact) {
  const restitution=hit.kind==='ground'?C.physics.groundBounce:hit.kind==='wall'?C.physics.wallBounce:C.physics.rimBounce;
  const normalSpeed=state.vx*hit.nx+state.vy*hit.ny;
  const tx=state.vx-normalSpeed*hit.nx, ty=state.vy-normalSpeed*hit.ny;
  state.x=hit.x+hit.nx*.1; state.y=hit.y+hit.ny*.1;
  if(normalSpeed<0) {
    state.vx=tx*C.physics.friction-normalSpeed*restitution*hit.nx;
    state.vy=ty*C.physics.friction-normalSpeed*restitution*hit.ny;
  }
  state.rotVel=state.vx/BALL_RADIUS*180/Math.PI*.5;
  state.bounceCount++;
}
export function isOutOfCourt(state: BallState) {
  return state.timer>C.physics.maxFlightSeconds || state.x>C.physics.outRight || state.x<C.physics.outLeft || state.y<C.physics.outTop;
}
export function simulateTrajectory(startX: number,startY: number,power: number,angleDegrees: number,ringOscY=0,maxSteps=280): string {
  const state: BallState={x:startX,y:startY,...createLaunchVelocity(power,angleDegrees),rot:0,rotVel:0,timer:0,bounceCount:0};
  let path=`M${startX},${startY}`;
  for(let i=0;i<maxSteps;i++) {
    const prev={x:state.x,y:state.y}; advanceBall(state);
    const hit=findContact(prev,state,RING_CENTER_Y+ringOscY);
    if(hit) {path+=` L${hit.x.toFixed(2)},${hit.y.toFixed(2)}`;break;}
    // Keep full physics precision, decimate only the SVG path.
    if(i%3===0 || isOutOfCourt(state))path+=` L${state.x.toFixed(2)},${state.y.toFixed(2)}`;
    if(isOutOfCourt(state))break;
  }
  return path;
}
