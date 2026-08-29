import { describe, it, expect } from 'vitest'
import { asteroidCountForWave, spawnWave } from './wave'
import { mulberry32 } from './rng'
import { BASE_ASTEROIDS_PER_WAVE, MAX_ASTEROIDS_PER_WAVE, SAFE_SPAWN_DISTANCE, WORLD_WIDTH, WORLD_HEIGHT } from './constants'

function idGen(): () => number {
  let next = 1
  return () => next++
}

describe('asteroidCountForWave', () => {
  it('starts at the base count for wave 1', () => {
    expect(asteroidCountForWave(1)).toBe(BASE_ASTEROIDS_PER_WAVE)
  })

  it('increases monotonically with the wave number', () => {
    expect(asteroidCountForWave(2)).toBeGreaterThan(asteroidCountForWave(1))
    expect(asteroidCountForWave(3)).toBeGreaterThan(asteroidCountForWave(2))
  })

  it('caps out at the configured maximum', () => {
    expect(asteroidCountForWave(50)).toBe(MAX_ASTEROIDS_PER_WAVE)
  })
})

describe('spawnWave', () => {
  it('spawns exactly asteroidCountForWave(wave) asteroids', () => {
    const shipPos = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }
    const asteroids = spawnWave(1, WORLD_WIDTH, WORLD_HEIGHT, mulberry32(1), idGen(), shipPos)
    expect(asteroids).toHaveLength(asteroidCountForWave(1))
  })

  it('spawns only large asteroids', () => {
    const shipPos = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }
    const asteroids = spawnWave(1, WORLD_WIDTH, WORLD_HEIGHT, mulberry32(1), idGen(), shipPos)
    expect(asteroids.every((a) => a.size === 'large')).toBe(true)
  })

  it('never spawns an asteroid closer than the safe distance to the ship', () => {
    const shipPos = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }
    // try several seeds to exercise the retry logic under different rng streams
    for (const seed of [1, 2, 3, 4, 5]) {
      const asteroids = spawnWave(3, WORLD_WIDTH, WORLD_HEIGHT, mulberry32(seed), idGen(), shipPos)
      for (const a of asteroids) {
        const dist = Math.hypot(a.pos.x - shipPos.x, a.pos.y - shipPos.y)
        expect(dist).toBeGreaterThanOrEqual(SAFE_SPAWN_DISTANCE - 1e-6)
      }
    }
  })

  it('assigns unique, increasing ids from the generator', () => {
    const shipPos = { x: 0, y: 0 }
    const asteroids = spawnWave(1, WORLD_WIDTH, WORLD_HEIGHT, mulberry32(1), idGen(), shipPos)
    const ids = asteroids.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
