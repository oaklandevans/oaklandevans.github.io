import type { GameModel } from './GameModel'

export class GameController {
  private model: GameModel
  private keyRight = false
  private keyLeft = false
  private spaceBar = false
  private ctrl = false
  private gp: Gamepad | null = null

  private onKeyDown: (e: KeyboardEvent) => void
  private onKeyUp: (e: KeyboardEvent) => void
  private onGamepadConnected: (e: GamepadEvent) => void
  private onGamepadDisconnected: (e: GamepadEvent) => void

  constructor(model: GameModel) {
    this.model = model

    this.onKeyDown = (e: KeyboardEvent) => this.keyDownHandler(e)
    this.onKeyUp = (e: KeyboardEvent) => this.keyUpHandler(e)
    this.onGamepadConnected = (e: GamepadEvent) => {
      this.gp = navigator.getGamepads()[e.gamepad.index]
    }
    this.onGamepadDisconnected = () => {
      this.gp = null
    }

    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('gamepadconnected', this.onGamepadConnected)
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected)
  }

  private keyDownHandler(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight': this.keyRight = true; break
      case 'ArrowLeft': this.keyLeft = true; break
      case ' ': this.spaceBar = true; event.preventDefault(); break
      case 'Control': this.ctrl = true; break
    }
  }

  private keyUpHandler(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowRight': this.keyRight = false; break
      case 'ArrowLeft': this.keyLeft = false; break
      case ' ': this.spaceBar = false; break
      case 'Control': this.ctrl = false; break
    }
  }

  update(): void {
    // update gamepad state
    this.gp = navigator.getGamepads()[0]

    // store previous position
    this.model.mario.rewind(this.model.mario.x, this.model.mario.y)

    // keyboard input
    if (this.keyRight) this.model.mario.moveRight()
    if (this.keyLeft) this.model.mario.moveLeft()
    if (this.spaceBar) this.model.mario.jump()
    if (this.ctrl) {
      if (this.model.mario.reloaded) {
        this.model.addFireball()
        this.model.mario.reloaded = false
      }
    }

    // gamepad input
    if (this.gp?.buttons[0]?.pressed) {
      this.model.mario.jump()
    }
    if (this.gp?.buttons[2]?.pressed) {
      if (this.model.mario.reloaded) {
        this.model.addFireball()
        this.model.mario.reloaded = false
      }
    }
    if (this.gp?.buttons[14]?.pressed) {
      this.model.mario.moveLeft()
    }
    if (this.gp?.buttons[15]?.pressed) {
      this.model.mario.moveRight()
    }
  }

  destroy(): void {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('gamepadconnected', this.onGamepadConnected)
    window.removeEventListener('gamepaddisconnected', this.onGamepadDisconnected)
  }
}

