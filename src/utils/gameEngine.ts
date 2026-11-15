import { BALL_BX, BALL_BY, BALL_RADIUS, FIXED_STEP, CHARGE_DURATION_MS,
  advanceBall, createLaunchVelocity, findContact, bounceBall, isOutOfCourt, type BallState, type Contact } from './ballPhysics.ts';
import { GAME_CONFIG as C } from './gameConfig.ts';
export type Phase = 'ready' | 'charging' | 'flying' | 'scoring' | 'miss' | 'gameover';
export class GameEngine {
  x = 0; angle: number = C.launch.defaultAngle; power = 0; score = 0; level = 1; lives = 3; combo = 1;
  phase: Phase = 'ready'; paused = false; ball: BallState | null = null;
  phaseTime = 0; clock = 0; chargeTime = 0; accumulator = 0; lastPower: number = C.launch.previewPower;
  event = 0; message = ''; scored = false;
  impact: {x:number;y:number;nx:number;ny:number;kind:Contact['kind'];time:number;id:number}|null = null;
  impactId = 0;
  keys = new Set<string>();
  startCharge() {
    if (this.paused || this.phase !== 'ready') return;
    this.phase = 'charging'; this.chargeTime = 0; this.power = 0;
  }
  cancelCharge() { if (this.phase === 'charging') { this.phase = 'ready'; this.power = 0; } }
  release() {
    if (this.paused || this.phase !== 'charging') return;
    // A quick tap is a gentle shot. No dead zone or animation delays the impulse.
    const velocity=createLaunchVelocity(this.power,this.angle);
    this.lastPower=this.power;
    this.ball = {x:BALL_BX+this.x,y:BALL_BY,...velocity,rot:0,
      rotVel:velocity.vx/BALL_RADIUS*180/Math.PI*.45,timer:0,bounceCount:0};
    this.phase = 'flying'; this.phaseTime = 0; this.message = ''; this.impact=null;
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
    }
  }
  update(delta: number) {
    if (this.paused || this.phase === 'gameover' || !Number.isFinite(delta)) return;
    this.accumulator += Math.max(0,Math.min(delta,C.physics.maxFrameDelta));
    while (this.accumulator+1e-10 >= FIXED_STEP) {this.step();this.accumulator=Math.max(0,this.accumulator-FIXED_STEP);}
  }
  private step() {
    const dt=FIXED_STEP;
    this.clock+=dt; this.phaseTime+=dt;
    if(this.phase==='ready'||this.phase==='charging') {
      this.x=Math.max(C.launch.minX,Math.min(C.launch.maxX,this.x+(+this.keys.has('d')-+this.keys.has('a'))*C.launch.moveSpeed*dt));
      this.angle=Math.max(C.launch.minAngle,Math.min(C.launch.maxAngle,this.angle+(+this.keys.has('w')-+this.keys.has('s'))*C.launch.angleSpeed*dt));
      if(this.phase==='charging') {this.chargeTime+=dt;this.power=Math.min(100,this.chargeTime/(CHARGE_DURATION_MS/1000)*100);}
    } else if(this.ball && (this.phase==='flying'||this.phase==='miss'||this.phase==='scoring')) {
      const prev={x:this.ball.x,y:this.ball.y};
      advanceBall(this.ball);
      if(this.phase!=='scoring') {
        const hit=findContact(prev,this.ball);
        if(hit?.kind==='score' && this.phase==='flying')this.resolve(true);
        else if(hit && hit.kind!=='score') {
          const speed=Math.hypot(this.ball.vx,this.ball.vy);
          bounceBall(this.ball,hit);
          if(speed>70)this.impact={x:hit.x-hit.nx*BALL_RADIUS,y:hit.y-hit.ny*BALL_RADIUS,nx:hit.nx,ny:hit.ny,kind:hit.kind,time:this.clock,id:++this.impactId};
          if(this.phase==='flying')this.resolve(false);
        }
      }
      if(this.phase==='flying' && isOutOfCourt(this.ball))this.resolve(false);
      if((this.phase==='scoring' && this.phaseTime>C.feedback.scoreSeconds)||(this.phase==='miss' && this.phaseTime>C.feedback.missSeconds)) {
        this.ball=null;this.power=0;this.message='';this.phase=this.lives?'ready':'gameover';this.phaseTime=0;
      }
    }
  }
}
