import { describe, it, expect } from 'vitest'
import { createSaucer, integrateSaucer, tickSaucerFire, aimSaucerBullet, scoreForSaucer } from './Saucer'
import { SAUCER_RADIUS, SAUCER_FIRE_COOLDOWN_MS, SAUCER_DIRECTION_CHANGE_INTERVAL_MS, WORLD_WIDTH, WORLD_HEIGHT } from './constants'

describe('scoreForSaucer', () => {
  it('returns the original arcade point values', () => {
    expect(scoreForSaucer('large')).toBe(200)
    expect(scoreForSaucer('small')).toBe(1000)
  })
})

describe('createSaucer', () => {
  it('spawns on the left edge and drifts right when rng favors "from left"', () => {
    const s = createSaucer('large', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1)
    expect(s.pos.x).toBe(0)
    expect(s.vel.x).toBeGreaterThan(0)
  })

  it('spawns on the right edge and drifts left when rng favors "from right"', () => {
    const s = createSaucer('large', WORLD_WIDTH, WORLD_HEIGHT, () => 0.99, 1)
    expect(s.pos.x).toBe(WORLD_WIDTH)
    expect(s.vel.x).toBeLessThan(0)
  })

  it('assigns the size-appropriate radius', () => {
    expect(createSaucer('large', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1).radius).toBe(SAUCER_RADIUS.large)
    expect(createSaucer('small', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1).radius).toBe(SAUCER_RADIUS.small)
  })

  it('starts with a full fire cooldown and direction-change timer', () => {
    const s = createSaucer('small', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1)
    expect(s.fireCooldownMs).toBe(SAUCER_FIRE_COOLDOWN_MS)
    expect(s.directionChangeMs).toBe(SAUCER_DIRECTION_CHANGE_INTERVAL_MS)
  })
})

describe('integrateSaucer', () => {
  it('moves horizontally and does not change vertical velocity before the direction-change timer elapses', () => {
    const s = createSaucer('large', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1)
    const moved = integrateSaucer(s, 10, WORLD_WIDTH, WORLD_HEIGHT, () => 0.5)
    expect(moved.vel.y).toBe(s.vel.y)
    expect(moved.directionChangeMs).toBe(s.directionChangeMs - 10)
  })

  it('randomizes vertical velocity and resets the timer once it elapses', () => {
    const s = { ...createSaucer('large', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1), directionChangeMs: 5 }
    const moved = integrateSaucer(s, 10, WORLD_WIDTH, WORLD_HEIGHT, () => 0.75)
    expect(moved.directionChangeMs).toBe(SAUCER_DIRECTION_CHANGE_INTERVAL_MS)
    expect(moved.vel.y).not.toBe(s.vel.y)
  })
})

describe('tickSaucerFire', () => {
  it('does not fire while the cooldown has time remaining', () => {
    const s = createSaucer('large', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1)
    const { shouldFire, saucer } = tickSaucerFire(s, 10)
    expect(shouldFire).toBe(false)
    expect(saucer.fireCooldownMs).toBe(SAUCER_FIRE_COOLDOWN_MS - 10)
  })

  it('fires and resets the cooldown once it elapses', () => {
    const s = { ...createSaucer('large', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1), fireCooldownMs: 5 }
    const { shouldFire, saucer } = tickSaucerFire(s, 10)
    expect(shouldFire).toBe(true)
    expect(saucer.fireCooldownMs).toBe(SAUCER_FIRE_COOLDOWN_MS)
  })
})

describe('aimSaucerBullet', () => {
  it('large saucers fire in a uniformly-random direction, ignoring the ship position', () => {
    const s = createSaucer('large', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1)
    const { heading } = aimSaucerBullet(s, { x: 999, y: 999 }, () => 0.25)
    expect(heading).toBeCloseTo(0.25 * Math.PI * 2)
  })

  it('small saucers aim toward the ship within the configured inaccuracy bound', () => {
    const s = { ...createSaucer('small', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1), pos: { x: 0, y: 0 } }
    const shipPos = { x: 100, y: 0 } // ship due "east" of the saucer -> true heading is 0
    // sample across the rng range and confirm every result stays within the inaccuracy bound of 0
    for (const r of [0, 0.25, 0.5, 0.75, 1]) {
      const { heading } = aimSaucerBullet(s, shipPos, () => r)
      expect(Math.abs(heading)).toBeLessThanOrEqual(Math.PI / 12 + 1e-9)
    }
  })

  it('small saucers with no ship on the field fall back to a random heading', () => {
    const s = createSaucer('small', WORLD_WIDTH, WORLD_HEIGHT, () => 0, 1)
    const { heading } = aimSaucerBullet(s, null, () => 0.25)
    expect(heading).toBeCloseTo(0.25 * Math.PI * 2)
  })
})
