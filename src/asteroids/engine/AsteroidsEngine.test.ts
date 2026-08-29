import { describe, it, expect } from 'vitest'
import { AsteroidsEngine } from './AsteroidsEngine'
import { mulberry32, type Rng } from './rng'
import { neutralInput } from './types'
import type { AsteroidEntity, BulletEntity, ShipState } from './types'
import { asteroidCountForWave } from './wave'
import { STARTING_LIVES, MAX_PLAYER_BULLETS, WORLD_WIDTH, WORLD_HEIGHT } from './constants'

function freshShip(overrides: Partial<ShipState> = {}): ShipState {
  return {
    pos: { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 },
    vel: { x: 0, y: 0 },
    heading: 0,
    radius: 12,
    alive: true,
    invulnerableMs: 0,
    thrusting: false,
    ...overrides
  }
}

function largeAsteroidAt(pos: { x: number; y: number }, id: number): AsteroidEntity {
  return { id, size: 'large', pos: { ...pos }, vel: { x: 0, y: 0 }, radius: 40, rotation: 0, rotationSpeed: 0, shapeOffsets: [] }
}

function smallAsteroidAt(pos: { x: number; y: number }, id: number): AsteroidEntity {
  return { id, size: 'small', pos: { ...pos }, vel: { x: 0, y: 0 }, radius: 11, rotation: 0, rotationSpeed: 0, shapeOffsets: [] }
}

function stationaryBulletAt(pos: { x: number; y: number }, id: number): BulletEntity {
  return { id, owner: 'ship', pos: { ...pos }, vel: { x: 0, y: 0 }, radius: 2, remainingLifeMs: 1000 }
}

/**
 * A pseudo-random stream that never rolls below 0.15 — safely above the 10% hyperspace destruction
 * chance no matter how many prior rng() calls (e.g. from wave spawning) shifted the stream beforehand.
 * Positions still vary draw-to-draw, unlike a constant stub, so distinct jumps land in distinct places.
 */
function neverDestructiveRng(seed: number): Rng {
  const base = mulberry32(seed)
  return () => 0.15 + base() * 0.8
}

describe('AsteroidsEngine.start', () => {
  it('enters the playing phase with a ship and a wave-1 asteroid field', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    const state = engine.getState()
    expect(state.phase).toBe('playing')
    expect(state.ship).not.toBeNull()
    expect(state.wave).toBe(1)
    expect(state.asteroids).toHaveLength(asteroidCountForWave(1))
    expect(state.lives).toBe(STARTING_LIVES)
    expect(state.score).toBe(0)
  })
})

describe('AsteroidsEngine.update — before start / after reset', () => {
  it('is a no-op while not playing', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.update(1000, { ...neutralInput(), thrust: true })
    const state = engine.getState()
    expect(state.phase).toBe('ready')
    expect(state.ship).toBeNull()
  })
})

describe('AsteroidsEngine — player fire cap', () => {
  it('allows firing while below the concurrent-bullet cap', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    engine.hydrate({ asteroids: [], bullets: [] })
    engine.update(10, { ...neutralInput(), fire: true })
    expect(engine.getState().bullets).toHaveLength(1)
  })

  it('does not add a bullet beyond the concurrent-bullet cap', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    const atCap = Array.from({ length: MAX_PLAYER_BULLETS }, (_, i) => stationaryBulletAt({ x: 700, y: 500 }, 100 + i))
    engine.hydrate({ asteroids: [], bullets: atCap })
    engine.update(10, { ...neutralInput(), fire: true })
    expect(engine.getState().bullets).toHaveLength(MAX_PLAYER_BULLETS)
  })
})

describe('AsteroidsEngine — bullet/asteroid collisions', () => {
  it('splits a large asteroid into two mediums and awards its score', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    const spot = { x: 200, y: 200 }
    engine.hydrate({ score: 0, bullets: [stationaryBulletAt(spot, 1)], asteroids: [largeAsteroidAt(spot, 2)] })
    engine.update(10, neutralInput())
    const state = engine.getState()
    expect(state.score).toBe(20)
    expect(state.bullets.find((b) => b.id === 1)).toBeUndefined()
    expect(state.asteroids.filter((a) => a.size === 'medium')).toHaveLength(2)
  })

  it('destroys a small asteroid outright (no children) and awards its score', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    const spot = { x: 200, y: 200 }
    engine.hydrate({ score: 0, bullets: [stationaryBulletAt(spot, 1)], asteroids: [smallAsteroidAt(spot, 2)] })
    engine.update(10, neutralInput())
    const state = engine.getState()
    expect(state.score).toBe(100)
    // The destroyed asteroid itself is gone (an empty field auto-repopulates the next wave, covered separately below).
    expect(state.asteroids.some((a) => a.id === 2)).toBe(false)
  })
})

describe('AsteroidsEngine — wave progression', () => {
  it('advances to the next wave and repopulates once the field is cleared', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    engine.hydrate({ asteroids: [] })
    engine.update(10, neutralInput())
    const state = engine.getState()
    expect(state.wave).toBe(2)
    expect(state.asteroids).toHaveLength(asteroidCountForWave(2))
    expect(state.asteroids.length).toBeGreaterThan(asteroidCountForWave(1))
  })
})

