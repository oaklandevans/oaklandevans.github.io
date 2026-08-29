import { add, scale, wrap, type Vec2 } from './vector'
import { randRange, randChance, type Rng } from './rng'
import type { SaucerEntity, SaucerSize } from './types'
import {
  SAUCER_RADIUS,
  SAUCER_SPEED,
  SAUCER_FIRE_COOLDOWN_MS,
  SAUCER_DIRECTION_CHANGE_INTERVAL_MS,
  SMALL_SAUCER_INACCURACY_RAD
} from './constants'

export function scoreForSaucer(size: SaucerSize): number {
  return size === 'large' ? 200 : 1000
}

/** Saucers always enter from a world edge and drift across, matching the original's screen-edge spawn. */
export function createSaucer(size: SaucerSize, worldWidth: number, worldHeight: number, rng: Rng, id: number): SaucerEntity {
  const fromLeft = randChance(rng, 0.5)
  const x = fromLeft ? 0 : worldWidth
  const y = randRange(rng, 0, worldHeight)
  const vx = fromLeft ? SAUCER_SPEED : -SAUCER_SPEED
  return {
    id,
    size,
    pos: { x, y },
    vel: { x: vx, y: 0 },
    radius: SAUCER_RADIUS[size],
    fireCooldownMs: SAUCER_FIRE_COOLDOWN_MS,
    directionChangeMs: SAUCER_DIRECTION_CHANGE_INTERVAL_MS
  }
}

export function integrateSaucer(s: SaucerEntity, dt: number, worldWidth: number, worldHeight: number, rng: Rng): SaucerEntity {
  const pos = wrap(add(s.pos, scale(s.vel, dt)), worldWidth, worldHeight)
  const directionChangeMs = s.directionChangeMs - dt
  if (directionChangeMs <= 0) {
    return {
      ...s,
      pos,
      vel: { x: s.vel.x, y: randRange(rng, -SAUCER_SPEED, SAUCER_SPEED) },
      directionChangeMs: SAUCER_DIRECTION_CHANGE_INTERVAL_MS
    }
  }
  return { ...s, pos, directionChangeMs }
}

/** Ticks the saucer's fire cooldown; when it elapses this tick, resets it and signals a shot should be fired. */
export function tickSaucerFire(s: SaucerEntity, dt: number): { saucer: SaucerEntity; shouldFire: boolean } {
  const fireCooldownMs = s.fireCooldownMs - dt
  if (fireCooldownMs <= 0) {
    return { saucer: { ...s, fireCooldownMs: SAUCER_FIRE_COOLDOWN_MS }, shouldFire: true }
  }
  return { saucer: { ...s, fireCooldownMs }, shouldFire: false }
}

/**
 * Small saucers aim toward the ship with bounded inaccuracy; large saucers fire in a uniformly random
 * direction regardless of the ship's position, matching the original's difficulty split between the two.
 */
export function aimSaucerBullet(s: SaucerEntity, shipPos: Vec2 | null, rng: Rng): { heading: number } {
  if (s.size === 'large' || !shipPos) {
    return { heading: randRange(rng, 0, Math.PI * 2) }
  }
  const trueHeading = Math.atan2(shipPos.y - s.pos.y, shipPos.x - s.pos.x)
  const inaccuracy = randRange(rng, -SMALL_SAUCER_INACCURACY_RAD, SMALL_SAUCER_INACCURACY_RAD)
  return { heading: trueHeading + inaccuracy }
}
