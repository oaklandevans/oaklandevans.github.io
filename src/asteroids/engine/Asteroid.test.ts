import { describe, it, expect } from 'vitest'
import { createAsteroid, scoreFor, splitAsteroid, integrateAsteroid } from './Asteroid'
import { mulberry32 } from './rng'
import { ASTEROID_RADII, ASTEROID_SPEED_RANGE, WORLD_WIDTH, WORLD_HEIGHT } from './constants'

function idGen(): () => number {
  let next = 1
  return () => next++
}

describe('createAsteroid', () => {
  it('assigns the size-appropriate radius', () => {
    const rng = mulberry32(1)
    expect(createAsteroid('large', { x: 0, y: 0 }, rng, 1).radius).toBe(ASTEROID_RADII.large)
    expect(createAsteroid('medium', { x: 0, y: 0 }, rng, 2).radius).toBe(ASTEROID_RADII.medium)
    expect(createAsteroid('small', { x: 0, y: 0 }, rng, 3).radius).toBe(ASTEROID_RADII.small)
  })

  it('gives speed within the configured range for its size', () => {
    const rng = mulberry32(99)
    for (let i = 0; i < 50; i++) {
      const a = createAsteroid('medium', { x: 0, y: 0 }, rng, i)
      const speed = Math.hypot(a.vel.x, a.vel.y)
      const [min, max] = ASTEROID_SPEED_RANGE.medium
      expect(speed).toBeGreaterThanOrEqual(min - 1e-9)
      expect(speed).toBeLessThanOrEqual(max + 1e-9)
    }
  })

  it('spawns at the given position and carries the given id', () => {
    const a = createAsteroid('large', { x: 55, y: 66 }, mulberry32(1), 7)
    expect(a.pos).toEqual({ x: 55, y: 66 })
    expect(a.id).toBe(7)
  })
})

describe('scoreFor', () => {
  it('returns the original arcade point values', () => {
    expect(scoreFor('large')).toBe(20)
    expect(scoreFor('medium')).toBe(50)
    expect(scoreFor('small')).toBe(100)
  })
})

describe('splitAsteroid', () => {
  it('splits a large asteroid into two medium asteroids', () => {
    const large = createAsteroid('large', { x: 400, y: 300 }, mulberry32(1), 1)
    const children = splitAsteroid(large, mulberry32(2), idGen())
    expect(children).toHaveLength(2)
    expect(children.every((c) => c.size === 'medium')).toBe(true)
  })

  it('splits a medium asteroid into two small asteroids', () => {
    const medium = createAsteroid('medium', { x: 400, y: 300 }, mulberry32(1), 1)
    const children = splitAsteroid(medium, mulberry32(2), idGen())
    expect(children).toHaveLength(2)
    expect(children.every((c) => c.size === 'small')).toBe(true)
  })

  it('destroys a small asteroid completely (no children)', () => {
    const small = createAsteroid('small', { x: 400, y: 300 }, mulberry32(1), 1)
    expect(splitAsteroid(small, mulberry32(2), idGen())).toEqual([])
  })

  it('gives the two children divergent velocities rather than cloning the parent', () => {
    const large = createAsteroid('large', { x: 400, y: 300 }, mulberry32(1), 1)
    const [a, b] = splitAsteroid(large, mulberry32(5), idGen())
    expect(a.vel).not.toEqual(b.vel)
  })

  it('offsets children away from the parent center so they do not instantly overlap it', () => {
    const large = createAsteroid('large', { x: 400, y: 300 }, mulberry32(1), 1)
    const children = splitAsteroid(large, mulberry32(3), idGen())
    for (const child of children) {
      const dist = Math.hypot(child.pos.x - large.pos.x, child.pos.y - large.pos.y)
      expect(dist).toBeGreaterThan(0)
    }
  })

  it('assigns each child a unique id from the generator', () => {
    const large = createAsteroid('large', { x: 400, y: 300 }, mulberry32(1), 1)
    const children = splitAsteroid(large, mulberry32(4), idGen())
    expect(children[0].id).not.toBe(children[1].id)
  })
})

describe('integrateAsteroid', () => {
  it('advances position by velocity * dt and wraps at the world edge', () => {
    const a = createAsteroid('large', { x: WORLD_WIDTH - 1, y: 100 }, mulberry32(1), 1)
    const moved = integrateAsteroid({ ...a, vel: { x: 1, y: 0 } }, 10, WORLD_WIDTH, WORLD_HEIGHT)
    expect(moved.pos.x).toBeCloseTo(9)
  })

  it('advances rotation by rotationSpeed * dt', () => {
    const a = { ...createAsteroid('large', { x: 0, y: 0 }, mulberry32(1), 1), rotation: 0, rotationSpeed: 0.001 }
    const moved = integrateAsteroid(a, 100, WORLD_WIDTH, WORLD_HEIGHT)
    expect(moved.rotation).toBeCloseTo(0.1)
  })
})
