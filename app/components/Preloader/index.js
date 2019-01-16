import Loader from 'assets-loader'
import WebFontLoader from 'webfontloader'

import { TweenMax } from 'gsap'
import { each } from 'lodash'

import Element from '../../classes/Element'

import styles from './styles.scss'

import Data from '../../data/Work'

export default class extends Element {
  constructor () {
    super({
      element: 'div',
      name: 'Preloader'
    })

    this.element.className = `Preloader ${styles.preloader}`
    this.element.innerHTML = `
      <svg class="${styles.preloader__media}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.6 80.2">
        <path class="Path" fill="none" d="M40.1,68.4v11.3H0.5" />
        <path class="Path" fill="none" d="M0.5,62.7h39.6" />
        <path class="Path" fill="none" d="M0.5,51.4h39.6" />
        <path class="Path" fill="none" d="M0.5,45.8v-2.8c0-4.7,3.8-8.5,8.5-8.5h0c4.7,0,8.5,3.8,8.5,8.5 v25.5V42.9c0-4.7,3.8-8.5,8.5-8.5h5.7c4.7,0,8.5,3.8,8.5,8.5v2.8" />
        <path class="Path" fill="none" d="M28.8,17.5h11.3v11.3h-9c-5.1,0-10-2-13.7-5.7l0,0 c-3.6-3.6-8.5-5.7-13.7-5.7H0.5v11.3" />
        <path class="Path" fill="none" d="M0.5,11.8V9c0-4.7,3.8-8.5,8.5-8.5h0c4.7,0,8.5,3.8,8.5,8.5v22.5 V9c0-4.7,3.8-8.5,8.5-8.5h14.1" />
      </svg>
    `

    this.elements = {
      path: this.element.querySelectorAll('.Path')
    }

    this.assets = []

    this.setup()
    this.show()
  }

  setup () {
    each(this.elements.path, path => {
      path.style.strokeDasharray = `${path.getTotalLength()}px`
      path.style.strokeDashoffset = `${path.getTotalLength()}px`
    })

    each(Data, data => {
      this.assets.push(data.image)
    })

    Loader({ assets: this.assets }).on('progress', this.onProgress).on('complete', this.onComplete).start()
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

  onProgress (progress) {
    this.element.style.visibility = 'visible'

    each(this.elements.path, path => {
      const length = path.getTotalLength() - (path.getTotalLength() * progress)

      path.style.strokeDashoffset = `${length}px`
    })
  }

  onComplete (assets) {
    each(this.elements.path, path => {
      path.style.strokeDashoffset = 0
    })

    TweenMax.delayedCall(0.5, () => {
      WebFontLoader.load({
        custom: {
          families: ['Borda']
        },
        urls: [
          require('../../styles/fonts.scss')
        ],
        active: () => {
          this.emit('preloaded', assets)
          this.hide()
        }
      })
    })
  }
}
