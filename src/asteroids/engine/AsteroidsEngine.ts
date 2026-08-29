import type { EngineState, InputState, GamePhase, ShipState, BulletEntity, AsteroidEntity, SaucerEntity } from './types'
import { neutralInput } from './types'
import { createShip, rotateShip, applyThrust, integrateShip, hyperspace } from './Ship'
import { spawnBullet, integrateBullet } from './Bullet'
import { splitAsteroid, scoreFor, integrateAsteroid } from './Asteroid'
import { createSaucer, integrateSaucer, tickSaucerFire, aimSaucerBullet, scoreForSaucer } from './Saucer'
import { spawnWave } from './wave'
import {
  findBulletAsteroidHits,
  findBulletSaucerHits,
  findShipAsteroidHit,
  findShipSaucerHit,
  findShipBulletHit,
  findSaucerAsteroidHits
} from './collisions'
import { defaultRng, randChance, type Rng } from './rng'
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
  STARTING_LIVES,
  RESPAWN_INVULNERABILITY_MS,
  MAX_PLAYER_BULLETS,
  PLAYER_FIRE_COOLDOWN_MS,
  EXTRA_LIFE_THRESHOLD,
  SAUCER_SPAWN_INTERVAL_MS,
  SAUCER_SPAWN_INTERVAL_MIN_MS,
  SAUCER_SPAWN_WAVE_SPEEDUP_MS
} from './constants'

export interface EngineConfig {
  worldWidth?: number
  worldHeight?: number
  rng?: Rng
}

/**
 * The full Asteroids game-rules engine: deterministic, DOM-free, and framework-agnostic.
 * Callers drive it by supplying `dt` (ms) and the current `InputState` to `update()` every tick —
 * the engine never reads a clock or `Math.random()` directly, which is what makes it unit-testable.
 */
export class AsteroidsEngine {
  private readonly worldWidth: number
  private readonly worldHeight: number
  private readonly rng: Rng

  private phase: GamePhase = 'ready'
  private ship: ShipState | null = null
  private bullets: BulletEntity[] = []
  private asteroids: AsteroidEntity[] = []
  private saucers: SaucerEntity[] = []
  private saucerBullets: BulletEntity[] = []
  private score = 0
  private lives = STARTING_LIVES
  private wave = 0

  private nextId = 1
  private fireCooldownMs = 0
  private hyperspaceKeyWasDown = false
  private saucerSpawnMs = SAUCER_SPAWN_INTERVAL_MS
  private lastExtraLifeThreshold = 0

  constructor(config: EngineConfig = {}) {
    this.worldWidth = config.worldWidth ?? WORLD_WIDTH
    this.worldHeight = config.worldHeight ?? WORLD_HEIGHT
    this.rng = config.rng ?? defaultRng
  }

  private genId(): number {
    return this.nextId++
  }

  getState(): EngineState {
    return {
      phase: this.phase,
      ship: this.ship,
      bullets: this.bullets,
      asteroids: this.asteroids,
      saucers: this.saucers,
      saucerBullets: this.saucerBullets,
      score: this.score,
      lives: this.lives,
      wave: this.wave
    }
  }

  /** Test/debug hook: force internal state directly, bypassing normal game-rule transitions. */
  hydrate(partial: Partial<EngineState>): void {
    if (partial.phase !== undefined) this.phase = partial.phase
    if (partial.ship !== undefined) this.ship = partial.ship
    if (partial.bullets !== undefined) this.bullets = partial.bullets
    if (partial.asteroids !== undefined) this.asteroids = partial.asteroids
    if (partial.saucers !== undefined) this.saucers = partial.saucers
    if (partial.saucerBullets !== undefined) this.saucerBullets = partial.saucerBullets
    if (partial.score !== undefined) this.score = partial.score
    if (partial.lives !== undefined) this.lives = partial.lives
    if (partial.wave !== undefined) this.wave = partial.wave
  }

