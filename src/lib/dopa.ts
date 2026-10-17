export type Random = () => number;

/** ドパドパモードのルール(dopaben の design/DECISIONS.md を踏襲)。3分でポイントを稼ぐ。 */
export const TIME_LIMIT_MS = 3 * 60 * 1000;
export const BASE_POINT = 100;
export const AUTO_NEXT_MS = 1000;
export const CHARGE_MS = 380;
export const ZONE_INTRO_MS = 1100;
export const ZONE_ENTER_DELAY_MS = 600;
export const COMBO_MILESTONE = 10;
export const MILESTONE_MS = 1400;

export const ZONE_RATE = 1 / 7;
export const ZONE_RATE_HOT = 1 / 4;
export const CHANCE_RATE = 1 / 5;
export const MULTIPLIERS = [
  [2, 60],
  [3, 25],
  [5, 12],
  [10, 3],
] as const;
export const LUCKY_RATE = 1 / 12;

export type Tier = 'blue' | 'green' | 'red' | 'gold' | 'rainbow';

export function isComboMilestone(zoneRun: number): boolean {
  return zoneRun > 0 && zoneRun % COMBO_MILESTONE === 0;
}

export function pickMultiplier(rand: Random = Math.random): number {
  let r = rand() * 100;
  for (const [m, w] of MULTIPLIERS) {
    r -= w;
    if (r < 0) return m;
  }
  return MULTIPLIERS[0][0];
}

export function isLucky(streak: number, rand: Random = Math.random): boolean {
  return streak < 7 && rand() < LUCKY_RATE;
}

export function shouldEnterZone(streak: number, rand: Random = Math.random): boolean {
  return rand() < (streak >= 3 ? ZONE_RATE_HOT : ZONE_RATE);
}

/** 演出の段階: 青 < 緑 < 赤 < 金 < 虹。連続正解数と倍チャンスの倍率で上がる */
export function tierOf(streak: number, { lucky = false, multiplier = 1 } = {}): Tier {
  const order: Tier[] = ['blue', 'green', 'red', 'gold', 'rainbow'];
  let tier: Tier = lucky || streak >= 7 ? 'rainbow' : streak >= 5 ? 'gold' : streak === 4 ? 'red' : streak === 3 ? 'green' : 'blue';
  const atLeast = (t: Tier) => {
    if (order.indexOf(tier) < order.indexOf(t)) tier = t;
  };
  if (multiplier >= 5) atLeast('rainbow');
  else if (multiplier === 3) atLeast('gold');
  else if (multiplier === 2) atLeast('red');
  return tier;
}

export function pointsFor(multiplier: number, bonus = 1): number {
  return Math.round(BASE_POINT * multiplier * bonus);
}

export function formatTime(ms: number): string {
  const sec = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}
