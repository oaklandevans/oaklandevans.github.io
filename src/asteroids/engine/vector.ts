export interface Vec2 {
  x: number
  y: number
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function scale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s }
}

export function fromAngle(angleRad: number, magnitude: number = 1): Vec2 {
  return { x: Math.cos(angleRad) * magnitude, y: Math.sin(angleRad) * magnitude }
}

export function length(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

export function distanceSquared(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

/** Wraps a position into the [0, width) x [0, height) toroidal world, matching Asteroids' screen wraparound. */
export function wrap(v: Vec2, width: number, height: number): Vec2 {
  let x = v.x % width
  let y = v.y % height
  if (x < 0) x += width
  if (y < 0) y += height
  return { x, y }
}