  reset(): void {
    this.phase = 'ready'
    this.ship = null
    this.bullets = []
    this.asteroids = []
    this.saucers = []
    this.saucerBullets = []
    this.score = 0
    this.lives = STARTING_LIVES
    this.wave = 0
    this.fireCooldownMs = 0
    this.hyperspaceKeyWasDown = false
    this.saucerSpawnMs = SAUCER_SPAWN_INTERVAL_MS
    this.lastExtraLifeThreshold = 0
  }

  start(): void {
    this.reset()
    this.phase = 'playing'
    this.ship = createShip({ x: this.worldWidth / 2, y: this.worldHeight / 2 })
    this.advanceWave()
  }

  private advanceWave(): void {
    if (!this.ship) return
    this.wave += 1
    this.asteroids = [
      ...this.asteroids,
      ...spawnWave(this.wave, this.worldWidth, this.worldHeight, this.rng, () => this.genId(), this.ship.pos)
    ]
  }

  private respawnShip(): void {
    this.ship = {
      ...createShip({ x: this.worldWidth / 2, y: this.worldHeight / 2 }),
      invulnerableMs: RESPAWN_INVULNERABILITY_MS
    }
  }

  private killShip(): void {
    this.lives -= 1
    if (this.lives <= 0) {
      this.phase = 'gameOver'
      if (this.ship) this.ship = { ...this.ship, alive: false }
    } else {
      this.respawnShip()
    }
  }

  private addScore(points: number): void {
    this.score += points
    const threshold = Math.floor(this.score / EXTRA_LIFE_THRESHOLD)
    if (threshold > this.lastExtraLifeThreshold) {
      this.lives += threshold - this.lastExtraLifeThreshold
      this.lastExtraLifeThreshold = threshold
    }
  }

