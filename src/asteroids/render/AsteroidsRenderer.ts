import type { EngineState, ShipState, AsteroidEntity, SaucerEntity, BulletEntity } from '../engine/types'

const BLINK_PERIOD_MS = 150

function drawShip(ctx: CanvasRenderingContext2D, ship: ShipState): void {
  if (ship.invulnerableMs > 0 && Math.floor(ship.invulnerableMs / BLINK_PERIOD_MS) % 2 === 1) {
    return // blink "off" frame during post-respawn invulnerability
  }

  const { pos, heading, radius } = ship
  ctx.save()
  ctx.translate(pos.x, pos.y)
  ctx.rotate(heading)
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(radius, 0)
  ctx.lineTo(-radius * 0.7, radius * 0.6)
  ctx.lineTo(-radius * 0.4, 0)
  ctx.lineTo(-radius * 0.7, -radius * 0.6)
  ctx.closePath()
  ctx.stroke()

  if (ship.thrusting) {
    ctx.beginPath()
    ctx.moveTo(-radius * 0.4, 0)
    ctx.lineTo(-radius * 1.1, 0)
    ctx.stroke()
  }
  ctx.restore()
}

function drawAsteroid(ctx: CanvasRenderingContext2D, asteroid: AsteroidEntity): void {
  const { pos, radius, rotation, shapeOffsets } = asteroid
  const points = shapeOffsets.length || 1
  ctx.save()
  ctx.translate(pos.x, pos.y)
  ctx.rotate(rotation)
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2
    const r = radius * (shapeOffsets[i] ?? 1)
    const x = Math.cos(angle) * r
    const y = Math.sin(angle) * r
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.stroke()
  ctx.restore()
}

function drawSaucer(ctx: CanvasRenderingContext2D, saucer: SaucerEntity): void {
  const { pos, radius } = saucer
  ctx.save()
  ctx.translate(pos.x, pos.y)
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = 1.5
  // classic two-trapezoid UFO silhouette
  ctx.beginPath()
  ctx.moveTo(-radius, 0)
  ctx.lineTo(-radius * 0.4, -radius * 0.4)
  ctx.lineTo(radius * 0.4, -radius * 0.4)
  ctx.lineTo(radius, 0)
  ctx.lineTo(radius * 0.4, radius * 0.4)
  ctx.lineTo(-radius * 0.4, radius * 0.4)
  ctx.closePath()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(-radius * 0.4, -radius * 0.4)
  ctx.lineTo(-radius * 0.2, -radius * 0.8)
  ctx.lineTo(radius * 0.2, -radius * 0.8)
  ctx.lineTo(radius * 0.4, -radius * 0.4)
  ctx.stroke()
  ctx.restore()
}

function drawBullet(ctx: CanvasRenderingContext2D, bullet: BulletEntity): void {
  ctx.save()
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(bullet.pos.x, bullet.pos.y, bullet.radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

/** Draws the current engine state as classic white-on-black vector graphics. Pure/stateless: no timers, no side effects beyond `ctx`. */
export function renderFrame(ctx: CanvasRenderingContext2D, state: EngineState, width: number, height: number): void {
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, width, height)

  for (const asteroid of state.asteroids) drawAsteroid(ctx, asteroid)
  for (const saucer of state.saucers) drawSaucer(ctx, saucer)
  for (const bullet of state.bullets) drawBullet(ctx, bullet)
  for (const bullet of state.saucerBullets) drawBullet(ctx, bullet)
  if (state.ship && state.ship.alive) drawShip(ctx, state.ship)
}
