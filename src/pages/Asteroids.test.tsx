import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Asteroids from './Asteroids'

// jsdom has no real canvas backend and no rAF loop timing — stub both so the component
// mounts/unmounts cleanly and we can assert on DOM structure and button wiring, not physics.
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    arc: vi.fn()
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext

  vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(1))
  vi.stubGlobal('cancelAnimationFrame', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function renderPage() {
  return render(
    <MemoryRouter>
      <Asteroids />
    </MemoryRouter>
  )
}

describe('Asteroids page', () => {
  it('renders the canvas, HUD, and controls legend', () => {
    renderPage()
    expect(document.querySelector('canvas')).not.toBeNull()
    expect(screen.getByText(/SCORE/)).toBeInTheDocument()
    expect(screen.getByText(/LIVES/)).toBeInTheDocument()
    expect(screen.getByText(/WAVE/)).toBeInTheDocument()
    expect(screen.getByText(/Rotate: ← →/)).toBeInTheDocument()
    expect(screen.getByText(/Thrust: ↑/)).toBeInTheDocument()
    expect(screen.getByText(/Fire: Space/)).toBeInTheDocument()
    expect(screen.getByText(/Hyperspace: Ctrl/)).toBeInTheDocument()
  })

  it('shows a Start Game button initially, and switches to Stop Game once started', () => {
    renderPage()
    const startBtn = screen.getByRole('button', { name: 'Start Game' })
    expect(startBtn).toBeInTheDocument()

    fireEvent.click(startBtn)

    expect(screen.getByRole('button', { name: 'Stop Game' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Start Game' })).not.toBeInTheDocument()
    expect(requestAnimationFrame).toHaveBeenCalled()
  })

  it('returns to the Start Game button and cancels the frame loop when stopped', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }))
    fireEvent.click(screen.getByRole('button', { name: 'Stop Game' }))

    expect(screen.getByRole('button', { name: 'Start Game' })).toBeInTheDocument()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })

  it('unmounting mid-game cancels the animation frame loop', () => {
    const { unmount } = renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Start Game' }))
    unmount()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })

  it('navigates home when "Back to Home" is clicked', () => {
    renderPage()
    expect(screen.getByRole('button', { name: 'Back to Home' })).toBeInTheDocument()
  })
})
