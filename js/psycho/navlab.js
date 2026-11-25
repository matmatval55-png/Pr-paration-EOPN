// Modèle plan horizontal, nœuds, milles nautiques, angles vrais (nord = 0°).
const rad = Math.PI / 180;
export const norm = (angle) => ((angle % 360) + 360) % 360;
export const signed = (angle) => norm(angle + 180) - 180;
const vector = (heading, speed) => [Math.sin(heading * rad) * speed, Math.cos(heading * rad) * speed];

export function groundTrack(heading, { tas, windFrom, windKt }) {
  const [x, y] = vector(heading, tas);
  const [windX, windY] = vector(windFrom + 180, windKt);
  return norm(Math.atan2(x + windX, y + windY) / rad);
}

export function advanceAircraft(state, bank, dt, scenario) {
  const { tas, windFrom, windKt } = scenario;
  const turn = 9.80665 * Math.tan(bank * rad) / (tas * 1852 / 3600) / rad;
  const heading = norm(state.heading + turn * dt);
  const [airX, airY] = vector(state.heading + turn * dt / 2, tas);
  const [windX, windY] = vector(windFrom + 180, windKt);
  return { heading, x: state.x + (airX + windX) * dt / 3600, y: state.y + (airY + windY) * dt / 3600 };
}

export function vorIndication({ x, y }, course) {
  const distance = Math.hypot(x, y);
  const bearingTo = norm(Math.atan2(-x, -y) / rad);
  const angle = signed(bearingTo - course);
  const to = Math.abs(angle) < 90;
  const valid = distance >= 0.2 && Math.abs(Math.abs(angle) - 90) >= 1;
  const [rightX, rightY] = vector(course + 90, 1);
  const [forwardX, forwardY] = vector(course, 1);
  return { distance, bearingTo, to, valid, deviation: to ? angle : signed(-angle + 180),
    crossTrack: x * rightX + y * rightY, alongTrack: x * forwardX + y * forwardY };
}

export const NAV_SCENARIOS = [
  { title: 'Intercepter le 360° vers la balise', x: -1.1, y: -5, heading: 45, course: 0, tas: 120, windFrom: 0, windKt: 0 },
  { title: 'Intercepter le 090° avec vent du sud', x: -5, y: 1, heading: 135, course: 90, tas: 130, windFrom: 180, windKt: 22 },
  { title: 'Intercepter le 225° avec vent d’ouest', x: 4.6, y: 2.6, heading: 260, course: 225, tas: 140, windFrom: 270, windKt: 28 },
];
