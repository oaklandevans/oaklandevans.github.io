import { add, scale, fromAngle, wrap } from './vector'
import type { BulletEntity, BulletOwner, Body } from './types'
import { BULLET_SPEED, BULLET_LIFETIME_MS, SAUCER_BULLET_SPEED } from './constants'

/** Spawns a bullet at `from`'s edge, offset along `heading` by its radius, then traveling that same heading. */
export function spawnBullet(from: Body, heading: number, owner: BulletOwner, id: number): BulletEntity {
  const speed = owner === 'ship' ? BULLET_SPEED : SAUCER_BULLET_SPEED
  const nose = add(from.pos, fromAngle(heading, from.radius))
  return {
    id,
    owner,
    pos: nose,
    vel: fromAngle(heading, speed),
    radius: 2,
    remainingLifeMs: BULLET_LIFETIME_MS
  }
}

/** Advances a bullet by dt; returns null once its lifetime has expired. */
export function integrateBullet(b: BulletEntity, dt: number, worldWidth: number, worldHeight: number): BulletEntity | null {
  const remainingLifeMs = b.remainingLifeMs - dt
  if (remainingLifeMs <= 0) return null
  return {
    ...b,
    pos: wrap(add(b.pos, scale(b.vel, dt)), worldWidth, worldHeight),
    remainingLifeMs
  }
}
