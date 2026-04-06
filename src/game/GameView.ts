import type { GameModel } from './GameModel'

export class GameView {
  private model: GameModel
  private canvas: HTMLCanvasElement

  constructor(model: GameModel, canvas: HTMLCanvasElement) {
    this.model = model
    this.canvas = canvas
  }

  update(): void {
    const ctx = this.canvas.getContext('2d')
    if (!ctx) return

    const width = this.canvas.width
    const height = this.canvas.height
    const groundY = 400

    // draw sky
    ctx.fillStyle = 'lightblue'
    ctx.clearRect(0, 0, width, height)
    ctx.fillRect(0, 0, width, height)

    // draw ground
    ctx.fillStyle = 'lightgreen'
    ctx.clearRect(0, groundY, width, 150)
    ctx.fillRect(0, groundY, width, height)

    // draw all sprites
    for (const sprite of this.model.sprites) {
      sprite.draw(ctx)
    }
  }
}
