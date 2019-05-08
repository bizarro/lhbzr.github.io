import AutoBind from 'auto-bind'
import EventEmitter from 'events'

import { TimelineMax, TweenMax } from 'gsap'
import { clamp } from 'lodash'

export default class extends EventEmitter {
  constructor ({ url, name, element }) {
    super()

    if (element) {
      this.element = document.createElement(element)

      this.isDown = false

      this.scroll = {
        position: 0,
        current: 0,
        target: 0
      }

      this.onScrollMouseWheelEvent = this.onScrollMouseWheel.bind(this)

      this.onScrollTouchStartEvent = this.onScrollTouchStart.bind(this)
      this.onScrollTouchMoveEvent = this.onScrollTouchMove.bind(this)
      this.onScrollTouchEndEvent = this.onScrollTouchEnd.bind(this)
    }

    this.name = name
    this.url = url

    AutoBind(this)
  }

  async show (animation = new TimelineMax()) {
    this.addEventListeners()

    if (this.element) {
      document.body.appendChild(this.element)

      this.scroll = {
        position: 0,
        current: 0,
        target: 0
      }

      this.onScrollUpdate()
    }

    await new Promise(resolve => {
      animation.call(() => resolve())
    })

    return Promise.resolve()
  }

  async hide (animation = new TimelineMax()) {
    if (this.element && this.element.parentNode !== document.body) return

    await new Promise(resolve => {
      animation.call(() => resolve())
    })

    if (this.element) {
      document.body.removeChild(this.element)

      window.cancelAnimationFrame(this.onScrollUpdateEvent)
    }

    this.removeEventListeners()

    return Promise.resolve()
  }

  onScrollMouseWheel (event) {
    let delta = -event.wheelDeltaY || event.deltaY
    let speed = 75

    if (delta < 0) speed *= -1

    const total = this.element.clientHeight - window.innerHeight

    this.scroll.target += speed
    this.scroll.target = clamp(this.scroll.target, 0, total)
  }

  onScrollTouchStart (event) {
    this.isDown = true

    this.scroll.position = this.scroll.current
    this.start = event.touches ? event.touches[0].clientY : event.clientY
  }

  onScrollTouchMove (event) {
    if (!this.isDown) return

    const total = this.element.clientHeight - window.innerHeight
    const y = event.touches ? event.touches[0].clientY : event.clientY

    const distance = (this.start - y) * 2

    this.scroll.target = this.scroll.position + distance
    this.scroll.target = clamp(this.scroll.target, 0, total)
  }

  onScrollTouchEnd (event) {
    this.isDown = false
  }

  onScrollUpdate () {
    this.scroll.current += (this.scroll.target - this.scroll.current) * 0.1

    TweenMax.set(this.element, {
      y: -this.scroll.current
    })

    this.onScrollUpdateEvent = window.requestAnimationFrame(this.onScrollUpdate.bind(this))
  }

  addEventListeners () {
    if (this.element) {
      window.addEventListener('mousewheel', this.onScrollMouseWheelEvent)

      window.addEventListener('touchstart', this.onScrollTouchStartEvent)
      window.addEventListener('touchmove', this.onScrollTouchMoveEvent)
      window.addEventListener('touchend', this.onScrollTouchEndEvent)

      window.addEventListener('mousedown', this.onScrollTouchStartEvent)
      window.addEventListener('mousemove', this.onScrollTouchMoveEvent)
      window.addEventListener('mouseup', this.onScrollTouchEndEvent)
    }
  }

  removeEventListeners () {
    if (this.element) {
      window.removeEventListener('mousewheel', this.onScrollMouseWheelEvent)

      window.removeEventListener('touchstart', this.onScrollTouchStartEvent)
      window.removeEventListener('touchmove', this.onScrollTouchMoveEvent)
      window.removeEventListener('touchend', this.onScrollTouchEndEvent)

      window.removeEventListener('mousedown', this.onScrollTouchStartEvent)
      window.removeEventListener('mousemove', this.onScrollTouchMoveEvent)
      window.removeEventListener('mouseup', this.onScrollTouchEndEvent)
    }
  }
}
