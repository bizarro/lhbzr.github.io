import { Power2, TimelineMax, TweenMax } from 'gsap'

import Element from '../../classes/Element'
import SVGMorpheus from '../../plugins/SVGMorpheus'

import { Detection } from '../../classes/Detection'

import styles from './styles.scss'

const CENTER = 'center'
const TOP = 'top'

export default class extends Element {
  constructor () {
    super({
      appear: true,
      element: 'button',
      name: 'Logo'
    })

    this.element.className = `Logo ${styles.logo}`
    this.element.innerHTML = `
      <svg class="Media ${styles.logo__media}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.6 80.2">
        <g id="close">
          <path fill="none" d="M11.3,31.1l6.3,6.3" />
          <path fill="none" d="M20.4,40l8.9,9.1" />
          <path fill="none" d="M29.3,31.1l-18,18" />
        </g>

        <g id="logo">
          <path fill="none" d="M40.1,68.4v11.3H0.5" />
          <path fill="none" d="M0.5,62.7h39.6" />
          <path fill="none" d="M0.5,51.4h39.6" />
          <path fill="none" d="M0.5,45.8v-2.8c0-4.7,3.8-8.5,8.5-8.5h0c4.7,0,8.5,3.8,8.5,8.5 v25.5V42.9c0-4.7,3.8-8.5,8.5-8.5h5.7c4.7,0,8.5,3.8,8.5,8.5v2.8" />
          <path fill="none" d="M28.8,17.5h11.3v11.3h-9c-5.1,0-10-2-13.7-5.7l0,0 c-3.6-3.6-8.5-5.7-13.7-5.7H0.5v11.3" />
          <path fill="none" d="M0.5,11.8V9c0-4.7,3.8-8.5,8.5-8.5h0c4.7,0,8.5,3.8,8.5,8.5v22.5 V9c0-4.7,3.8-8.5,8.5-8.5h14.1" />
        </g>
      </svg>
    `

    this.elements = {
      media: this.element.querySelector('.Media')
    }

    this.enable()
    this.setup()
  }

  setup () {
    this.morpheus = new SVGMorpheus(this.elements.media)

    this.hover = new TimelineMax({ paused: true })
    this.hover.to(this.element, 1, {
      ease: Power2.easeOut,
      rotation: '+= 180',
      x: '-50%',
      y: '-50%'
    })
  }

  disable () {
    this.isEnabled = false
  }

  enable () {
    this.isEnabled = true
  }

  show () {
    TweenMax.set(this.element, {
      autoAlpha: 1
    })

    return super.show()
  }

  hide () {
    TweenMax.set(this.element, {
      autoAlpha: 0
    })

    return super.hide()
  }

  click () {
    if (!this.isEnabled) return

    if (this.route.indexOf('/project/') > -1) {
      this.emit('change', '/work')
    } else {
      this.emit('change', '/')
    }
  }

  hover () {
    if (this.state === TOP) {
      this.morpheus.to('close', {
        duration: 1000,
        rotation: 'random'
      })
    }
  }

  addEventListeners () {
    this.element.addEventListener('click', this.click)

    if (!Detection.isMobile()) {
      this.element.addEventListener('mouseenter', this.hover)
    }
  }

  removeEventListeners () {
    this.element.removeEventListener('click', this.click)

    if (!Detection.isMobile()) {
      this.element.removeEventListener('mouseenter', this.hover)
    }
  }

  onRoute (route) {
    this.route = route

    if (route === '/') {
      this.morpheus.to('logo', {
        duration: 1000,
        rotation: 'random'
      })

      TweenMax.to(this.element, 1, {
        left: '50%',
        top: '50%'
      })

      this.state = CENTER
    } else {
      this.morpheus.to('close', {
        duration: 1000,
        rotation: 'random'
      })

      TweenMax.to(this.element, 1, {
        left: '50%',
        top: 100
      })

      this.state = TOP
    }
  }
}
