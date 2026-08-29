import { describe, it, expect } from 'vitest'
import { createShip, rotateShip, applyThrust, integrateShip, hyperspace } from './Ship'
import { SHIP_TURN_RATE, SHIP_THRUST_ACCEL, WORLD_WIDTH, WORLD_HEIGHT } from './constants'

describe('createShip', () => {
  it('starts alive, at the given center, with zero velocity and no invulnerability', () => {
    const ship = createShip({ x: 400, y: 300 })
    expect(ship.pos).toEqual({ x: 400, y: 300 })
    expect(ship.vel).toEqual({ x: 0, y: 0 })
    expect(ship.alive).toBe(true)
    expect(ship.invulnerableMs).toBe(0)
  })
})

describe('rotateShip', () => {
  it('increases heading by turn-rate * dt when turning right', () => {
    const ship = { ...createShip({ x: 0, y: 0 }), heading: 0 }
    const rotated = rotateShip(ship, 1, 100)
    expect(rotated.heading).toBeCloseTo(SHIP_TURN_RATE * 100)
  })

  it('decreases heading by turn-rate * dt when turning left', () => {
    const ship = { ...createShip({ x: 0, y: 0 }), heading: 0 }
    const rotated = rotateShip(ship, -1, 100)
    expect(rotated.heading).toBeCloseTo(Math.PI * 2 - SHIP_TURN_RATE * 100)
  })

  it('leaves heading unchanged when direction is 0', () => {
    const ship = createShip({ x: 0, y: 0 })
    expect(rotateShip(ship, 0, 100).heading).toBe(ship.heading)
  })

  it('normalizes heading into [0, 2*PI) after wrapping past a full turn', () => {
    const ship = { ...createShip({ x: 0, y: 0 }), heading: 0 }
    const rotated = rotateShip(ship, -1, 10000) // a large negative rotation
    expect(rotated.heading).toBeGreaterThanOrEqual(0)
    expect(rotated.heading).toBeLessThan(Math.PI * 2)
  })
})

describe('applyThrust', () => {
  it('adds acceleration along the current heading when thrusting', () => {
    const ship = { ...createShip({ x: 0, y: 0 }), heading: 0 }
    const thrusted = applyThrust(ship, true, 100)
    expect(thrusted.vel.x).toBeCloseTo(SHIP_THRUST_ACCEL * 100)
    expect(thrusted.vel.y).toBeCloseTo(0)
    expect(thrusted.thrusting).toBe(true)
  })

  it('leaves velocity unchanged when not thrusting (no drag/friction)', () => {
    const ship = { ...createShip({ x: 0, y: 0 }), vel: { x: 5, y: -3 } }
    const result = applyThrust(ship, false, 100)
    expect(result.vel).toEqual({ x: 5, y: -3 })
    expect(result.thrusting).toBe(false)
  })

  it('preserves velocity across many no-thrust ticks — frictionless, unlike most arcade clones', () => {
    let ship = { ...createShip({ x: 0, y: 0 }), vel: { x: 5, y: -3 } }
    for (let i = 0; i < 50; i++) {
      ship = integrateShip(applyThrust(ship, false, 16), 16, WORLD_WIDTH, WORLD_HEIGHT)
    }
    expect(ship.vel).toEqual({ x: 5, y: -3 })
  })
})

describe('integrateShip', () => {
  it('advances position by velocity * dt', () => {
    const ship = { ...createShip({ x: 100, y: 100 }), vel: { x: 1, y: 2 } }
    const result = integrateShip(ship, 10, WORLD_WIDTH, WORLD_HEIGHT)
    expect(result.pos).toEqual({ x: 110, y: 120 })
  })

  it('wraps around the right edge', () => {
    const ship = { ...createShip({ x: WORLD_WIDTH - 5, y: 100 }), vel: { x: 1, y: 0 } }
    const result = integrateShip(ship, 10, WORLD_WIDTH, WORLD_HEIGHT)
    expect(result.pos.x).toBeCloseTo(5)
  })

  it('wraps around the left edge', () => {
    const ship = { ...createShip({ x: 5, y: 100 }), vel: { x: -1, y: 0 } }
    const result = integrateShip(ship, 10, WORLD_WIDTH, WORLD_HEIGHT)
    expect(result.pos.x).toBeCloseTo(WORLD_WIDTH - 5)
  })

  it('wraps around the top and bottom edges', () => {
    const bottom = integrateShip(
      { ...createShip({ x: 100, y: WORLD_HEIGHT - 5 }), vel: { x: 0, y: 1 } },
      10,
      WORLD_WIDTH,
      WORLD_HEIGHT
    )
    expect(bottom.pos.y).toBeCloseTo(5)

    const top = integrateShip(
      { ...createShip({ x: 100, y: 5 }), vel: { x: 0, y: -1 } },
      10,
      WORLD_WIDTH,
      WORLD_HEIGHT
    )
    expect(top.pos.y).toBeCloseTo(WORLD_HEIGHT - 5)
  })

  it('counts down invulnerability and floors at zero', () => {
    const ship = { ...createShip({ x: 0, y: 0 }), invulnerableMs: 50 }
    expect(integrateShip(ship, 30, WORLD_WIDTH, WORLD_HEIGHT).invulnerableMs).toBe(20)
    expect(integrateShip(ship, 1000, WORLD_WIDTH, WORLD_HEIGHT).invulnerableMs).toBe(0)
  })
})

describe('hyperspace', () => {
  it('relocates the ship to a position derived from the rng, within world bounds', () => {
    const ship = createShip({ x: 0, y: 0 })
    const rng = () => 0.5
    const { ship: result } = hyperspace(ship, rng, WORLD_WIDTH, WORLD_HEIGHT)
    expect(result.pos).toEqual({ x: WORLD_WIDTH / 2, y: WORLD_HEIGHT / 2 })
  })

  it('zeroes velocity after the jump', () => {
    const ship = { ...createShip({ x: 0, y: 0 }), vel: { x: 9, y: 9 } }
    const { ship: result } = hyperspace(ship, () => 0.5, WORLD_WIDTH, WORLD_HEIGHT)
    expect(result.vel).toEqual({ x: 0, y: 0 })
  })

  it('destroys the ship when rng rolls below the destruction chance', () => {
    const ship = createShip({ x: 0, y: 0 })
    const { ship: result, destroyed } = hyperspace(ship, () => 0, WORLD_WIDTH, WORLD_HEIGHT)
    expect(destroyed).toBe(true)
    expect(result.alive).toBe(false)
  })

  it('survives when rng rolls at or above the destruction chance', () => {
    const ship = createShip({ x: 0, y: 0 })
    const { ship: result, destroyed } = hyperspace(ship, () => 0.99, WORLD_WIDTH, WORLD_HEIGHT)
    expect(destroyed).toBe(false)
    expect(result.alive).toBe(true)
  })
})
