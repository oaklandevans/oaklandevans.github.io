import { add, scale, fromAngle, wrap, type Vec2 } from './vector'
import { randRange, randChance, type Rng } from './rng'
import type { ShipState } from './types'
import { SHIP_RADIUS, SHIP_TURN_RATE, SHIP_THRUST_ACCEL, HYPERSPACE_DESTRUCTION_CHANCE } from './constants'

const TWO_PI = Math.PI * 2

function normalizeAngle(angle: number): number {
  const a = angle % TWO_PI
  return a < 0 ? a + TWO_PI : a
}

export function createShip(center: Vec2): ShipState {
  return {
    pos: { ...center },
    vel: { x: 0, y: 0 },
    heading: -Math.PI / 2, // pointing "up" the screen, matching the original's start orientation
    radius: SHIP_RADIUS,
    alive: true,
    invulnerableMs: 0,
    thrusting: false
  }
}

/** direction: -1 = rotate left (counter-clockwise), 1 = rotate right (clockwise), 0 = no turn. */
export function rotateShip(ship: ShipState, direction: -1 | 0 | 1, dt: number): ShipState {
  if (direction === 0) return ship
  return { ...ship, heading: normalizeAngle(ship.heading + direction * SHIP_TURN_RATE * dt) }
}

/** No friction/drag, matching the original's frictionless inertial physics — velocity persists once applied. */
export function applyThrust(ship: ShipState, thrustOn: boolean, dt: number): ShipState {
  if (!thrustOn) {
    return ship.thrusting ? { ...ship, thrusting: false } : ship
  }
  const accel = fromAngle(ship.heading, SHIP_THRUST_ACCEL * dt)
  return { ...ship, vel: add(ship.vel, accel), thrusting: true }
}

export function integrateShip(ship: ShipState, dt: number, worldWidth: number, worldHeight: number): ShipState {
  const pos = wrap(add(ship.pos, scale(ship.vel, dt)), worldWidth, worldHeight)
  const invulnerableMs = Math.max(0, ship.invulnerableMs - dt)
  return { ...ship, pos, invulnerableMs }
}

/** Instantly relocates the ship to a random point in the world; a small chance it doesn't survive reentry. */
export function hyperspace(
  ship: ShipState,
  rng: Rng,
  worldWidth: number,
  worldHeight: number
): { ship: ShipState; destroyed: boolean } {
  const pos: Vec2 = { x: randRange(rng, 0, worldWidth), y: randRange(rng, 0, worldHeight) }
  const destroyed = randChance(rng, HYPERSPACE_DESTRUCTION_CHANCE)
  const relocated: ShipState = { ...ship, pos, vel: { x: 0, y: 0 } }
  return { ship: destroyed ? { ...relocated, alive: false } : relocated, destroyed }
}
