import AutoBind from 'auto-bind'

import { noop } from 'lodash'
import { get } from '../utils/ajax'

import Songs from '../data/Songs'

class AnalyserManager {
  constructor () {
    AutoBind(this)

    this.audio = new Audio()
    this.audio.crossOrigin = 'anonymous'
    this.audio.volume = 1

    this.audio.addEventListener('ended', this.next)

    this.frequency = new Uint8Array(100)

    this.song = {
      current: Math.floor(Math.random() * Songs.length),
      previous: null,
      next: null
    }

    this.information = {
      name: Songs[this.song.current].name,
      link: Songs[this.song.current].link
    }

    window.addEventListener('mousedown', this.start)
    window.addEventListener('touchstart', this.start)
  }

  start () {
    this.client = 'd764995c8ec4e9f30f85b3bd8396312c'

    this.context = new (window.AudioContext || window.webkitAudioContext)()

    this.analyser = this.context.createAnalyser()
    this.analyser.fftSize = 512
    this.analyser.smoothingTimeConstant = 0.5
    this.analyser.connect(this.context.destination)

    this.src = this.context.createMediaElementSource(this.audio)
    this.src.connect(this.analyser)

    this.load(this.song.current)

    window.removeEventListener('mousedown', this.start)
    window.removeEventListener('touchstart', this.start)
  }

  getFrequency () {
    if (this.analyser) {
      this.analyser.getByteFrequencyData(this.frequency)
    }

    return this.frequency
  }

  load (song, callback = noop) {
    this.song.current = song
    this.song.previous = (this.song.current !== 0) ? this.song.current - 1 : Songs.length - 1
    this.song.next = (this.song.current !== Songs.length - 1) ? this.song.current + 1 : 0

    this.information = {
      name: Songs[this.song.current].name,
      link: Songs[this.song.current].link
    }

    const url = `//api.soundcloud.com/resolve.json?url=${Songs[song].link}&client_id=${this.client}`

    get(url).then(request => {
      const response = JSON.parse(request)

      if (response.stream_url) {
        this.audio.src = `${response.stream_url}?client_id=${this.client}`
      } else {
        this.next()
      }

      callback()
    })
  }

  previous () {
    this.load(this.song.previous, this.play)
  }

  next () {
    this.load(this.song.next, this.play)
  }

  pause () {
    this.audio.pause()
  }

  play () {
    this.audio.play()
  }

  toggle () {
    if (this.audio.paused) {
      this.play()
    } else {
      this.pause()
    }
  }
}

export const Analyser = new AnalyserManager()
