export class GameSound {
  private audio: HTMLAudioElement

  constructor(src: string) {
    this.audio = document.createElement('audio')
    this.audio.src = src
    this.audio.setAttribute('preload', 'auto')
    this.audio.style.display = 'none'
    document.body.appendChild(this.audio)
  }

  play(): void {
    this.audio.play().catch(() => {
      // Browser may block autoplay until user interaction
    })
  }

  stop(): void {
    this.audio.pause()
  }

  destroy(): void {
    this.audio.pause()
    this.audio.remove()
  }
}

