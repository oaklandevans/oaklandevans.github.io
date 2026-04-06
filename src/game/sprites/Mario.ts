import { Sprite } from './Sprite'
import type { IGameModel } from '../types'

const ASSET_BASE = '/Mario_Online/'
const MARIO_FRAME_COUNT = 5

export class Mario extends Sprite {
  vertVel = 2
  inAir = 0
  flip = false
  reloaded = true
  reloading = 0
  previousX = 0
  previousY = 0
  imageNum = 0
  marioOffset = 200

  private marioImages: HTMLImageElement[] = []

  constructor(x: number, y: number, w: number, h: number, model: IGameModel) {
    super(x, y, w, h, model)

    for (let i = 0; i < MARIO_FRAME_COUNT; i++) {
      const img = new Image()
      img.src = `${ASSET_BASE}mario${i + 1}.png`
      this.marioImages.push(img)
    }
  }

  update(): void {
    this.inAir++
    this.reloading++

    // simulate gravity
    this.vertVel += 1.2
    this.y += this.vertVel

    // simulate surface
    if (this.y + this.h > 400) {
      this.vertVel = 0
      this.y = 400 - this.h
      this.inAir = 0
    }

    if (this.reloading % 10 === 4) {
      this.reloaded = true
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    try {
      const img = this.marioImages[this.imageNum]
      if (img && img.complete) {
        if (this.flip) {
          ctx.save()
          ctx.translate(this.marioOffset + this.w, 0)
          ctx.scale(-1, 1)
          ctx.drawImage(img, 0, this.y)
          ctx.restore()
        } else {
          ctx.drawImage(img, this.marioOffset, this.y)
        }
      }
    } catch (e) {
      console.error('[Mario] Draw error:', e)
    }
  }

  getOutOfTube(t: Sprite): void {
    const marioRight = this.x + this.w
    const tubeLeft = t.x
    const tubeRight = t.x + t.w
    const tubeTop = t.y
    const marioToes = this.y + this.h
    const tubeBottom = t.y + t.h

    // in tube from left
    if (marioRight >= tubeLeft && this.previousX + this.w <= tubeLeft) {
      this.x = tubeLeft - this.w
    }
    // in tube from right
    if (this.x <= tubeRight && this.previousX >= tubeRight) {
      this.x = tubeRight
    }
    // in tube from above
    if (marioToes >= tubeTop && this.previousY + this.h <= tubeTop) {
      this.y = t.y - this.h
      this.vertVel = 0
      this.inAir = 0
    }
    // in tube from below
    if (this.y <= tubeBottom && this.previousY >= tubeBottom) {
      this.y = tubeBottom
    }
  }

  moveRight(): void {
    this.flip = false
    this.x += 7
    this.imageNum++
    if (this.imageNum > 4) {
      this.imageNum = 0
    }
  }

  moveLeft(): void {
    this.flip = true
    this.x -= 7
    if (this.imageNum > 0) {
      this.imageNum--
    }
    if (this.imageNum === 0) {
      this.imageNum = 4
    }
  }

  jump(): void {
    if (this.inAir < 5) {
      this.vertVel -= 7
    }
  }

  rewind(x: number, y: number): void {
    this.previousX = x
    this.previousY = y
  }
}
