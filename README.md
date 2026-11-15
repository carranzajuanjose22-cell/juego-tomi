# La senda del aro · Piedra & Jade

Juego de precisión inspirado en la pelota mesoamericana. React 19, TypeScript, Vite y SVG; sin backend ni servicios externos. Es una adaptación arcade, no una reconstrucción histórica.

## Desarrollo y verificación

Requiere Node.js 24. Instalar con `pnpm install`, iniciar con `pnpm dev` y abrir la URL de Vite. Si el puerto 8443 está ocupado, usar `pnpm dev -- --port 5174`.

- `npm test`: pruebas del motor con el runner integrado de Node, sin dependencias adicionales.
- `npm run typecheck`: revisión de TypeScript.
- `npm run build`: versión de producción en `dist/`.

## Controles

- Flechas izquierda/derecha (o A/D): posición.
- Flechas arriba/abajo (o W/S): ángulo.
- Mantener espacio o el botón de golpe: cargar. Soltar: lanzar inmediatamente.
- Un toque corto produce un tiro suave; la carga aumenta hasta 100% y permanece allí.
- P/Escape: pausa. Cambiar de ventana pausa y cancela la carga.

La guía tenue al esperar utiliza la potencia del último tiro (60% inicialmente). Durante la carga muestra la potencia real. Cada fallo consume una vida; tres fallos terminan la partida. El primer contacto determina el fallo, luego se muestra el rebote sin consumir vidas adicionales. Una entrada válida suma 3000 por el multiplicador de combo.

## Calibración del lanzamiento

Todos los parámetros están en `src/utils/gameConfig.ts`. Unidades del mundo: píxeles SVG y segundos.

- Gravedad: 900 px/s² (antes 1200).
- Velocidad: 260–1120 px/s (antes 150–1700).
- Conversión: `260 + 860 * (potencia / 100)^1.08`. Aumentar 1 punto de potencia agrega menos de 9.3 px/s, frente a unos 23.25 px/s cerca de media potencia en la curva anterior.
- Carga: de 0 a 100% en 1800 ms, sin espera inicial ni oscilación. El mínimo físico permite tiros suaves incluso con un toque.
- Ángulo: 18–72°, inicialmente 44°, ajuste de 24°/s (antes 32).
- Desplazamiento: 145 px/s; rango relativo −150 a 180.
- Abertura vertical del aro: radio 40 px; pelota: radio 16 px. El centro debe pasar dentro de ±24 px, sin tocar antes los labios de piedra.
- Restitución: suelo 0.48, pared 0.64, aro 0.62. Fricción tangencial: 0.82.

La simulación usa pasos de 1/120 s e integración exacta para aceleración constante. La guía utiliza la misma integración y las mismas colisiones barridas que el vuelo. Se procesa el tiempo pendiente antes de aplicar entradas para no perder carga al soltar entre fotogramas. Los fotogramas de más de 250 ms se limitan para evitar saltos tras bloqueos prolongados; la pérdida de foco pausa la partida.

Con ángulo inicial, la calibración automatizada encuentra zonas de acierto alrededor de 71–74% desde lejos, 62–68% desde el centro y 54–68% desde cerca. Son referencias de esta configuración, no asistencia automática.

## Persistencia

El historial conserva la clave existente `tlachtli-game-history-v1`, hasta 100 partidas y ranking de las mejores 5. Es exclusivo de cada navegador. Los tests usan almacenamiento simulado y nunca modifican los resultados reales del navegador.

## Cobertura y límites de verificación

Las pruebas cubren tiros suaves/medios/máximos, carga sostenida, cuatro direcciones y límites, gravedad, resultados a 15/30/60/120/144 FPS y tiempos variables, cruces válidos y erróneos, contactos a alta velocidad, rebotes, combos, final de partida, pausa, correspondencia de guía y vuelo y compatibilidad del historial. También comprueban que cada intento registra una sola anotación o pérdida de vida.

La validación automática del motor no sustituye una partida visual en navegador: animaciones, sonido percibido y comportamiento táctil necesitan esa revisión adicional.
