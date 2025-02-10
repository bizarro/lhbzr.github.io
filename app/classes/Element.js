import AutoBind from 'auto-bind'
import { createNanoEvents } from 'nanoevents'

import GSAP from 'gsap'

export default class {
  constructor({ appear = false, element, name }) {
    this.appear = appear
    this.element = document.createElement(element)
    this.name = name
    this.events = createNanoEvents()

    AutoBind(this)
  }

  on(event, callback) {
    return this.events.on(event, callback)
  }

  async show(animation = GSAP.timeline()) {
    document.body.appendChild(this.element)

    this.addEventListeners()

    await new Promise((resolve) => {
      animation.call(() => resolve())
    })
  }

  async hide(animation = GSAP.timeline()) {
    if (!this.element.parentNode) return

    await new Promise((resolve) => {
      animation.call(() => resolve())
    })

    document.body.removeChild(this.element)

    this.removeEventListeners()

    return Promise.resolve()
  }

  addEventListeners() {}

  removeEventListeners() {}

  onRoute(route) {}
}
