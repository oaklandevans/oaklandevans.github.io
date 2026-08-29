import { describe, it, expect, vi } from 'vitest'
import { renderFrame } from './AsteroidsRenderer'
import type { EngineState, AsteroidEntity, SaucerEntity, BulletEntity, ShipState } from '../engine/types'

/** A minimal stand-in for CanvasRenderingContext2D — jsdom has no real canvas backend, so we count calls instead. */
function stubContext() {
  return {
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    arc: vi.fn(),
    set fillStyle(_v: string) {},
    set strokeStyle(_v: string) {},
    set lineWidth(_v: number) {}
  } as unknown as CanvasRenderingContext2D
}

function emptyState(): EngineState {
  return { phase: 'ready', ship: null, bullets: [], asteroids: [], saucers: [], saucerBullets: [], score: 0, lives: 3, wave: 0 }
}

const ship: ShipState = {
  pos: { x: 400, y: 300 },
  vel: { x: 0, y: 0 },
  heading: 0,
  radius: 12,
  alive: true,
  invulnerableMs: 0,
  thrusting: false
}

const asteroid: AsteroidEntity = {
  id: 1,
  size: 'large',
  pos: { x: 100, y: 100 },
  vel: { x: 0, y: 0 },
  radius: 40,
  rotation: 0,
  rotationSpeed: 0,
  shapeOffsets: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
}

const saucer: SaucerEntity = {
  id: 2,
  size: 'large',
  pos: { x: 200, y: 200 },
  vel: { x: 0, y: 0 },
  radius: 24,
  fireCooldownMs: 0,
  directionChangeMs: 0
}

const bullet: BulletEntity = { id: 3, owner: 'ship', pos: { x: 50, y: 50 }, vel: { x: 0, y: 0 }, radius: 2, remainingLifeMs: 500 }

describe('renderFrame', () => {
  it('clears the canvas exactly once per frame', () => {
    const ctx = stubContext()
    renderFrame(ctx, emptyState(), 800, 600)
    expect(ctx.fillRect).toHaveBeenCalledTimes(1)
    expect(ctx.fillRect).toHaveBeenCalledWith(0, 0, 800, 600)
  })

  it('does not throw on an empty/no-ship state (ready or game-over phases)', () => {
    const ctx = stubContext()
    expect(() => renderFrame(ctx, emptyState(), 800, 600)).not.toThrow()
  })

  it('does not throw when the ship is present but not alive', () => {
    const ctx = stubContext()
    const state = { ...emptyState(), ship: { ...ship, alive: false } }
    expect(() => renderFrame(ctx, state, 800, 600)).not.toThrow()
  })

  it('draws one bullet arc per bullet, across both player and saucer bullets', () => {
    const ctx = stubContext()
    const state = { ...emptyState(), bullets: [bullet, bullet], saucerBullets: [bullet] }
    renderFrame(ctx, state, 800, 600)
    expect(ctx.arc).toHaveBeenCalledTimes(3)
  })

  it('draws a stroked path for each asteroid and each saucer', () => {
    const ctx = stubContext()
    const state = { ...emptyState(), asteroids: [asteroid, asteroid], saucers: [saucer] }
    renderFrame(ctx, state, 800, 600)
    // 2 asteroids (1 stroke each) + 1 saucer (2 strokes: body + cockpit) = 4
    expect(ctx.stroke).toHaveBeenCalledTimes(4)
  })

  it('draws the ship when alive and not mid-blink', () => {
    const ctx = stubContext()
    const state = { ...emptyState(), ship }
    renderFrame(ctx, state, 800, 600)
    expect(ctx.stroke).toHaveBeenCalledTimes(1) // ship outline, no thrust flame
  })

  it('skips drawing the ship during the "off" phase of its invulnerability blink', () => {
    const ctx = stubContext()
    // invulnerableMs chosen to land in an "off" blink half-period (see BLINK_PERIOD_MS in the renderer)
    const state = { ...emptyState(), ship: { ...ship, invulnerableMs: 150 } }
    renderFrame(ctx, state, 800, 600)
    expect(ctx.stroke).not.toHaveBeenCalled()
  })
})
