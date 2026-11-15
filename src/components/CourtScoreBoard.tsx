import React from 'react';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';

interface CourtScoreBoardProps {
  score: number;
}

export default function CourtScoreBoard({ score }: CourtScoreBoardProps) {
  const animatedScore = useAnimatedNumber(score);
  
  // Vamos a posicionar este cartel en el centro superior o donde solía estar el marcador.
  // Coordenadas elegidas razonables para tapar números pre-impresos (asumimos top-center o top-left).
  // Ajusta las coordenadas (x, y) si el número original está en otra parte.
  const X = 150;
  const Y = 80;

  return (
    <g transform={`translate(${X}, ${Y})`} className="court-scoreboard">
      {/* Base de piedra del cartel (parche prolijo para tapar la imagen original) */}
      <rect x="-80" y="-30" width="160" height="60" rx="8"
        fill="#2A1604" stroke="#4A2A10" strokeWidth="3"
        style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.6))' }}
      />
      {/* Textura sutil y detalles */}
      <rect x="-76" y="-26" width="152" height="52" rx="5"
        fill="none" stroke="rgba(222, 192, 112, 0.2)" strokeWidth="1"
      />
      {/* Texto de SCORE dinámico */}
      <text x="0" y="-5" textAnchor="middle"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 10, fill: '#A07828',
          letterSpacing: '0.1em'
        }}
      >
        SCORE
      </text>
      <text x="0" y="20" textAnchor="middle"
        style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 24, fontWeight: 900, fill: '#DEC060',
          textShadow: '0 2px 8px rgba(222,192,96,0.3), 1px 2px 0px #000'
        }}
      >
        {animatedScore.toLocaleString('es-ES')}
      </text>
    </g>
  );
}
