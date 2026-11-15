import { useState, useEffect, useRef } from 'react';
export function useAnimatedNumber(target: number, duration = 450) {
 const [current,setCurrent] = useState(target);
 const value = useRef(target);
 useEffect(()=>{
  if(target===0){value.current=0;setCurrent(0);return;}
  const start=value.current, time=performance.now();let frame=0;
  const tick=(now:number)=>{const t=Math.min(1,(now-time)/duration);value.current=Math.round(start+(target-start)*(1-Math.pow(1-t,3)));setCurrent(value.current);if(t<1)frame=requestAnimationFrame(tick);};
  frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[target,duration]);
 return current;
}
