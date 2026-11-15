import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
export default function ScoreDisplay({score}:{score:number}) {
 const animatedScore=useAnimatedNumber(score);
 return <div className="score-display"><span className="score-label">PUNTOS</span><div className="score-value" aria-label={`${score} puntos`}>{animatedScore.toLocaleString('es-AR')}</div></div>;
}
