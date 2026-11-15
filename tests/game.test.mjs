import test from 'node:test';
import assert from 'node:assert/strict';
import {GameEngine} from '../src/utils/gameEngine.ts';
import {GAME_CONFIG as C} from '../src/utils/gameConfig.ts';
import {powerToSpeed,createLaunchVelocity,findContact,bounceBall,advanceBall,simulateTrajectory,isOutOfCourt,BALL_RADIUS} from '../src/utils/ballPhysics.ts';
import {getHistory,addGameRecord,getRanking} from '../src/utils/gameHistory.ts';
const near=(a,b,epsilon=1e-7)=>assert.ok(Math.abs(a-b)<epsilon,`${a} != ${b}`);
function run(g,seconds,fps=60){let remaining=seconds;while(remaining>1e-10){const dt=Math.min(remaining,1/fps);g.update(dt);remaining-=dt;}}
function shot(power,x=0,angle=44){const g=new GameEngine();g.x=x;g.angle=angle;g.startCharge();run(g,power/100*C.launch.chargeMs/1000,120);g.release();return g;}
function untilImpact(g){for(let i=0;i<1000&&g.phase==='flying';i++)g.update(1/120);return g;}
function ball(x,y,vx,vy){return{x,y,vx,vy,rot:0,rotVel:90,timer:0,bounceCount:0};}

