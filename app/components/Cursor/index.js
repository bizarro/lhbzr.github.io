import AutoBind from 'auto-bind'

import { TweenMax } from 'gsap'
import { each } from 'lodash'

import { lerp } from 'utils/math'

import styles from './styles.scss'

export default class Dot {
  constructor () {
    AutoBind(this)

    this.element = document.createElement('div')
    this.element.className = styles.element

    this.x = {
      current: 0,
      value: 0
    }

    this.y = {
      current: 0,
      value: 0
    }

    this.opacity = {
      current: 1,
      value: 1
    }

    this.scale = {
      current: 1,
      value: 1
    }

    document.body.appendChild(this.element)

    this.addEventListeners()
    this.loop()
  }

  onMouseMove (event) {
    this.x.current = event.clientX
    this.y.current = event.clientY

    this.opacity.current = 1
  }

  onMouseOut () {
    this.opacity.current = 0
  }

  onMouseEnter () {
    this.scale.current = 3

    this.element.classList.add(styles['element--hover'])
  }

  onMouseLeave () {
    this.scale.current = 1

    this.element.classList.remove(styles['element--hover'])
  }

  loop () {
    this.opacity.value = lerp(this.opacity.value, this.opacity.current, 0.1)
    this.scale.value = lerp(this.scale.value, this.scale.current, 0.1)
    this.x.value = lerp(this.x.value, this.x.current, 0.4)
    this.y.value = lerp(this.y.value, this.y.current, 0.4)

    TweenMax.set(this.element, {
      opacity: this.opacity.value,
      scale: this.scale.value,
      x: this.x.value,
      y: this.y.value,
      zIndex: 100
    })

    this.frame = window.requestAnimationFrame(this.loop)
  }

  update () {
    each(document.querySelectorAll('a, button'), element => {
      element.addEventListener('mouseenter', this.onMouseEnter)
      element.addEventListener('mouseleave', this.onMouseLeave)
      element.addEventListener('click', this.onMouseLeave)
    })
  }

  addEventListeners () {
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseout', this.onMouseOut)
  }
}
