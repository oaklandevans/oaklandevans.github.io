import { Sprite } from './Sprite'
import type { IGameModel } from '../types'

const ASSET_BASE = '/Mario_Online/'

export class Tube extends Sprite {
  private image: HTMLImageElement

  constructor(x: number, y: number, w: number, h: number, model: IGameModel) {
    super(x, y, w, h, model)
    this.image = new Image()
    this.image.src = `${ASSET_BASE}tube.png`
  }

  update(): void {
    // Tubes are static — no update needed
  }

  draw(ctx: CanvasRenderingContext2D): void {
    try {
      const mario = this.model.mario
      if (this.image && this.image.complete) {
        ctx.drawImage(this.image, this.x - mario.x + mario.marioOffset, this.y)
      }
    } catch (e) {
      console.error('[Tube] Draw error:', e)
    }
  }
}