  update(dt: number, input: InputState = neutralInput()): void {
    if (this.phase !== 'playing' || !this.ship) return

    // --- ship control ---
    let ship = this.ship
    const turn = (input.left ? -1 : 0) + (input.right ? 1 : 0) // already in {-1, 0, 1}
    ship = rotateShip(ship, turn as -1 | 0 | 1, dt)
    ship = applyThrust(ship, input.thrust, dt)
    ship = integrateShip(ship, dt, this.worldWidth, this.worldHeight)

    // fire: cooldown-gated (holding fire keeps shooting, up to the concurrent-bullet cap)
    this.fireCooldownMs = Math.max(0, this.fireCooldownMs - dt)
    if (input.fire && this.fireCooldownMs === 0 && this.bullets.length < MAX_PLAYER_BULLETS) {
      this.bullets.push(spawnBullet(ship, ship.heading, 'ship', this.genId()))
      this.fireCooldownMs = PLAYER_FIRE_COOLDOWN_MS
    }

    // hyperspace: edge-triggered — one jump per press, not per tick held
    if (input.hyperspace && !this.hyperspaceKeyWasDown) {
      ship = hyperspace(ship, this.rng, this.worldWidth, this.worldHeight).ship
    }
    this.hyperspaceKeyWasDown = input.hyperspace

    this.ship = ship

    // --- integrate the rest of the field ---
    this.bullets = this.bullets
      .map((b) => integrateBullet(b, dt, this.worldWidth, this.worldHeight))
      .filter((b): b is BulletEntity => b !== null)
    this.saucerBullets = this.saucerBullets
      .map((b) => integrateBullet(b, dt, this.worldWidth, this.worldHeight))
      .filter((b): b is BulletEntity => b !== null)
    this.asteroids = this.asteroids.map((a) => integrateAsteroid(a, dt, this.worldWidth, this.worldHeight))
    this.saucers = this.saucers.map((s) => integrateSaucer(s, dt, this.worldWidth, this.worldHeight, this.rng))

    // --- saucer spawn (small saucers grow more common on later waves) ---
    this.saucerSpawnMs -= dt
    if (this.saucerSpawnMs <= 0) {
      const size = randChance(this.rng, Math.min(0.2 + this.wave * 0.05, 0.8)) ? 'small' : 'large'
      this.saucers.push(createSaucer(size, this.worldWidth, this.worldHeight, this.rng, this.genId()))
      this.saucerSpawnMs = Math.max(
        SAUCER_SPAWN_INTERVAL_MIN_MS,
        SAUCER_SPAWN_INTERVAL_MS - this.wave * SAUCER_SPAWN_WAVE_SPEEDUP_MS
      )
    }

    // --- saucer firing ---
    const nextSaucers: SaucerEntity[] = []
    for (let s of this.saucers) {
      const tick = tickSaucerFire(s, dt)
      s = tick.saucer
      if (tick.shouldFire) {
        const target = this.ship.alive ? this.ship.pos : null
        const { heading } = aimSaucerBullet(s, target, this.rng)
        this.saucerBullets.push(spawnBullet(s, heading, 'saucer', this.genId()))
      }
      nextSaucers.push(s)
    }
    this.saucers = nextSaucers

    // --- collisions: player bullets vs asteroids (split or destroy + score) ---
    const asteroidHits = findBulletAsteroidHits(this.bullets, this.asteroids)
    if (asteroidHits.length > 0) {
      const hitBulletIds = new Set(asteroidHits.map((h) => h.bulletId))
      const hitAsteroidIds = new Set(asteroidHits.map((h) => h.target.id))
      this.bullets = this.bullets.filter((b) => !hitBulletIds.has(b.id))
      const survivors = this.asteroids.filter((a) => !hitAsteroidIds.has(a.id))
      const spawned: AsteroidEntity[] = []
      for (const hit of asteroidHits) {
        this.addScore(scoreFor(hit.target.size))
        spawned.push(...splitAsteroid(hit.target, this.rng, () => this.genId()))
      }
      this.asteroids = [...survivors, ...spawned]
    }

    // --- collisions: player bullets vs saucers (destroy + score) ---
    const saucerHits = findBulletSaucerHits(this.bullets, this.saucers)
    if (saucerHits.length > 0) {
      const hitBulletIds = new Set(saucerHits.map((h) => h.bulletId))
      const hitSaucerIds = new Set(saucerHits.map((h) => h.target.id))
      this.bullets = this.bullets.filter((b) => !hitBulletIds.has(b.id))
      for (const hit of saucerHits) this.addScore(scoreForSaucer(hit.target.size))
      this.saucers = this.saucers.filter((s) => !hitSaucerIds.has(s.id))
    }

    // --- collisions: saucers vs asteroids (mutual destruction, no score either way) ---
    const saucerAsteroidHits = findSaucerAsteroidHits(this.saucers, this.asteroids)
    if (saucerAsteroidHits.length > 0) {
      const hitSaucerIds = new Set(saucerAsteroidHits.map((h) => h.saucerId))
      const hitAsteroidIds = new Set(saucerAsteroidHits.map((h) => h.asteroidId))
      this.saucers = this.saucers.filter((s) => !hitSaucerIds.has(s.id))
      this.asteroids = this.asteroids.filter((a) => !hitAsteroidIds.has(a.id))
    }

    // --- collisions: ship vs asteroid / saucer / saucer bullet, and hyperspace mishaps ---
    if (this.ship.alive) {
      const hitAsteroid = findShipAsteroidHit(this.ship, this.asteroids)
      const hitSaucer = hitAsteroid ? null : findShipSaucerHit(this.ship, this.saucers)
      const hitBullet = hitAsteroid || hitSaucer ? null : findShipBulletHit(this.ship, this.saucerBullets)
      if (hitAsteroid || hitSaucer || hitBullet) {
        if (hitBullet) this.saucerBullets = this.saucerBullets.filter((b) => b.id !== hitBullet.id)
        this.killShip()
      }
    } else {
      // ship was destroyed this tick by a failed hyperspace jump
      this.killShip()
    }

    // --- wave clear ---
    if (this.phase === 'playing' && this.asteroids.length === 0) {
      this.advanceWave()
    }
  }
}
