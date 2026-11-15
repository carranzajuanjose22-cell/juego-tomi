/** World units are SVG pixels; time is seconds. Tune gameplay here. */
export const GAME_CONFIG = {
  physics: { gravity: 900, fixedStep: 1 / 120, maxFrameDelta: 0.25,
    floorY: 494, leftWall: 24, rightWall: 1000, wallTop: 160,
    groundBounce: 0.48, wallBounce: 0.64, rimBounce: 0.62,
    friction: 0.82, maxFlightSeconds: 4.5, outLeft: -50, outRight: 1080, outTop: -250 },
  launch: { minSpeed: 260, maxSpeed: 1120, curve: 1.08, chargeMs: 1800,
    minAngle: 18, maxAngle: 72, defaultAngle: 44, angleSpeed: 24,
    moveSpeed: 145, minX: -150, maxX: 180, previewPower: 60 },
  ball: { radius: 16, startX: 350, startY: 390 },
  ring: { x: 825, y: 238, innerRadius: 40, thickness: 14 },
  feedback: { scoreSeconds: 0.95, missSeconds: 1.05, impactSeconds: 0.36 },
} as const;
