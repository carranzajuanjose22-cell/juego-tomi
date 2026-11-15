import { BALL_BX, BALL_BY, BALL_RADIUS, FIXED_STEP, MIN_HOLD_MS, CHARGE_DURATION_MS,
  RING_CENTER_Y, advanceBall, createLaunchVelocity, detectRingCrossing, type BallState } from './ballPhysics';

export type Phase = 'ready' | 'charging' | 'flying' | 'scoring' | 'miss' | 'gameover';
export class GameEngine {
  x = 0; angle = 44; power = 0; score = 0; level = 1; lives = 3; combo = 1;
  phase: Phase = 'ready'; paused = false; ball: BallState | null = null;
  phaseTime = 0; clock = 0; chargeTime = 0; chargeDirection = 1; accumulator = 0;
  event = 0; message = ''; scored = false;
  keys = new Set<string>();
  startCharge() {
    if (this.paused || this.phase !== 'ready') return;
    this.phase = 'charging'; this.chargeTime = 0; this.power = 0; this.chargeDirection = 1;
  }
  cancelCharge() {
    if (this.phase === 'charging') { this.phase = 'ready'; this.power = 0; }
  }
  release() {
    if (this.paused || this.phase !== 'charging') return;
    if (this.chargeTime < MIN_HOLD_MS / 1000 || this.power < 1) { this.cancelCharge(); return; }
    this.ball = { x: BALL_BX + this.x, y: BALL_BY,
      ...createLaunchVelocity(this.power, this.angle), rot: 0, rotVel: 240, timer: 0, bounceCount: 0 };
    this.phase = 'flying'; this.phaseTime = 0; this.message = '';
  }
  pause() { this.paused = true; this.keys.clear(); this.cancelCharge(); }
  resolve(scored: boolean) {
    if (this.phase !== 'flying') return;
    this.scored = scored; this.phaseTime = 0; this.event++;
    if (scored) {
      const points = 3000 * this.combo;
      this.score += points; this.combo++; this.level++;
      this.message = `¡Aro! +${points.toLocaleString('es-AR')}`; this.phase = 'scoring';
    } else {
      this.lives--; this.combo = 1; this.message = this.lives ? 'Ajustá el próximo golpe' : 'Fin de la partida';
      this.phase = 'miss';
      if (this.ball) { this.ball.vx *= -0.28; this.ball.vy = -Math.abs(this.ball.vy) * 0.35; }
    }
  }
  update(delta: number) {
    if (this.paused || this.phase === 'gameover') return;
    this.accumulator += Math.max(0, Math.min(delta, 0.1));
    while (this.accumulator >= FIXED_STEP) {
      this.step(); this.accumulator -= FIXED_STEP;
    }
  }
  private step() {
    const dt = FIXED_STEP;
    this.clock += dt; this.phaseTime += dt;
    if (this.phase === 'ready' || this.phase === 'charging') {
      this.x = Math.max(-150, Math.min(180, this.x + ((+this.keys.has('d')) - (+this.keys.has('a'))) * 150 * dt));
      this.angle = Math.max(18, Math.min(72, this.angle + ((+this.keys.has('w')) - (+this.keys.has('s'))) * 32 * dt));
      if (this.phase === 'charging') {
        this.chargeTime += dt;
        if (this.chargeTime >= MIN_HOLD_MS / 1000) {
          this.power += 100 / (CHARGE_DURATION_MS / 1000) * this.chargeDirection * dt;
          if (this.power >= 100) { this.power = 100; this.chargeDirection = -1; }
          if (this.power <= 0) { this.power = 0; this.chargeDirection = 1; }
        }
      }
    } else if (this.phase === 'flying' && this.ball) {
      const prev = { ...this.ball };
      advanceBall(this.ball);
      const hit = detectRingCrossing(prev, this.ball, RING_CENTER_Y);
      if (hit === 'score') this.resolve(true);
      else if (hit === 'miss' || this.ball.y >= 494 - BALL_RADIUS || this.ball.x > 1060 || this.ball.x < -40 || this.ball.timer > 4) this.resolve(false);
    } else if (this.phase === 'scoring' || this.phase === 'miss') {
      if (this.ball) {
        advanceBall(this.ball);
        if (this.ball.y > 494 - BALL_RADIUS) { this.ball.y = 494 - BALL_RADIUS; this.ball.vy *= -0.35; this.ball.vx *= 0.7; }
      }
      if (this.phaseTime > (this.phase === 'scoring' ? 0.95 : 0.8)) {
        this.ball = null; this.power = 0; this.message = '';
        this.phase = this.lives ? 'ready' : 'gameover'; this.phaseTime = 0;
      }
    }
  }
}
