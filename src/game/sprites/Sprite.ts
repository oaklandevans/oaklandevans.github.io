import type { IGameModel } from '../types'

export abstract class Sprite {
  x: number
  y: number
  w: number
  h: number
  protected model: IGameModel

  constructor(x: number, y: number, w: number, h: number, model: IGameModel) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.model = model
  }

  abstract update(): void
  abstract draw(ctx: CanvasRenderingContext2D): void
}
