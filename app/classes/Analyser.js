import AutoBind from 'auto-bind'

import Music from '../assets/music/han-jan.mp3'

class AnalyserManager {
  constructor() {
    AutoBind(this)

    this.audio = new Audio()
    this.audio.crossOrigin = 'anonymous'
    this.audio.loop = true
    this.audio.src = Music

    this.frequency = new Uint8Array(100)

    window.addEventListener('mousedown', this.start)
    window.addEventListener('touchstart', this.start)
  }

  start() {
    this.context = new (window.AudioContext || window.webkitAudioContext)()

    this.analyser = this.context.createAnalyser()
    this.analyser.fftSize = 512
    this.analyser.smoothingTimeConstant = 0.5
    this.analyser.connect(this.context.destination)

    this.src = this.context.createMediaElementSource(this.audio)
    this.src.connect(this.analyser)

    window.removeEventListener('mousedown', this.start)
    window.removeEventListener('touchstart', this.start)
  }

  getFrequency() {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.frequency)
    }

    return this.frequency
  }

  pause() {
    this.audio.pause()
  }

  play() {
    this.audio.play()
  }

  toggle() {
    if (this.audio.paused) {
      this.play()
    } else {
      this.pause()
    }
  }
}

export const Analyser = new AnalyserManager()
