import { distanceSquared } from './vector'
import type { Body, BulletEntity, AsteroidEntity, SaucerEntity, ShipState } from './types'

export function circlesOverlap(a: Body, b: Body): boolean {
  const r = a.radius + b.radius
  return distanceSquared(a.pos, b.pos) <= r * r
}

export interface BulletHit<T> {
  bulletId: number
  target: T
}

function findBulletHits<T extends Body>(bullets: BulletEntity[], targets: T[]): BulletHit<T>[] {
  const hits: BulletHit<T>[] = []
  for (const bullet of bullets) {
    for (const target of targets) {
      if (circlesOverlap(bullet, target)) {
        hits.push({ bulletId: bullet.id, target })
        break // one bullet destroys at most one target per tick
      }
    }
  }
  return hits
}

export function findBulletAsteroidHits(bullets: BulletEntity[], asteroids: AsteroidEntity[]): BulletHit<AsteroidEntity>[] {
  return findBulletHits(bullets, asteroids)
}

export function findBulletSaucerHits(bullets: BulletEntity[], saucers: SaucerEntity[]): BulletHit<SaucerEntity>[] {
  return findBulletHits(bullets, saucers)
}

/** Returns the asteroid the (vulnerable) ship is touching, or null if there's no live collision. */
export function findShipAsteroidHit(ship: ShipState, asteroids: AsteroidEntity[]): AsteroidEntity | null {
  if (ship.invulnerableMs > 0 || !ship.alive) return null
  for (const asteroid of asteroids) {
    if (circlesOverlap(ship, asteroid)) return asteroid
  }
  return null
}

export function findShipSaucerHit(ship: ShipState, saucers: SaucerEntity[]): SaucerEntity | null {
  if (ship.invulnerableMs > 0 || !ship.alive) return null
  for (const saucer of saucers) {
    if (circlesOverlap(ship, saucer)) return saucer
  }
  return null
}

export function findShipBulletHit(ship: ShipState, bullets: BulletEntity[]): BulletEntity | null {
  if (ship.invulnerableMs > 0 || !ship.alive) return null
  for (const bullet of bullets) {
    if (circlesOverlap(ship, bullet)) return bullet
  }
  return null
}

export interface SaucerAsteroidHit {
  saucerId: number
  asteroidId: number
}

export function findSaucerAsteroidHits(saucers: SaucerEntity[], asteroids: AsteroidEntity[]): SaucerAsteroidHit[] {
  const hits: SaucerAsteroidHit[] = []
  for (const saucer of saucers) {
    for (const asteroid of asteroids) {
      if (circlesOverlap(saucer, asteroid)) {
        hits.push({ saucerId: saucer.id, asteroidId: asteroid.id })
        break
      }
    }
  }
  return hits
}
