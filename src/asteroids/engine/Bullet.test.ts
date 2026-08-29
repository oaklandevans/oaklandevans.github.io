import { describe, it, expect } from 'vitest'
import { spawnBullet, integrateBullet } from './Bullet'
import type { BulletEntity } from './types'
import { BULLET_SPEED, BULLET_LIFETIME_MS, SAUCER_BULLET_SPEED, WORLD_WIDTH, WORLD_HEIGHT } from './constants'

describe('spawnBullet', () => {
  it('spawns at the source nose, offset by its radius along heading 0', () => {
    const source = { pos: { x: 100, y: 100 }, vel: { x: 0, y: 0 }, radius: 10, heading: 0 }
    const bullet = spawnBullet(source, 0, 'ship', 1)
    expect(bullet.pos.x).toBeCloseTo(110)
    expect(bullet.pos.y).toBeCloseTo(100)
  })

  it('travels along the given heading at ship bullet speed for a ship-owned bullet', () => {
    const source = { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, radius: 0, heading: 0 }
    const bullet = spawnBullet(source, 0, 'ship', 1)
    expect(bullet.vel.x).toBeCloseTo(BULLET_SPEED)
    expect(bullet.vel.y).toBeCloseTo(0)
    expect(bullet.owner).toBe('ship')
  })

  it('uses the (slower) saucer bullet speed for a saucer-owned bullet', () => {
    const source = { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, radius: 0, heading: 0 }
    const bullet = spawnBullet(source, 0, 'saucer', 2)
    expect(bullet.vel.x).toBeCloseTo(SAUCER_BULLET_SPEED)
    expect(bullet.owner).toBe('saucer')
    expect(SAUCER_BULLET_SPEED).toBeLessThan(BULLET_SPEED)
  })

  it('starts at full lifetime and carries the given id', () => {
    const source = { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, radius: 0, heading: 0 }
    const bullet = spawnBullet(source, 0, 'ship', 42)
    expect(bullet.remainingLifeMs).toBe(BULLET_LIFETIME_MS)
    expect(bullet.id).toBe(42)
  })
})

describe('integrateBullet', () => {
  it('moves in a straight line matching pos0 + vel * t', () => {
    let bullet: BulletEntity = { id: 1, owner: 'ship', pos: { x: 0, y: 0 }, vel: { x: 1, y: 2 }, radius: 2, remainingLifeMs: 1000 }
    for (let i = 0; i < 5; i++) {
      bullet = integrateBullet(bullet, 10, WORLD_WIDTH, WORLD_HEIGHT)!
    }
    expect(bullet.pos.x).toBeCloseTo(50)
    expect(bullet.pos.y).toBeCloseTo(100)
  })

  it('wraps mid-flight instead of expiring at the world edge', () => {
    const bullet = {
      id: 1,
      owner: 'ship' as const,
      pos: { x: WORLD_WIDTH - 2, y: 100 },
      vel: { x: 1, y: 0 },
      radius: 2,
      remainingLifeMs: 1000
    }
    const result = integrateBullet(bullet, 10, WORLD_WIDTH, WORLD_HEIGHT)
    expect(result).not.toBeNull()
    expect(result!.pos.x).toBeCloseTo(8) // (WORLD_WIDTH - 2) + 10 wraps past WORLD_WIDTH to 8
  })

  it('is still alive exactly one tick before its lifetime expires', () => {
    const bullet = { id: 1, owner: 'ship' as const, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, radius: 2, remainingLifeMs: 10 }
    const result = integrateBullet(bullet, 9, WORLD_WIDTH, WORLD_HEIGHT)
    expect(result).not.toBeNull()
    expect(result!.remainingLifeMs).toBe(1)
  })

  it('expires (returns null) once its lifetime is exhausted', () => {
    const bullet = { id: 1, owner: 'ship' as const, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, radius: 2, remainingLifeMs: 10 }
    expect(integrateBullet(bullet, 10, WORLD_WIDTH, WORLD_HEIGHT)).toBeNull()
    expect(integrateBullet(bullet, 20, WORLD_WIDTH, WORLD_HEIGHT)).toBeNull()
  })
})
