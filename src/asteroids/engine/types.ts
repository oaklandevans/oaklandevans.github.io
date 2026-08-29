import type { Vec2 } from './vector'

export type AsteroidSize = 'large' | 'medium' | 'small'
export type SaucerSize = 'large' | 'small'
export type BulletOwner = 'ship' | 'saucer'
export type GamePhase = 'ready' | 'playing' | 'gameOver'

/** Common physical body shared by every moving entity: position, velocity, and a collision radius. */
export interface Body {
  pos: Vec2
  vel: Vec2
  radius: number
}

export interface ShipState extends Body {
  heading: number // radians
  alive: boolean
  /** Remaining invulnerability time in ms (0 = vulnerable). Set on spawn/respawn. */
  invulnerableMs: number
  /** Whether thrust was applied on the most recent update — for the renderer's flame, not gameplay. */
  thrusting: boolean
}

export interface BulletEntity extends Body {
  id: number
  owner: BulletOwner
  remainingLifeMs: number
}

export interface AsteroidEntity extends Body {
  id: number
  size: AsteroidSize
  rotation: number
  rotationSpeed: number
  /** Per-vertex radius jitter (fractions of `radius`), generated once at creation for a stable jagged silhouette. */
  shapeOffsets: number[]
}

export interface SaucerEntity extends Body {
  id: number
  size: SaucerSize
  /** Remaining ms until this saucer may fire again. */
  fireCooldownMs: number
  /** Remaining ms until this saucer randomly changes its vertical drift. */
  directionChangeMs: number
}

export interface InputState {
  left: boolean
  right: boolean
  thrust: boolean
  fire: boolean
  hyperspace: boolean
}

export interface EngineState {
  phase: GamePhase
  ship: ShipState | null
  bullets: BulletEntity[]
  asteroids: AsteroidEntity[]
  saucers: SaucerEntity[]
  saucerBullets: BulletEntity[]
  score: number
  lives: number
  wave: number
}

export function neutralInput(): InputState {
  return { left: false, right: false, thrust: false, fire: false, hyperspace: false }
}
