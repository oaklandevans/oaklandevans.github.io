import { describe, it, expect } from 'vitest'
import { mulberry32, randRange, randChance } from './rng'

describe('mulberry32', () => {
  it('produces the same sequence for the same seed', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    const seqA = [a(), a(), a(), a()]
    const seqB = [b(), b(), b(), b()]
    expect(seqA).toEqual(seqB)
  })

  it('produces different sequences for different seeds', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    expect(a()).not.toBe(b())
  })

  it('always returns values in [0, 1)', () => {
    const rng = mulberry32(7)
    for (let i = 0; i < 200; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
})

describe('randRange', () => {
  it('maps rng()=0 to exactly min', () => {
    expect(randRange(() => 0, 10, 20)).toBe(10)
  })

  it('maps rng() close to 1 to just under max', () => {
    const v = randRange(() => 0.999999, 10, 20)
    expect(v).toBeGreaterThan(19)
    expect(v).toBeLessThan(20)
  })

  it('maps rng()=0.5 to the midpoint', () => {
    expect(randRange(() => 0.5, 0, 10)).toBe(5)
  })
})

describe('randChance', () => {
  it('is true when rng() is below the probability', () => {
    expect(randChance(() => 0, 0.5)).toBe(true)
  })

  it('is false when rng() equals the probability (exclusive upper boundary)', () => {
    expect(randChance(() => 0.5, 0.5)).toBe(false)
  })

  it('is false when rng() is above the probability', () => {
    expect(randChance(() => 0.9, 0.5)).toBe(false)
  })

  it('is always false for probability 0', () => {
    expect(randChance(() => 0, 0)).toBe(false)
  })

  it('is always true for probability 1 given any value below 1', () => {
    expect(randChance(() => 0.999999, 1)).toBe(true)
  })
})
