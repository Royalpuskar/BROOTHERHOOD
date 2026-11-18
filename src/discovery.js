// Brootherhood Discovery Engine: deterministic, testable educational missions.
// Hypothetical transport coefficients are classroom assumptions, not measurements.
export const WORLDS = Object.freeze({
  fractions: { name: 'Fraction Playground', icon: '◒', label: 'Mathematics', lab: 'fractions' },
  circuit: { name: 'Electricity Studio', icon: '⚡', label: 'Physics', lab: 'circuit' },
  eco: { name: 'Eco Choices', icon: '✳', label: 'Sustainability', lab: 'eco' }
});
export const LEVELS = Object.freeze(['starter','explorer','master']);
export const CASES = Object.freeze({
  fractions: {
    starter: { prompt: 'A class shares 8 equal pizza slices. How many slices make half?', answer: 4, hint: 'Half means one of two equal groups. Divide 8 by 2.', explanation: '4 of 8 equal slices is one half, or 50%.' },
    explorer: { prompt: 'A garden has 12 equal plots. How many plots represent three quarters?', answer: 9, hint: 'Divide 12 into four equal groups, then take three groups.', explanation: '12 ÷ 4 = 3; 3 × 3 = 9 plots, so 9/12 = 3/4.' },
    master: { prompt: 'A model has 20 equal segments. How many represent 35%?', answer: 7, hint: 'Convert 35% to 35/100; multiply by 20.', explanation: '0.35 × 20 = 7 segments, so 7/20 is 35%.' }
  },
  circuit: {
    starter: { prompt: 'A simple circuit has 6 volts and 3 ohms. How many amperes flow?', answer: 2, hint: 'Ohm’s law: current = voltage ÷ resistance.', explanation: '6 V ÷ 3 Ω = 2 A in an idealized DC circuit.' },
    explorer: { prompt: 'A battery provides 12 volts across 4 ohms. What is the current in amperes?', answer: 3, hint: 'Divide the voltage by resistance.', explanation: '12 V ÷ 4 Ω = 3 A.' },
    master: { prompt: 'A circuit draws 2 amperes from a 10-volt source. What resistance in ohms is needed?', answer: 5, hint: 'Rearrange Ohm’s law: resistance = voltage ÷ current.', explanation: '10 V ÷ 2 A = 5 Ω.' }
  },
  eco: {
    starter: { prompt: 'In our hypothetical model, one car trip adds 3 kg CO₂ and one bus trip adds 1 kg. What is the total for one of each?', answer: 4, hint: 'Add the two assumed values: 3 + 1.', explanation: '3 + 1 = 4 illustrative kg CO₂. Real travel emissions vary.' },
    explorer: { prompt: 'In our model, two car trips and two bus trips total how many illustrative kg CO₂?', answer: 8, hint: 'Each car trip counts as 3, and each bus trip counts as 1.', explanation: '(2 × 3) + (2 × 1) = 8 illustrative kg CO₂.' },
    master: { prompt: 'A 5 kg weekly goal includes two bus trips (1 kg each). How many car trips (3 kg each) can fit within that goal?', answer: 1, hint: 'Subtract 2 from 5, then divide the remainder by 3.', explanation: '5 − 2 = 3; one car trip fits exactly. Coefficients are hypothetical.' }
  }
});
export function missionKey(world,level) {
  return (Object.hasOwn(CASES, world) && LEVELS.includes(level)) ? world + ':' + level : null;
}
export function evaluateMission(world, level, rawAnswer) {
  const key = missionKey(world,level);
  if (!key) return {valid:false,correct:false,message:'Choose a valid mission.'};
  if (rawAnswer === '' || rawAnswer === null || rawAnswer === undefined || !Number.isFinite(Number(rawAnswer))) {
    return {valid:false,correct:false,message:'Enter a numeric answer to continue.'};
  }
  const n = Number(rawAnswer);
  if (n < 0 || n > 1e6) return {valid:false,correct:false,message:'Enter a realistic nonnegative number.'};
  const task = CASES[world][level];
  return {valid:true,correct:Math.abs(n-task.answer)<1e-9,message:Math.abs(n-task.answer)<1e-9 ? task.explanation : 'Not quite. Try the hint and adjust your answer.'};
}
export function safeAchievements(raw) {
  try {
    const val = JSON.parse(raw);
    if (!Array.isArray(val)) return [];
    return [...new Set(val.filter(x => typeof x === 'string' && Object.keys(CASES).some(w=>LEVELS.some(l=>x===w+':'+l))))];
  } catch { return []; }
}
export function earnedTitle(achievements) {
  const n = achievements.length;
  return n===9 ? 'Master of Discovery' : n>=6 ? 'Trailblazer' : n>=3 ? 'Curious Explorer' : n>=1 ? 'First Spark' : 'New Explorer';
}
