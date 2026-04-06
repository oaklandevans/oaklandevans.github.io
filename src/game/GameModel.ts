import { Sprite } from './sprites/Sprite'
import { Mario } from './sprites/Mario'
import { Tube } from './sprites/Tube'
import { TubeInverted } from './sprites/TubeInverted'
import { Goomba } from './sprites/Goomba'
import { Fireball } from './sprites/Fireball'
import { GameSound } from './sound'
import type { IGameModel } from './types'

const ASSET_BASE = '/Mario_Online/'

export class GameModel implements IGameModel {
  sprites: Sprite[] = []
  mario: Mario
  gameThemeSong: GameSound

  constructor() {
    this.gameThemeSong = new GameSound(`${ASSET_BASE}Super-Mario-Bros.mp3`)

    // create mario
    this.mario = new Mario(50, 50, 60, 95, this)
    this.sprites.push(this.mario)

    // create tubes
    this.sprites.push(new Tube(300, 250, 60, 400, this))
    this.sprites.push(new TubeInverted(500, -200, 60, 400, this))
    this.sprites.push(new Tube(800, 200, 60, 400, this))
    this.sprites.push(new Tube(1100, 250, 60, 400, this))
    this.sprites.push(new Tube(1400, 350, 60, 400, this))
    this.sprites.push(new Tube(1700, 300, 60, 400, this))
    this.sprites.push(new Tube(2000, 150, 60, 400, this))
    this.sprites.push(new TubeInverted(2200, -200, 60, 400, this))
    this.sprites.push(new Tube(2400, 250, 60, 400, this))

    // create goombas
    this.sprites.push(new Goomba(500, 50, 100, 115, this))
    this.sprites.push(new Goomba(1200, 50, 100, 115, this))
    this.sprites.push(new Goomba(1250, 50, 100, 115, this))
    this.sprites.push(new Goomba(1500, 50, 100, 115, this))
    this.sprites.push(new Goomba(1800, 50, 100, 115, this))

    // start theme song
    this.gameThemeSong.play()
  }

  update(): void {
    for (let i = 0; i < this.sprites.length; i++) {
      const sprite = this.sprites[i]
      sprite.update()

      // check for collision between mario and tube/inverted tube
      if (sprite instanceof Tube || sprite instanceof TubeInverted) {
        if (this.collisionDetection(this.mario, sprite)) {
          this.mario.getOutOfTube(sprite)
        }
      }

      // check for collision between goomba and tube / goomba and mario
      else if (sprite instanceof Goomba) {
        for (let j = 0; j < this.sprites.length; j++) {
          if (this.sprites[j] instanceof Tube) {
            if (this.collisionDetection(sprite, this.sprites[j])) {
              sprite.getOutOfTube(this.sprites[j])
            }
          }
          if (this.sprites[j] instanceof Mario) {
            if (this.collisionDetection(sprite, this.sprites[j])) {
              sprite.smashGoomba()
            }
          }
        }

        if (sprite.onFireFor > 40) {
          sprite.onFire = false
          this.sprites.splice(i, 1)
        }
        if (sprite.isSmashedFor > 40) {
          sprite.isSmashed = false
          this.sprites.splice(i, 1)
        }
      }

      // check for collision between fireball and goomba
      else if (sprite instanceof Fireball) {
        for (let j = 0; j < this.sprites.length; j++) {
          if (this.sprites[j] instanceof Goomba) {
            const goomba = this.sprites[j] as Goomba
            if (this.collisionDetection(sprite, goomba)) {
              goomba.catchOnFire()
              this.sprites.splice(i, 1)
              break
            }
          }
        }

        if (sprite.aliveFor > 35) {
          this.sprites.splice(i, 1)
        }
      }
    }
  }

  addFireball(): void {
    const fireball = new Fireball(
      this.mario.x + 20,
      this.mario.y + 20,
      20,
      20,
      this
    )
    this.sprites.push(fireball)
  }

  private collisionDetection(a: Sprite, b: Sprite): boolean {
    const aRight = a.x + a.w
    const bRight = b.x + b.w
    const aBottom = a.y + a.h
    const bBottom = b.y + b.h

    if (aRight < b.x) return false
    if (a.x > bRight) return false
    if (aBottom < b.y) return false
    if (a.y > bBottom) return false

    return true
  }

  destroy(): void {
    this.gameThemeSong.destroy()
  }
}
