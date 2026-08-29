import { describe, it, expect } from 'vitest'
import { add, scale, fromAngle, length, distanceSquared, wrap } from './vector'

describe('add', () => {
  it('adds component-wise', () => {
    expect(add({ x: 1, y: 2 }, { x: 3, y: -4 })).toEqual({ x: 4, y: -2 })
  })
})

describe('scale', () => {
  it('scales both components by the same factor', () => {
    expect(scale({ x: 2, y: -3 }, 2)).toEqual({ x: 4, y: -6 })
  })

  it('returns the zero vector when scaled by 0', () => {
    expect(scale({ x: 5, y: 5 }, 0)).toEqual({ x: 0, y: 0 })
  })
})

describe('fromAngle', () => {
  it('points along +x at angle 0', () => {
    const v = fromAngle(0, 10)
    expect(v.x).toBeCloseTo(10)
    expect(v.y).toBeCloseTo(0)
  })

  it('points along +y at angle 90deg', () => {
    const v = fromAngle(Math.PI / 2, 10)
    expect(v.x).toBeCloseTo(0)
    expect(v.y).toBeCloseTo(10)
  })

  it('points along -x at angle 180deg', () => {
    const v = fromAngle(Math.PI, 10)
    expect(v.x).toBeCloseTo(-10)
    expect(v.y).toBeCloseTo(0)
  })

  it('points along -y at angle 270deg', () => {
    const v = fromAngle((3 * Math.PI) / 2, 10)
    expect(v.x).toBeCloseTo(0)
    expect(v.y).toBeCloseTo(-10)
  })

  it('defaults to unit magnitude', () => {
    const v = fromAngle(0)
    expect(length(v)).toBeCloseTo(1)
  })
})

describe('length', () => {
  it('computes magnitude via pythagorean theorem', () => {
    expect(length({ x: 3, y: 4 })).toBe(5)
  })

  it('is zero for the zero vector', () => {
    expect(length({ x: 0, y: 0 })).toBe(0)
  })
})

describe('distanceSquared', () => {
  it('computes squared euclidean distance', () => {
    expect(distanceSquared({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(25)
  })

  it('is symmetric', () => {
    const a = { x: 1, y: 5 }
    const b = { x: -2, y: 9 }
    expect(distanceSquared(a, b)).toBe(distanceSquared(b, a))
  })

  it('is zero for identical points', () => {
    const p = { x: 7, y: -3 }
    expect(distanceSquared(p, p)).toBe(0)
  })
})

describe('wrap', () => {
  const W = 100
  const H = 200

  it('leaves in-bounds points unchanged', () => {
    expect(wrap({ x: 50, y: 50 }, W, H)).toEqual({ x: 50, y: 50 })
  })

  it('wraps past the right edge back to the left', () => {
    expect(wrap({ x: 110, y: 50 }, W, H)).toEqual({ x: 10, y: 50 })
  })

  it('wraps past the bottom edge back to the top', () => {
    expect(wrap({ x: 50, y: 210 }, W, H)).toEqual({ x: 50, y: 10 })
  })

  it('wraps a negative x back from the right edge', () => {
    expect(wrap({ x: -10, y: 50 }, W, H)).toEqual({ x: 90, y: 50 })
  })

  it('wraps a negative y back from the bottom edge', () => {
    expect(wrap({ x: 50, y: -20 }, W, H)).toEqual({ x: 50, y: 180 })
  })

  it('wraps a point past both edges simultaneously (corner case)', () => {
    expect(wrap({ x: -10, y: 210 }, W, H)).toEqual({ x: 90, y: 10 })
  })

  it('handles values many multiples past the boundary', () => {
    expect(wrap({ x: 350, y: -410 }, W, H)).toEqual({ x: 50, y: 190 })
  })
})