describe('AsteroidsEngine — ship/asteroid collisions and invulnerability', () => {
  it('loses a life and respawns invulnerable on collision, without dying again the very next tick', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    const center = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }
    engine.hydrate({ lives: STARTING_LIVES, ship: freshShip({ pos: center }), asteroids: [largeAsteroidAt(center, 5)] })

    engine.update(10, neutralInput())
    let state = engine.getState()
    expect(state.lives).toBe(STARTING_LIVES - 1)
    expect(state.ship!.invulnerableMs).toBeGreaterThan(0)
    expect(state.ship!.pos).toEqual(center) // respawns at world center, still overlapping the same asteroid

    const invulnerabilityRemaining = state.ship!.invulnerableMs
    engine.update(10, neutralInput())
    state = engine.getState()
    expect(state.lives).toBe(STARTING_LIVES - 1) // unchanged — invulnerability suppressed the re-collision
    expect(state.ship!.invulnerableMs).toBeLessThan(invulnerabilityRemaining)
  })

  it('ends the game once the last life is lost', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    const center = { x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 }
    engine.hydrate({ lives: 1, ship: freshShip({ pos: center }), asteroids: [largeAsteroidAt(center, 5)] })
    engine.update(10, neutralInput())
    const state = engine.getState()
    expect(state.lives).toBe(0)
    expect(state.phase).toBe('gameOver')
  })
})

describe('AsteroidsEngine — extra life bonus', () => {
  it('grants exactly one extra life the first time score crosses a 10,000 multiple', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    const spot = { x: 300, y: 300 }
    engine.hydrate({ score: 9990, lives: STARTING_LIVES, bullets: [stationaryBulletAt(spot, 1)], asteroids: [smallAsteroidAt(spot, 2)] })
    engine.update(10, neutralInput())
    const state = engine.getState()
    expect(state.score).toBe(10090)
    expect(state.lives).toBe(STARTING_LIVES + 1)
  })

  it('does not re-grant a life for later kills that stay above an already-crossed threshold', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    const spotA = { x: 300, y: 300 }
    engine.hydrate({ score: 9990, lives: STARTING_LIVES, bullets: [stationaryBulletAt(spotA, 1)], asteroids: [smallAsteroidAt(spotA, 2)] })
    engine.update(10, neutralInput())
    expect(engine.getState().lives).toBe(STARTING_LIVES + 1)

    const spotB = { x: 350, y: 350 }
    engine.hydrate({ bullets: [stationaryBulletAt(spotB, 3)], asteroids: [smallAsteroidAt(spotB, 4)] })
    engine.update(10, neutralInput())
    expect(engine.getState().lives).toBe(STARTING_LIVES + 1) // still just the one bonus life
  })
})

describe('AsteroidsEngine — dt is externally driven, not hardcoded', () => {
  it('produces the same constant-velocity displacement over many small steps as over one big step', () => {
    const buildEngine = () => {
      const engine = new AsteroidsEngine({ rng: mulberry32(1) })
      engine.start()
      engine.hydrate({
        asteroids: [],
        saucers: [],
        ship: freshShip({ pos: { x: 100, y: 100 }, vel: { x: 0.05, y: -0.02 } })
      })
      return engine
    }

    const engineSmall = buildEngine()
    for (let i = 0; i < 10; i++) {
      engineSmall.hydrate({ asteroids: [], saucers: [] })
      engineSmall.update(16, neutralInput())
    }

    const engineBig = buildEngine()
    engineBig.update(160, neutralInput())

    expect(engineSmall.getState().ship!.pos.x).toBeCloseTo(engineBig.getState().ship!.pos.x, 5)
    expect(engineSmall.getState().ship!.pos.y).toBeCloseTo(engineBig.getState().ship!.pos.y, 5)
  })
})

describe('AsteroidsEngine — hyperspace edge-triggering', () => {
  it('jumps once per key-press, not repeatedly while the key is held', () => {
    const engine = new AsteroidsEngine({ rng: neverDestructiveRng(1) })
    engine.start()
    engine.hydrate({ asteroids: [], saucers: [], ship: freshShip() })
    const held = { ...neutralInput(), hyperspace: true }

    engine.update(10, held)
    const afterFirstPress = engine.getState().ship!.pos

    engine.hydrate({ asteroids: [], saucers: [] })
    engine.update(10, held) // still held -> must not jump again
    expect(engine.getState().ship!.pos).toEqual(afterFirstPress)

    engine.hydrate({ asteroids: [], saucers: [] })
    engine.update(10, neutralInput()) // release
    engine.hydrate({ asteroids: [], saucers: [] })
    engine.update(10, held) // press again -> a fresh jump
    expect(engine.getState().ship!.pos).not.toEqual(afterFirstPress)
  })

  it('destroys the ship on an unlucky reentry roll and eventually ends the game', () => {
    const engine = new AsteroidsEngine({ rng: () => 0 }) // always below the destruction chance, however often it's called
    engine.start()
    engine.hydrate({ asteroids: [], saucers: [], lives: 1, ship: freshShip() })
    engine.update(10, { ...neutralInput(), hyperspace: true })
    const state = engine.getState()
    expect(state.lives).toBe(0)
    expect(state.phase).toBe('gameOver')
  })
})

describe('AsteroidsEngine.reset', () => {
  it('returns to a clean ready state from anywhere, including after game over', () => {
    const engine = new AsteroidsEngine({ rng: mulberry32(1) })
    engine.start()
    engine.hydrate({ phase: 'gameOver', lives: 0, score: 12345 })
    engine.reset()
    const state = engine.getState()
    expect(state.phase).toBe('ready')
    expect(state.ship).toBeNull()
    expect(state.lives).toBe(STARTING_LIVES)
    expect(state.score).toBe(0)
    expect(state.asteroids).toEqual([])
    expect(state.wave).toBe(0)
  })
})

