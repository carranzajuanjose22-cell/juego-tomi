export const GRAVITY = 1200;
export const MIN_SPEED = 150;
export const MAX_SPEED = 1700;
export const CHARGE_DURATION_MS = 2200;
export const MIN_HOLD_MS = 250;
export const FIXED_STEP = 1 / 120;

export const RING_CENTER_X = 825;
export const RING_CENTER_Y = 238;
export const RING_INNER_RADIUS = 36;
export const BALL_RADIUS = 16;
export const RING_HITBOX_THICKNESS = 15;
export const BALL_BX = 350;
export const BALL_BY = 390;

export function powerToSpeed(power: number) {
  const normalized = Math.min(1, Math.max(0, power / 100));
  const eased = normalized * normalized * (3 - 2 * normalized);
  return MIN_SPEED + (MAX_SPEED - MIN_SPEED) * eased;
}

export function createLaunchVelocity(power: number, angleDegrees: number) {
  const speed = powerToSpeed(power);
  const radians = angleDegrees * Math.PI / 180;
  return {
    vx: speed * Math.cos(radians),
    vy: -speed * Math.sin(radians)
  };
}

export type BallState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotVel: number;
  timer: number;
  bounceCount: number;
};

export function advanceBall(state: BallState) {
  state.vy += GRAVITY * FIXED_STEP;
  state.x += state.vx * FIXED_STEP;
  state.y += state.vy * FIXED_STEP;
  state.rot += state.rotVel * FIXED_STEP;
  state.timer += FIXED_STEP;
}

export type CollisionResult = 'none' | 'score' | 'rim' | 'ground' | 'out';

export function detectRingCrossing(
  prev: BallState, curr: BallState, ringY: number
): 'score' | 'miss' | 'none' {
  const prevX = prev.x;
  const prevY = prev.y;
  const currX = curr.x;
  const currY = curr.y;
  // Solo detectamos si cruza el plano vertical del aro de izquierda a derecha o cae sobre él
  
  // Crossed vertical plane X
  if (prevX < RING_CENTER_X && currX >= RING_CENTER_X) {
    // Interpolar Y en el cruce X
    const t = (RING_CENTER_X - prevX) / (currX - prevX);
    const crossY = prevY + (currY - prevY) * t;
    
    const dist = Math.abs(crossY - ringY);
    const validRadius = RING_INNER_RADIUS - BALL_RADIUS;
    
    if (dist <= validRadius) {
      return 'score';
    } else if (dist <= RING_INNER_RADIUS + RING_HITBOX_THICKNESS + BALL_RADIUS) {
      // Hit rim
      return 'miss';
    }
  }

  // Hit rim front
  // A side-on hoop: only its upper/lower stone lips are solid.
  // Swept circle/segment tests prevent tunnelling at high launch speeds.
  const dx = currX - prevX, dy = currY - prevY;
  const lengthSq = dx * dx + dy * dy;
  for (const lipY of [ringY - RING_INNER_RADIUS - RING_HITBOX_THICKNESS / 2,
    ringY + RING_INNER_RADIUS + RING_HITBOX_THICKNESS / 2]) {
    const t = lengthSq ? Math.max(0, Math.min(1,
      ((RING_CENTER_X - prevX) * dx + (lipY - prevY) * dy) / lengthSq)) : 0;
    if (Math.hypot(prevX + dx * t - RING_CENTER_X, prevY + dy * t - lipY)
      < BALL_RADIUS + RING_HITBOX_THICKNESS / 2) return 'miss';
  }
  
  return 'none';
}

export function simulateTrajectory(
  startX: number, startY: number, 
  power: number, angleDegrees: number, 
  ringOscY: number,
  maxSteps: number = 60
): string {
  if (power <= 0) return '';
  
  let { vx, vy } = createLaunchVelocity(power, angleDegrees);
  let x = startX;
  let y = startY;
  
  let path = `M${x},${y}`;
  
  for (let i = 0; i < maxSteps; i++) {
    // Usamos FIXED_STEP para simulación visual predecible y consistente
    vy += GRAVITY * FIXED_STEP;
    const prevX = x, prevY = y;
    x += vx * FIXED_STEP;
    y += vy * FIXED_STEP;
    
    path += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    
    if (y > 576 + 50 || x > 1024 + 50) break; // Out of bounds
    
    const col = detectRingCrossing(
      {x: prevX, y: prevY} as BallState, 
      {x, y} as BallState, 
    RING_CENTER_Y + ringOscY
    );
    if (col !== 'none') break;
  }
  
  return path;
}
