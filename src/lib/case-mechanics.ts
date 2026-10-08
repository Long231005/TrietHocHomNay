export const OPENING_DELAY_MS = 2400;
export const SPIN_DURATION_MS = 6000;
export const TICK_SECONDS = [0,.063,.125,.188,.250,.313,.375,.438,.500,.563,.625,.688,.750,.813,.875,.938,1,1.063,1.125,1.188,1.250,1.313,1.375,1.483,1.351,1.620,1.701,1.786,1.872,2.003,2.154,2.313,2.466,2.615,2.773,2.941,3.104,3.339,3.630,3.953,4.385,5.004].sort((a,b)=>a-b);
export const LOG_PRICE_SPREAD = .35;

export const TIER_DROP_RATES = [0.70, 0.25, 0.05] as const;
export const PITY_4_THRESHOLD = 5;
export const PITY_5_THRESHOLD = 10;

export type Tiered = { rarity: 3 | 4 | 5 };

export function chooseTieredWithPity<T extends Tiered>(
  items: T[],
  pity4Count: number,
  pity5Count: number,
  random = Math.random
): { item: T; pity4Reset: boolean; pity5Reset: boolean } {
  if (!items.length) throw new Error('No eligible items');
  const groups = TIER_DROP_RATES.map((_, tier) => items.filter((item) => item.rarity === (tier + 3) as T['rarity']));
  const total = TIER_DROP_RATES.reduce((sum, rate, tier) => sum + (groups[tier].length ? rate : 0), 0);
  if (!total) throw new Error('No eligible tiers');

  let targetTier: number = 0;
  if (pity5Count >= PITY_5_THRESHOLD) {
    targetTier = 2;
  } else if (pity4Count >= PITY_4_THRESHOLD) {
    targetTier = 1;
  } else {
    const tierDraw = random();
    let draw = tierDraw * total;
    for (let tier = 0; tier < groups.length; tier++) {
      if (!groups[tier].length) continue;
      draw -= TIER_DROP_RATES[tier];
      if (draw < 0) {
        targetTier = tier;
        break;
      }
    }
    if (targetTier === undefined) {
      for (let tier = groups.length - 1; tier >= 0; tier--) {
        if (groups[tier].length) { targetTier = tier; break; }
      }
    }
  }

  if (!groups[targetTier!].length) {
    for (let tier = groups.length - 1; tier >= 0; tier--) {
      if (groups[tier].length) { targetTier = tier; break; }
    }
  }

  const pick = random();
  const item = groups[targetTier!][Math.floor(pick * groups[targetTier!].length)];
  return {
    item,
    pity4Reset: targetTier! >= 1,
    pity5Reset: targetTier! === 2,
  };
}

export function chooseTiered<T extends Tiered>(items: T[], random = Math.random): T {
  const result = chooseTieredWithPity(items, 0, 0, random);
  return result.item;
}

export function stopFraction(random = Math.random) { return (Math.floor(random() * 81) + 10) / 100 }

export function createSpinProfile(random = Math.random, reducedMotion = false) {
  if (reducedMotion) return { durationMs: 4000 + Math.floor(random() * 1001), tiles: 10 + Math.floor(random() * 4), friction: 2.7 + random() * .6 };
  return { durationMs: 7500 + Math.floor(random() * 2001), tiles: 30 + Math.floor(random() * 11), friction: 2.7 + random() * .6 };
}

export function spinProgress(progress: number, friction: number) {
  const p = Math.max(0, Math.min(1, progress));
  return 1 - Math.pow(1 - p, friction);
}
