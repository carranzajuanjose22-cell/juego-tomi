import React from 'react';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  const animatedScore = useAnimatedNumber(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span style={{ fontFamily: "'Cinzel'", fontSize: 'clamp(8px, 1.5vw, 10px)', color: '#8A6825', fontWeight: 800, letterSpacing: '0.18em' }}>PUNTAJE:</span>
      <span style={{ fontFamily: "'Cinzel Decorative'", fontSize: 'clamp(24px, 4.5vw, 30px)', color: '#D8C49D', fontWeight: 900, letterSpacing: '0.03em', marginTop: 2 }}>
        {animatedScore.toLocaleString('es-ES')}
      </span>
    </div>
  );
}
