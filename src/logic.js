/** Pure domain logic, testable without a browser. */
export function clamp(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
}
export function fractionModel(numerator, denominator) {
  const total = clamp(Math.round(denominator), 2, 12);
  const filled = clamp(Math.round(numerator), 0, total);
  return { numerator: filled, denominator: total, fraction: `${filled}/${total}`, percent: Math.round((filled / total) * 100), isHalf: filled * 2 === total };
}
export function circuitModel(voltage, resistance) {
  const volts = clamp(Math.round(voltage), 1, 12);
  const ohms = clamp(Math.round(resistance), 2, 30);
  const amps = volts / ohms;
  return { voltage: volts, resistance: ohms, current: amps, currentLabel: `${amps.toFixed(2)} A`, power: volts * amps, isOneAmp: Math.abs(amps - 1) < 1e-9 };
}
export function ecoModel(carTrips, busTrips) {
  const cars = clamp(Math.round(carTrips), 0, 7);
  const buses = clamp(Math.round(busTrips), 0, 7);
  // Hypothetical pedagogical factors, NOT measured emission values.
  const kg = cars * 3 + buses;
  return { carTrips: cars, busTrips: buses, kg, kgLabel: `${kg.toFixed(1)} kg`, reachedGoal: kg <= 5 };
}
export function progressCount(progress) {
  return ['fractions', 'circuit', 'eco'].filter(key => progress[key] === true).length;
}
export function safeProgress(raw) {
  try {
    const saved = JSON.parse(raw);
    return { fractions: saved?.fractions === true, circuit: saved?.circuit === true, eco: saved?.eco === true };
  } catch { return { fractions: false, circuit: false, eco: false }; }
}
