import { forwardRef } from 'react';
export default forwardRef<HTMLDivElement,{power:number;charging:boolean}>(function PowerMeter({power,charging},ref) {
 return <div ref={ref} className={`power-meter ${charging?'charging':''}`} role="meter" aria-label="Potencia del lanzamiento" aria-valuemin={0} aria-valuemax={100} aria-valuenow={power}>
 <div className="power-heading"><span>POTENCIA</span><b data-power-value>{power}%</b></div>
 <div className="power-track"><div data-power-fill className="power-fill" style={{transform:`scaleX(${power/100})`}}/><div className="power-ticks"/></div>
 <div className="power-scale"><span>SUAVE</span><span>MEDIA</span><span>FUERTE</span></div>
 </div>;
});
