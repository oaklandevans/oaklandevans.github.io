import { describe, it, expect } from 'vitest'
import {
  circlesOverlap,
  findBulletAsteroidHits,
  findBulletSaucerHits,
  findShipAsteroidHit,
  findShipSaucerHit,
  findShipBulletHit,
  findSaucerAsteroidHits
} from './collisions'
import type { AsteroidEntity, BulletEntity, SaucerEntity, ShipState } from './types'

function body(x: number, y: number, radius: number) {
  return { pos: { x, y }, vel: { x: 0, y: 0 }, radius }
}

function ship(x: number, y: number, opts: Partial<ShipState> = {}): ShipState {
  return { pos: { x, y }, vel: { x: 0, y: 0 }, radius: 12, heading: 0, alive: true, invulnerableMs: 0, thrusting: false, ...opts }
}

function bullet(x: number, y: number, id: number): BulletEntity {
  return { id, owner: 'ship', pos: { x, y }, vel: { x: 0, y: 0 }, radius: 2, remainingLifeMs: 500 }
}

function asteroid(x: number, y: number, id: number, radius = 40): AsteroidEntity {
  return { id, size: 'large', pos: { x, y }, vel: { x: 0, y: 0 }, radius, rotation: 0, rotationSpeed: 0, shapeOffsets: [] }
}

function saucer(x: number, y: number, id: number, radius = 24): SaucerEntity {
  return { id, size: 'large', pos: { x, y }, vel: { x: 0, y: 0 }, radius, fireCooldownMs: 0, directionChangeMs: 0 }
}

describe('circlesOverlap', () => {
  it('is true when circles overlap', () => {
    expect(circlesOverlap(body(0, 0, 10), body(5, 0, 10))).toBe(true)
  })

  it('is false when circles are well apart', () => {
    expect(circlesOverlap(body(0, 0, 10), body(100, 0, 10))).toBe(false)
  })

  it('is true when circles are exactly touching (boundary is inclusive)', () => {
    expect(circlesOverlap(body(0, 0, 10), body(20, 0, 10))).toBe(true)
  })

  it('is false just past the touching boundary', () => {
    expect(circlesOverlap(body(0, 0, 10), body(20.01, 0, 10))).toBe(false)
  })
})

describe('findBulletAsteroidHits', () => {
  it('returns no hits when nothing overlaps', () => {
    expect(findBulletAsteroidHits([bullet(0, 0, 1)], [asteroid(500, 500, 1)])).toEqual([])
  })

  it('finds a single hit', () => {
    const hits = findBulletAsteroidHits([bullet(0, 0, 1)], [asteroid(5, 0, 1)])
    expect(hits).toEqual([{ bulletId: 1, target: asteroid(5, 0, 1) }])
  })

  it('finds multiple hits across different bullets', () => {
    const a1 = asteroid(0, 0, 1)
    const a2 = asteroid(200, 200, 2)
    const hits = findBulletAsteroidHits([bullet(0, 0, 10), bullet(200, 200, 11)], [a1, a2])
    expect(hits).toHaveLength(2)
  })

  it('does not report a hit for a bullet that misses every asteroid', () => {
    const hits = findBulletAsteroidHits([bullet(0, 0, 1), bullet(9999, 9999, 2)], [asteroid(5, 0, 1)])
    expect(hits).toHaveLength(1)
    expect(hits[0].bulletId).toBe(1)
  })
})

describe('findBulletSaucerHits', () => {
  it('finds a hit between an overlapping bullet and saucer', () => {
    const hits = findBulletSaucerHits([bullet(0, 0, 1)], [saucer(5, 0, 1)])
    expect(hits).toHaveLength(1)
  })

  it('reports no hits when none overlap', () => {
    expect(findBulletSaucerHits([bullet(0, 0, 1)], [saucer(500, 500, 1)])).toEqual([])
  })
})

describe('findShipAsteroidHit', () => {
  it('returns the overlapping asteroid for a vulnerable ship', () => {
    const a = asteroid(5, 0, 1)
    expect(findShipAsteroidHit(ship(0, 0), [a])).toEqual(a)
  })

  it('returns null when no asteroid overlaps', () => {
    expect(findShipAsteroidHit(ship(0, 0), [asteroid(9999, 9999, 1)])).toBeNull()
  })

  it('returns null while the ship is invulnerable, even when overlapping', () => {
    const a = asteroid(5, 0, 1)
    expect(findShipAsteroidHit(ship(0, 0, { invulnerableMs: 500 }), [a])).toBeNull()
  })

  it('returns null for a dead ship', () => {
    const a = asteroid(5, 0, 1)
    expect(findShipAsteroidHit(ship(0, 0, { alive: false }), [a])).toBeNull()
  })
})

describe('findShipSaucerHit', () => {
  it('returns the overlapping saucer', () => {
    const s = saucer(5, 0, 1)
    expect(findShipSaucerHit(ship(0, 0), [s])).toEqual(s)
  })

  it('is suppressed by invulnerability', () => {
    expect(findShipSaucerHit(ship(0, 0, { invulnerableMs: 500 }), [saucer(5, 0, 1)])).toBeNull()
  })
})

describe('findShipBulletHit', () => {
  it('returns the overlapping bullet', () => {
    const b = bullet(5, 0, 1)
    expect(findShipBulletHit(ship(0, 0), [b])).toEqual(b)
  })

  it('is suppressed by invulnerability', () => {
    expect(findShipBulletHit(ship(0, 0, { invulnerableMs: 500 }), [bullet(5, 0, 1)])).toBeNull()
  })

  it('returns null when no bullet overlaps', () => {
    expect(findShipBulletHit(ship(0, 0), [bullet(9999, 9999, 1)])).toBeNull()
  })
})

describe('findSaucerAsteroidHits', () => {
  it('finds an overlapping saucer/asteroid pair', () => {
    const hits = findSaucerAsteroidHits([saucer(0, 0, 1)], [asteroid(10, 0, 1)])
    expect(hits).toEqual([{ saucerId: 1, asteroidId: 1 }])
  })

  it('reports no hits when nothing overlaps', () => {
    expect(findSaucerAsteroidHits([saucer(0, 0, 1)], [asteroid(9999, 9999, 1)])).toEqual([])
  })

  it('finds multiple independent pairs', () => {
    const hits = findSaucerAsteroidHits(
      [saucer(0, 0, 1), saucer(300, 300, 2)],
      [asteroid(10, 0, 1), asteroid(310, 300, 2)]
    )
    expect(hits).toHaveLength(2)
  })
})
