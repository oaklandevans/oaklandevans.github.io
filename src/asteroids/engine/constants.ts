// All tunable numbers live here so behavior can be reasoned about (and tested against) in one place.
// Time constants are in milliseconds, matching the `dt` unit AsteroidsEngine.update() expects.

export const WORLD_WIDTH = 800
export const WORLD_HEIGHT = 600

// --- Ship ---
export const SHIP_RADIUS = 12
export const SHIP_TURN_RATE = (Math.PI * 1.8) / 1000 // rad/ms — ~324 deg/s, brisk arcade turning
export const SHIP_THRUST_ACCEL = 0.18 / 1000 // px/ms^2 — no speed cap: pure frictionless inertia, as in the original
export const STARTING_LIVES = 3
export const RESPAWN_INVULNERABILITY_MS = 2000
export const HYPERSPACE_DESTRUCTION_CHANCE = 0.1

// --- Bullets ---
export const BULLET_SPEED = 0.5 // px/ms
// Comfortably longer than MAX_PLAYER_BULLETS * PLAYER_FIRE_COOLDOWN_MS so a player who fires as fast as the
// cooldown allows can actually reach the concurrent-bullet cap before their earliest shot expires.
export const BULLET_LIFETIME_MS = 1200
export const MAX_PLAYER_BULLETS = 4
export const PLAYER_FIRE_COOLDOWN_MS = 250
export const SAUCER_BULLET_SPEED = 0.35

// --- Asteroids ---
export const ASTEROID_RADII: Record<'large' | 'medium' | 'small', number> = {
  large: 40,
  medium: 22,
  small: 11
}
export const ASTEROID_SPEED_RANGE: Record<'large' | 'medium' | 'small', [number, number]> = {
  large: [0.02, 0.06],
  medium: [0.05, 0.11],
  small: [0.09, 0.18]
}
export const ASTEROID_SCORE: Record<'large' | 'medium' | 'small', number> = {
  large: 20,
  medium: 50,
  small: 100
}
export const ASTEROID_SPLIT_CHILDREN = 2
export const ASTEROID_SHAPE_POINTS = 10
export const ASTEROID_JAGGEDNESS = 0.35 // fraction of radius each vertex may vary by

// --- Waves ---
export const BASE_ASTEROIDS_PER_WAVE = 4
export const MAX_ASTEROIDS_PER_WAVE = 11
export const SAFE_SPAWN_DISTANCE = 150 // asteroids never spawn closer than this to the ship

// --- Saucers ---
export const SAUCER_SCORE: Record<'large' | 'small', number> = {
  large: 200,
  small: 1000
}
export const SAUCER_RADIUS: Record<'large' | 'small', number> = {
  large: 24,
  small: 13
}
export const SAUCER_SPEED = 0.09
export const SAUCER_FIRE_COOLDOWN_MS = 1500
export const SAUCER_DIRECTION_CHANGE_INTERVAL_MS = 1200
export const SMALL_SAUCER_INACCURACY_RAD = Math.PI / 12 // ±15 degrees
export const SAUCER_SPAWN_INTERVAL_MS = 12000
export const SAUCER_SPAWN_INTERVAL_MIN_MS = 5000
export const SAUCER_SPAWN_WAVE_SPEEDUP_MS = 500 // spawn interval shrinks by this much per wave, floored at the min

// --- Scoring ---
export const EXTRA_LIFE_THRESHOLD = 10000
