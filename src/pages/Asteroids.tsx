import { useEffect, useRef, useState, ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import { AsteroidsEngine } from '../asteroids/engine/AsteroidsEngine'
import { renderFrame } from '../asteroids/render/AsteroidsRenderer'
import { actionForKey } from '../asteroids/input/keymap'
import { neutralInput } from '../asteroids/engine/types'
import type { InputState, GamePhase } from '../asteroids/engine/types'
import { WORLD_WIDTH, WORLD_HEIGHT } from '../asteroids/engine/constants'
import '../styles/Asteroids.css'

interface Hud {
  score: number
  lives: number
  wave: number
  phase: GamePhase
}

// A tab-backgrounded frame can report a huge dt on return; clamp it so the simulation doesn't leap.
const MAX_FRAME_DT_MS = 50

export default function Asteroids(): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<AsteroidsEngine | null>(null)
  const inputRef = useRef<InputState>(neutralInput())
  const rafIdRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)
  const navigate = useNavigate()

  const [hud, setHud] = useState<Hud>({ score: 0, lives: 0, wave: 0, phase: 'ready' })

  useEffect(() => {
    const engine = new AsteroidsEngine({ worldWidth: WORLD_WIDTH, worldHeight: WORLD_HEIGHT })
    engineRef.current = engine

    const keydown = (event: KeyboardEvent): void => {
      const action = actionForKey(event.key)
      if (!action) return
      event.preventDefault()
      inputRef.current = { ...inputRef.current, [action]: true }
    }
    const keyup = (event: KeyboardEvent): void => {
      const action = actionForKey(event.key)
      if (!action) return
      inputRef.current = { ...inputRef.current, [action]: false }
    }
    document.addEventListener('keydown', keydown)
    document.addEventListener('keyup', keyup)

    const ctx = canvasRef.current?.getContext('2d') ?? null
    if (ctx) renderFrame(ctx, engine.getState(), WORLD_WIDTH, WORLD_HEIGHT)

    return () => {
      document.removeEventListener('keydown', keydown)
      document.removeEventListener('keyup', keyup)
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
    }
  }, [])

  const frame = (now: number): void => {
    const engine = engineRef.current
    const ctx = canvasRef.current?.getContext('2d') ?? null
    if (!engine || !ctx) return

    const last = lastFrameTimeRef.current ?? now
    const dt = Math.min(now - last, MAX_FRAME_DT_MS)
    lastFrameTimeRef.current = now

    engine.update(dt, inputRef.current)
    const state = engine.getState()
    renderFrame(ctx, state, WORLD_WIDTH, WORLD_HEIGHT)
    setHud({ score: state.score, lives: state.lives, wave: state.wave, phase: state.phase })

    if (state.phase === 'playing') {
      rafIdRef.current = requestAnimationFrame(frame)
    } else {
      rafIdRef.current = null
    }
  }

  const startGame = (): void => {
    const engine = engineRef.current
    if (!engine) return
    inputRef.current = neutralInput()
    lastFrameTimeRef.current = null
    engine.start()
    setHud({ score: 0, lives: engine.getState().lives, wave: engine.getState().wave, phase: 'playing' })
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = requestAnimationFrame(frame)
  }

  const stopGame = (): void => {
    const engine = engineRef.current
    if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current)
    rafIdRef.current = null
    engine?.reset()
    inputRef.current = neutralInput()
    const ctx = canvasRef.current?.getContext('2d') ?? null
    if (ctx && engine) renderFrame(ctx, engine.getState(), WORLD_WIDTH, WORLD_HEIGHT)
    setHud({ score: 0, lives: 0, wave: 0, phase: 'ready' })
  }

  const isRunning = hud.phase === 'playing'

  return (
    <div className="asteroids-container">
      <div className="asteroids-hud">
        <span>SCORE {hud.score}</span>
        <span>LIVES {hud.lives}</span>
        <span>WAVE {hud.wave}</span>
      </div>

      <div className="asteroids-canvas-wrap">
        <canvas ref={canvasRef} width={WORLD_WIDTH} height={WORLD_HEIGHT} />
        {hud.phase === 'gameOver' && (
          <div className="asteroids-overlay">
            <p>GAME OVER</p>
            <p className="asteroids-overlay-score">Score: {hud.score}</p>
          </div>
        )}
      </div>

      <div className="asteroids-controls">
        <span>Rotate: ← →</span>
        <span>Thrust: ↑</span>
        <span>Fire: Space</span>
        <span>Hyperspace: Ctrl</span>
      </div>

      <div className="asteroids-buttons">
        {!isRunning && (
          <button id="asteroidsStartBtn" onClick={startGame}>
            {hud.phase === 'gameOver' ? 'Play Again' : 'Start Game'}
          </button>
        )}
        {isRunning && (
          <button id="asteroidsStopBtn" onClick={stopGame}>
            Stop Game
          </button>
        )}
        <button id="asteroidsBackBtn" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  )
}
