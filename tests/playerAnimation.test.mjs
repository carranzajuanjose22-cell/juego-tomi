import test from 'node:test';
import assert from 'node:assert/strict';
import {PlayerAnimator} from '../src/utils/playerAnimation.ts';
import {GameEngine} from '../src/utils/gameEngine.ts';
const idle=()=>({clock:0,phaseTime:0,phase:'ready',power:0,paused:false,keys:new Set()});

test('player breathes in idle without drifting its gameplay anchor',()=>{
 const a=new PlayerAnimator(),s=idle(),p0=a.sample(s);s.clock=.6;const p1=a.sample(s);
 assert.notEqual(p0.bodyY,p1.bodyY);assert.equal(p1.lift,0);assert.equal(p1.bodyX,0);assert.equal(p1.frontLeg,0);
});
test('walking blends in and out in both directions and opposing keys stop the stride',()=>{
 for(const key of ['a','d']){
  const a=new PlayerAnimator(),s=idle();a.sample(s);s.keys.add(key);s.clock=1/120;const first=a.sample(s);
  assert.ok(Math.abs(first.frontLeg)<2);let maximum=0;
  for(let i=2;i<120;i++){s.clock=i/120;maximum=Math.max(maximum,Math.abs(a.sample(s).frontLeg));}assert.ok(maximum>9);
  s.keys.add(key==='a'?'d':'a');for(let i=120;i<240;i++){s.clock=i/120;a.sample(s);}assert.ok(Math.abs(a.sample(s).frontLeg)<.01);
 }
});
test('preparation, hip release, small hop and landing are coordinated in time',()=>{
 const a=new PlayerAnimator(),s=idle();a.sample(s);s.phase='charging';s.power=100;
 for(let i=1;i<=120;i++){s.clock=i/120;a.sample(s);}const prep=a.sample(s);
 assert.ok(prep.bodyAngle< -6);assert.ok(prep.frontArm< -20);
 s.phase='flying';s.phaseTime=0;const release=a.sample(s);assert.equal(release.lift,0);
 s.phaseTime=.16;s.clock+=.16;const airborne=a.sample(s);assert.ok(airborne.lift< -5);assert.ok(airborne.bodyX>2);
 s.phaseTime=.32;s.clock+=.16;const contact=a.sample(s);assert.equal(contact.lift,0);
 s.phaseTime=.4;s.clock+=.08;const land=a.sample(s);assert.ok(land.bodyY>0);assert.equal(land.lift,0);
 s.phaseTime=.7;s.clock+=.3;assert.equal(a.sample(s).lift,0);
});
test('celebration raises the arm only after a real score and returns to rest',()=>{
 const a=new PlayerAnimator(),s=idle();a.sample(s);
 s.clock=.45;s.phase='miss';s.phaseTime=.45;assert.equal(a.sample(s).frontArm,0);
 s.phase='scoring';const win=a.sample(s);assert.ok(win.frontArm< -60);
 s.phaseTime=.95;s.clock=.95;assert.ok(Math.abs(a.sample(s).frontArm)<.001);
});
test('pausing freezes every joint and reduced motion suppresses hops and idle sway',()=>{
 const a=new PlayerAnimator(),s=idle();a.sample(s);s.clock=.16;s.phase='flying';s.phaseTime=.16;const p=a.sample(s);s.paused=true;
 assert.deepEqual(a.sample(s),p);
 const b=new PlayerAnimator(),still=b.sample({...s,paused:false},true);assert.equal(still.lift,0);assert.ok(Math.abs(still.head)<=5);
 const rest=b.sample({...idle(),clock:2},true);assert.equal(rest.bodyY,0);assert.equal(rest.head,0);
});
test('all visual poses stay finite and sampling never changes ball, score or history state',()=>{
 const g=new GameEngine(),a=new PlayerAnimator();g.startCharge();
 for(let i=0;i<300;i++){
  g.update(1/120);if(i===140)g.release();const before=JSON.stringify(g);const pose=a.sample(g);
  assert.equal(JSON.stringify(g),before);for(const value of Object.values(pose))assert.ok(Number.isFinite(value));
 }
});
