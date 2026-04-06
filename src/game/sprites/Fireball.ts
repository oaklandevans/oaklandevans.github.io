import { Sprite } from './Sprite'
import type { IGameModel } from '../types'

const ASSET_BASE = '/Mario_Online/'

export class Fireball extends Sprite {
  vertVel = 2
  inAir = 5
  aliveFor = 0
  private shotRight: boolean
  private shotLeft: boolean
  private image: HTMLImageElement

  constructor(x: number, y: number, w: number, h: number, model: IGameModel) {
    super(x, y, w, h, model)

    this.image = new Image()
    this.image.src = `${ASSET_BASE}fireball.png`

    this.shotRight = !model.mario.flip
    this.shotLeft = model.mario.flip
  }

  update(): void {
    this.inAir++
    this.aliveFor++

    // simulate gravity
    this.vertVel += 2.5
    this.y += this.vertVel

    // simulate surface
    if (this.y + this.h > 400) {
      this.vertVel = 0.0
      this.y = 400 - this.h
      this.inAir = 0
    }

    // bounce fireball
    if (this.inAir < 5) {
      this.bounce()
    }

    if (this.shotRight) {
      this.x += 20
    }
    if (this.shotLeft) {
      this.x -= 20
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    try {
      const mario = this.model.mario
      if (this.image && this.image.complete) {
        ctx.drawImage(this.image, this.x - mario.x + mario.marioOffset, this.y)
      }
    } catch (e) {
      console.error('[Fireball] Draw error:', e)
    }
  }

  private bounce(): void {
    this.vertVel -= 6
  }
}
