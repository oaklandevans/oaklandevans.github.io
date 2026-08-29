import { distanceSquared, type Vec2 } from './vector'
import { randRange, type Rng } from './rng'
import { createAsteroid } from './Asteroid'
import type { AsteroidEntity } from './types'
import { BASE_ASTEROIDS_PER_WAVE, MAX_ASTEROIDS_PER_WAVE, SAFE_SPAWN_DISTANCE } from './constants'

export function asteroidCountForWave(wave: number): number {
  return Math.min(BASE_ASTEROIDS_PER_WAVE + (wave - 1), MAX_ASTEROIDS_PER_WAVE)
}

function randomFarPosition(worldWidth: number, worldHeight: number, rng: Rng, shipPos: Vec2): Vec2 {
  const minDistSquared = SAFE_SPAWN_DISTANCE * SAFE_SPAWN_DISTANCE
  for (let attempt = 0; attempt < 20; attempt++) {
    const pos: Vec2 = { x: randRange(rng, 0, worldWidth), y: randRange(rng, 0, worldHeight) }
    if (distanceSquared(pos, shipPos) >= minDistSquared) return pos
  }
  // Fallback guaranteed to be far from the ship (opposite corner of the toroidal world).
  return { x: (shipPos.x + worldWidth / 2) % worldWidth, y: (shipPos.y + worldHeight / 2) % worldHeight }
}

/** Spawns the next wave: more large asteroids each wave (capped), none too close to the ship. */
export function spawnWave(
  wave: number,
  worldWidth: number,
  worldHeight: number,
  rng: Rng,
  idGen: () => number,
  shipPos: Vec2
): AsteroidEntity[] {
  const count = asteroidCountForWave(wave)
  const asteroids: AsteroidEntity[] = []
  for (let i = 0; i < count; i++) {
    const pos = randomFarPosition(worldWidth, worldHeight, rng, shipPos)
    asteroids.push(createAsteroid('large', pos, rng, idGen()))
  }
  return asteroids
}
