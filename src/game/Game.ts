import { GameModel } from './GameModel'
import { GameView } from './GameView'
import { GameController } from './GameController'

const TICK_INTERVAL = 40 // ~25 FPS, matching the original

export class Game {
  private model: GameModel
  private view: GameView
  private controller: GameController
  private timerId: number | null = null

  constructor(canvas: HTMLCanvasElement) {
    this.model = new GameModel()
    this.view = new GameView(this.model, canvas)
    this.controller = new GameController(this.model)
  }

  start(): void {
    // Render once immediately to show initial state
    this.model.update()
    this.view.update()

    this.timerId = window.setInterval(() => this.onTimer(), TICK_INTERVAL)
  }

  private onTimer(): void {
    this.controller.update()
    this.model.update()
    this.view.update()
  }

  destroy(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId)
      this.timerId = null
    }
    this.controller.destroy()
    this.model.destroy()
  }
}
