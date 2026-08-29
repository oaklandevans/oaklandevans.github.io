import { add, scale, fromAngle, wrap, type Vec2 } from './vector'
import { randRange, type Rng } from './rng'
import type { AsteroidEntity, AsteroidSize } from './types'
import { ASTEROID_RADII, ASTEROID_SPEED_RANGE, ASTEROID_SCORE, ASTEROID_SHAPE_POINTS, ASTEROID_JAGGEDNESS } from './constants'

const CHILD_SIZE: Record<AsteroidSize, AsteroidSize | null> = {
  large: 'medium',
  medium: 'small',
  small: null
}

function randomShapeOffsets(rng: Rng): number[] {
  const points: number[] = []
  for (let i = 0; i < ASTEROID_SHAPE_POINTS; i++) {
    points.push(1 - ASTEROID_JAGGEDNESS + randRange(rng, 0, ASTEROID_JAGGEDNESS * 2))
  }
  return points
}

export function createAsteroid(size: AsteroidSize, pos: Vec2, rng: Rng, id: number): AsteroidEntity {
  const [minSpeed, maxSpeed] = ASTEROID_SPEED_RANGE[size]
  const heading = randRange(rng, 0, Math.PI * 2)
  const speed = randRange(rng, minSpeed, maxSpeed)
  return {
    id,
    size,
    pos: { ...pos },
    vel: fromAngle(heading, speed),
    radius: ASTEROID_RADII[size],
    rotation: randRange(rng, 0, Math.PI * 2),
    rotationSpeed: randRange(rng, -0.001, 0.001),
    shapeOffsets: randomShapeOffsets(rng)
  }
}

export function scoreFor(size: AsteroidSize): number {
  return ASTEROID_SCORE[size]
}

/** Splits a large/medium asteroid into two of the next size down; a small asteroid splits into nothing. */
export function splitAsteroid(a: AsteroidEntity, rng: Rng, idGen: () => number): AsteroidEntity[] {
  const childSize = CHILD_SIZE[a.size]
  if (!childSize) return []

  const children: AsteroidEntity[] = []
  for (let i = 0; i < 2; i++) {
    // Offset each child away from the parent's center so they don't instantly re-overlap.
    const offsetHeading = randRange(rng, 0, Math.PI * 2)
    const offsetPos = add(a.pos, fromAngle(offsetHeading, ASTEROID_RADII[childSize]))
    children.push(createAsteroid(childSize, offsetPos, rng, idGen()))
  }
  return children
}

export function integrateAsteroid(a: AsteroidEntity, dt: number, worldWidth: number, worldHeight: number): AsteroidEntity {
  return {
    ...a,
    pos: wrap(add(a.pos, scale(a.vel, dt)), worldWidth, worldHeight),
    rotation: a.rotation + a.rotationSpeed * dt
  }
}
