import { useEffect, useRef } from 'react'
import { Game } from '../game/Game'
import '../styles/MarioOnline.css'

export default function MarioOnline() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const game = new Game(canvas)
    game.start()

    return () => {
      game.destroy()
    }
  }, [])

  return (
    <div className="mario-online-container">
      <canvas
        ref={canvasRef}
        width={1000}
        height={500}
        style={{ display: 'block' }}
      />
      <div className="mario-online-controls">
        <span>Move Right: →</span>
        <span>Move Left: ←</span>
        <span>Jump: Space</span>
        <span>Fireball: Ctrl</span>
      </div>
    </div>
  )
}
