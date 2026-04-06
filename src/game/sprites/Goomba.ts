import { Sprite } from './Sprite'
import type { IGameModel } from '../types'

const ASSET_BASE = '/Mario_Online/'

export class Goomba extends Sprite {
  vertVel = 2
  inAir = 0
  previousX = 0
  previousY = 0
  flip = false
  onFire = false
  onFireFor = 0
  isSmashed = false
  isSmashedFor = 0

  private imageGoomba: HTMLImageElement
  private imageGoombaFire: HTMLImageElement
  private imageGoombaSmashed: HTMLImageElement

  constructor(x: number, y: number, w: number, h: number, model: IGameModel) {
    super(x, y, w, h, model)

    this.imageGoomba = new Image()
    this.imageGoomba.src = `${ASSET_BASE}goomba.png`
    this.imageGoombaFire = new Image()
    this.imageGoombaFire.src = `${ASSET_BASE}goomba_fire.png`
    this.imageGoombaSmashed = new Image()
    this.imageGoombaSmashed.src = `${ASSET_BASE}goomba_inverted.png`
  }

  update(): void {
    this.rewind(this.x, this.y)
    this.inAir++

    // simulate gravity
    this.vertVel += 1.2
    this.y += this.vertVel

    // simulate surface
    if (this.y + this.h > 400) {
      this.vertVel = 0
      this.y = 400 - this.h
      this.inAir = 0
    }

    if (!this.flip) {
      this.moveRight()
    } else {
      this.moveLeft()
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    try {
      const mario = this.model.mario
      const drawX = this.x - mario.x + mario.marioOffset

      if (this.onFire) {
        this.onFireFor++
        if (this.imageGoombaFire && this.imageGoombaFire.complete) {
          ctx.drawImage(this.imageGoombaFire, drawX, this.y)
        }
      } else if (this.isSmashed) {
        this.isSmashedFor++
        if (this.imageGoombaSmashed && this.imageGoombaSmashed.complete) {
          ctx.drawImage(this.imageGoombaSmashed, drawX, this.y)
        }
      } else {
        this.onFireFor = 0
        this.isSmashedFor = 0
        if (this.imageGoomba && this.imageGoomba.complete) {
          ctx.drawImage(this.imageGoomba, drawX, this.y)
        }
      }
    } catch (e) {
      console.error('[Goomba] Draw error:', e)
    }
  }

  getOutOfTube(t: Sprite): void {
    const goombaRight = this.x + this.w
    const tubeLeft = t.x
    const tubeRight = t.x + t.w

    // in tube from left
    if (goombaRight >= tubeLeft && this.previousX + this.w <= tubeLeft) {
      this.flip = !this.flip
      this.x = tubeLeft - this.w - 2
    }
    // in tube from right
    if (this.x <= tubeRight && this.previousX >= tubeRight) {
      this.flip = !this.flip
      this.x = tubeRight + 2
    }
  }

  moveRight(): void {
    if (!this.isSmashed) this.x += 5
  }

  moveLeft(): void {
    if (!this.isSmashed) this.x -= 5
  }

  rewind(x: number, y: number): void {
    this.previousX = x
    this.previousY = y
  }

  catchOnFire(): void {
    this.onFire = true
  }

  smashGoomba(): void {
    this.isSmashed = true
  }
}