test('soft, medium and maximum shots are finite, monotonic and proportionate',()=>{
 near(powerToSpeed(0),260);near(powerToSpeed(100),1120);
 let previous=powerToSpeed(0);
 for(let p=1;p<=100;p++){const speed=powerToSpeed(p);assert.ok(speed>previous);assert.ok(speed-previous<9.4);previous=speed;}
 near(powerToSpeed(-20),260);near(powerToSpeed(200),1120);
 for(const p of [10,50,100]){const g=shot(p);assert.equal(g.phase,'flying');near(Math.hypot(g.ball.vx,g.ball.vy),powerToSpeed(g.lastPower));assert.ok(g.ball.vy<0);untilImpact(g);assert.ok(['miss','scoring'].includes(g.phase));assert.ok(Number.isFinite(g.ball.x));}
});
test('charge responds immediately, never reverses, and retains maximum while held',()=>{
 const g=new GameEngine();g.startCharge();run(g,.1);assert.ok(g.power>5);run(g,1.7);near(g.power,100);run(g,3);near(g.power,100);g.release();assert.equal(g.phase,'flying');near(g.ball.timer,0);
 const tap=new GameEngine();tap.startCharge();tap.release();assert.equal(tap.phase,'flying');near(Math.hypot(tap.ball.vx,tap.ball.vy),260);
});
test('four directions work, clamp to court and angle bounds, and pause clears input',()=>{
 const g=new GameEngine();g.keys.add('d');g.keys.add('w');run(g,2);near(g.x,180);near(g.angle,72);g.keys.clear();g.keys.add('a');g.keys.add('s');run(g,5);near(g.x,-150);near(g.angle,18);g.pause();assert.equal(g.keys.size,0);run(g,1);near(g.x,-150);
});
test('constant gravity follows analytic trajectory and launch direction',()=>{
 const velocity=createLaunchVelocity(65,44),st=ball(350,390,velocity.vx,velocity.vy);
 for(let i=0;i<120;i++)advanceBall(st);
 near(st.x,350+velocity.vx);near(st.y,390+velocity.vy+C.physics.gravity/2);near(st.vy,velocity.vy+C.physics.gravity);
});
test('charge, score, bounce and final state agree at 15/30/60/120/144 FPS and jitter',()=>{
 for(const power of [10,65,100]){
  const results=[];
  for(const fps of [15,30,60,120,144]){
   const g=new GameEngine();g.startCharge();run(g,power/100*1.8,fps);g.release();run(g,.4,fps);
   results.push({x:g.ball.x,y:g.ball.y,vx:g.ball.vx,vy:g.ball.vy,rot:g.ball.rot,power:g.power,score:g.score,lives:g.lives,phase:g.phase});
   run(g,3.6,fps);results.push({phase:g.phase,score:g.score,lives:g.lives});
  }
  for(let i=2;i<results.length;i+=2){for(const key of Object.keys(results[0])){if(typeof results[0][key]==='number')near(results[i][key],results[0][key]);else assert.equal(results[i][key],results[0][key]);}assert.deepEqual(results[i+1],results[1]);}
  const regular=shot(power),jitter=shot(power);run(regular,.6,120);for(const dt of [.011,.031,.008,.15,.2,.05,.15])jitter.update(dt);
  near(regular.ball.x,jitter.ball.x);near(regular.ball.y,jitter.ball.y);assert.equal(regular.score,jitter.score);
 }
});
test('center passes score; wrong direction, misses and earlier lip contacts do not',()=>{
 assert.equal(findContact({x:800,y:238},{x:850,y:238}).kind,'score');
 assert.notEqual(findContact({x:850,y:238},{x:800,y:238})?.kind,'score');
 assert.equal(findContact({x:780,y:267},{x:850,y:267}).kind,'rim');
 assert.equal(findContact({x:810,y:180},{x:850,y:334}).kind,'rim');
 assert.equal(findContact({x:780,y:310},{x:850,y:310}),null);
 // Swept detection must catch a lip even when both ends are outside it.
 assert.equal(findContact({x:700,y:191},{x:950,y:191}).kind,'rim');
});
test('rim, wall and ground reflect about their surface and dissipate energy',()=>{
 for(const [prev,curr,velocity,kind] of [
  [{x:780,y:191},{x:850,y:191},{vx:700,vy:0},'rim'],
  [{x:970,y:300},{x:990,y:300},{vx:700,vy:40},'wall'],
  [{x:500,y:470},{x:500,y:490},{vx:150,vy:500},'ground']]){
  const hit=findContact(prev,curr);assert.equal(hit.kind,kind);
  const st=ball(curr.x,curr.y,velocity.vx,velocity.vy),before=Math.hypot(st.vx,st.vy);
  bounceBall(st,hit);assert.ok(st.vx*hit.nx+st.vy*hit.ny>0);assert.ok(Math.hypot(st.vx,st.vy)<before);assert.equal(st.bounceCount,1);
 }
});
test('wall and rim contacts lose one life, stay bounded and reset the ball',()=>{
 for(const initial of [ball(978,300,900,0),ball(790,191,900,0)]){
  const g=new GameEngine();g.phase='flying';g.ball=initial;run(g,.05,120);assert.equal(g.phase,'miss');assert.equal(g.lives,2);assert.ok(g.impact);assert.ok(g.ball.x<C.physics.rightWall-BALL_RADIUS);run(g,1.2);assert.equal(g.phase,'ready');assert.equal(g.lives,2);assert.equal(g.ball,null);
 }
});
test('valid consecutive shots score exactly once each and preserve combo',()=>{
 const g=shot(65);untilImpact(g);assert.equal(g.score,3000);assert.equal(g.event,1);g.resolve(true);assert.equal(g.score,3000);run(g,1.1);assert.equal(g.phase,'ready');assert.equal(g.ball,null);
 g.startCharge();run(g,1.17,120);g.release();untilImpact(g);assert.equal(g.score,9000);assert.equal(g.combo,3);assert.equal(g.event,2);assert.equal(g.lives,3);
});
test('reachable power bands exist from near, center and far positions',()=>{
 for(const [x,min,max] of [[-150,71,74],[0,62,68],[180,54,68]]){
  let count=0;
  for(let p=min;p<=max;p++){if(untilImpact(shot(p,x)).score>0)count++;}
  assert.ok(count>=3,`position ${x} has only ${count} reachable powers`);
 }
 assert.equal(untilImpact(shot(10)).score,0);assert.equal(untilImpact(shot(100)).score,0);
});
test('misses terminate at three lives without negative lives or duplicate gameover',()=>{
 const g=new GameEngine();for(let i=0;i<3;i++){g.startCharge();run(g,.18);g.release();run(g,3);}
 assert.equal(g.phase,'gameover');assert.equal(g.lives,0);assert.equal(g.event,3);g.startCharge();g.release();g.resolve(false);run(g,2);assert.equal(g.lives,0);
});
test('pause freezes flight; resuming and repeated identical shots are deterministic',()=>{
 const a=shot(65),b=shot(65);run(a,.25);a.pause();const saved={...a.ball};run(a,2);assert.deepEqual(a.ball,saved);a.paused=false;run(a,.25);run(b,.5);assert.deepEqual(a.ball,b.ball);
 a.update(NaN);a.update(Infinity);assert.ok(Number.isFinite(a.ball.x));
});
test('preview terminates at exactly the first live contact or court exit',()=>{
 for(const p of [10,65,100]){
  const st=shot(p),path=simulateTrajectory(350,390,st.lastPower,44);let hit=null;
  for(let i=0;i<280&&!hit;i++){const prev={x:st.ball.x,y:st.ball.y};advanceBall(st.ball);hit=findContact(prev,st.ball);if(isOutOfCourt(st.ball))break;}
  const end=hit??st.ball;assert.ok(hit||isOutOfCourt(st.ball));assert.ok(path.endsWith(`L${end.x.toFixed(2)},${end.y.toFixed(2)}`));
 }
});
test('legacy history remains readable; saving and ranking preserve earlier results',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 Object.defineProperty(globalThis,'localStorage',{value:storage,configurable:true});
 const old={id:'legacy',score:7000,level:3,date:'2026-11-01T00:00:00.000Z',reason:'FIN DEL JUEGO',playerName:'Anterior'};
 data.set('tlachtli-game-history-v1',JSON.stringify([old]));assert.deepEqual(getHistory(),[old]);
 assert.equal(addGameRecord('Actual',9000,4,'FIN DEL JUEGO'),true);assert.equal(getHistory().length,2);assert.equal(getRanking()[0].playerName,'Actual');assert.equal(getHistory()[1].id,'legacy');
 Object.defineProperty(globalThis,'localStorage',{value:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},configurable:true});assert.deepEqual(getHistory(),[]);assert.equal(addGameRecord('X',0,1,'FIN DEL JUEGO'),false);delete globalThis.localStorage;
});

