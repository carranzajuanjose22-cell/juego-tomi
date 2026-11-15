import React from 'react';

interface PowerMeterProps {
  power: number; // 0 to 100
  charging: boolean;
}

export default function PowerMeter({ power, charging }: PowerMeterProps) {
  // Gradual color change: ocre, dorado y rojo en potencia máxima
  let powerColor = '#A88030'; // Ocre
  if (power > 40 && power <= 75) powerColor = '#E0B040'; // Dorado
  else if (power > 75) powerColor = '#C82020'; // Rojo

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, minWidth: 160 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontFamily: "'Cinzel Decorative'", fontSize: 12, fontWeight: 700, color: '#D8C49D', letterSpacing: '0.05em' }}>
          POTENCIA
        </span>
        <span style={{
          fontFamily: "'Exo 2'", fontSize: 13, fontWeight: 800, color: powerColor,
          textShadow: charging && power > 75 ? `0 0 8px ${powerColor}` : 'none'
        }}>
          {Math.round(power)}%
        </span>
      </div>
      
      <div style={{
        height: 20, width: '100%', borderRadius: 6, background: '#0d0b09',
        border: '2px solid #2a1608', position: 'relative', overflow: 'hidden'
      }}>
        {/* Barra de progreso */}
        <div style={{
          height: '100%',
          width: `${power}%`,
          background: `linear-gradient(90deg, #A88030 0%, ${powerColor} 100%)`,
          boxShadow: charging ? `0 0 8px ${powerColor}` : 'none',
          transition: 'width 0.03s linear, background-color 0.1s linear',
          zIndex: 2, position: 'relative'
        }} />
        
        {/* Cursor/Indicador blanco */}
        <div style={{
          position: 'absolute', top: -2, bottom: -2,
          left: `calc(${power}% - 2px)`,
          width: 4, background: '#FFF', borderRadius: 2,
          boxShadow: '0 0 4px rgba(0,0,0,0.5)', zIndex: 3,
          transition: 'left 0.03s linear'
        }} />
      </div>
    </div>
  );
}
