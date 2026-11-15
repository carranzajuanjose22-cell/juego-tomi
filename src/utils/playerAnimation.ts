/** Visual-only rig. It reads the game clock and never modifies physics or input. */
export type AnimationState = {
  clock:number; phaseTime:number; phase:string; power:number; paused:boolean;
  keys:ReadonlySet<string>;
};
export type PlayerPose = {
  lift:number; shadowScale:number; shadowOpacity:number;
  bodyX:number; bodyY:number; bodyAngle:number;
  frontLeg:number; backLeg:number; frontArm:number; backArm:number;
  head:number; cloth:number;
};
const smooth=(t:number)=>{const x=Math.max(0,Math.min(1,t));return x*x*(3-2*x);};
export class PlayerAnimator {
  private walk=0;
  private charge=0;
  private walkClock=0;
  private previous:PlayerPose|null=null;
  private lastClock:number|null=null;
  sample(g:AnimationState,reducedMotion=false):PlayerPose {
    if(g.paused && this.previous)return this.previous;
    // All transitions use elapsed simulation time, including after pausing.
    const dt=this.lastClock===null?0:Math.max(0,Math.min(.25,g.clock-this.lastClock));
    this.lastClock=g.clock;
    const aiming=g.phase==='ready'||g.phase==='charging';
    const direction=aiming ? Number(g.keys.has('d'))-Number(g.keys.has('a')) : 0;
    const walking=direction!==0;
    this.walk+=(Number(walking)-this.walk)*(1-Math.exp(-dt*13));
    this.charge+=((g.phase==='charging'?g.power/100:0)-this.charge)*(1-Math.exp(-dt*16));
    this.walkClock+=dt*(walking?10.5:7);
    const stride=Math.sin(this.walkClock)*this.walk;
    const breathe=Math.sin(g.clock*2.5);
    const t=g.phase==='flying'?g.phaseTime:1;
    // Immediate hip action; small hop starts only after the ball has left.
    const followThrough=(1-smooth(t/.42))*smooth(t/.045);
    const hop=t<.32?Math.sin(Math.PI*t/.32)*5.5:0;
    const landing=t>=.32&&t<.5?Math.sin(Math.PI*(t-.32)/.18)*2:0;
    const celebrate=g.phase==='scoring'?Math.sin(Math.PI*smooth(g.phaseTime/.95)):0;
    const motion=reducedMotion?0:1;
    const pose:PlayerPose={
      lift:motion && hop>0 ? -hop : 0,
      shadowScale:1-hop*.018*motion,
      shadowOpacity:.26-hop*.012*motion,
      bodyX:this.charge*-2.5+followThrough*7,
      bodyY:this.charge*3.5+(breathe*.7+Math.abs(stride)*1.4+landing-celebrate*2)*motion,
      bodyAngle:-this.charge*7+followThrough*13-celebrate*4*motion,
      frontLeg:stride*13*motion-followThrough*9+this.charge*3,
      backLeg:-stride*13*motion+this.charge*6+followThrough*7,
      frontArm:-this.charge*22+followThrough*31-celebrate*78*motion-stride*4*motion,
      backArm:this.charge*12-followThrough*18+celebrate*22*motion+stride*5*motion,
      head:this.charge*3-followThrough*5+breathe*.55*motion,
      cloth:(Math.sin(this.walkClock-.6)*this.walk*7-this.charge*4+followThrough*9)*motion,
    };
    this.previous=pose;
    return pose;
  }
}
