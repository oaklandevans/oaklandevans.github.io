/** A source of numbers in [0, 1), injectable so game logic is deterministic and testable. */
export type Rng = () => number

export const defaultRng: Rng = Math.random

/** Small, fast, seeded PRNG (mulberry32) for deterministic tests and reproducible runs. */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A uniformly random number in [min, max). */
export function randRange(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min)
}

/** True with probability `probability` (0..1); rng() === 0 always counts as a hit, rng() === value === probability does not. */
export function randChance(rng: Rng, probability: number): boolean {
  return rng() < probability
}
