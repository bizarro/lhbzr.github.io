import Element from './Element'

import { Detection } from '../classes/Detection'

class Rotation extends Element {
  constructor () {
    super({
      element: 'section',
      name: 'Unsupported'
    })

    this.element.classList = `unsupported`
    this.element.innerHTML = `
      <div class="unsupported__wrapper">
        <div class="unsupported__content">
          <img src="lhbzr.svg" class="unsupported__image">

          <h1 class="unsupported__title">
            Rotate Your Screen
          </h1>

          <p class="unsupported__description">
            This website experience is optimized for:<br>
            mobile portrait and tablet landscape.
          </p>
        </div>
      </div>
    `

    if (Detection.isMobile()) {
      this.onResize()
    }
  }

  onResize () {
    if (Detection.type === 'mobile') {
      if (window.innerWidth > window.innerHeight) {
        this.element.style.display = 'table'
      } else {
        this.element.style.display = 'none'
      }
    }

    if (Detection.type === 'tablet') {
      if (window.innerWidth < window.innerHeight) {
        this.element.style.display = 'table'
      } else {
        this.element.style.display = 'none'
      }
    }
  }

  addEventListeners () {
    if (Detection.isMobile()) {
      window.addEventListener('resize', this.onResize)
    }
  }

  removeEventListeners () {
    if (Detection.isMobile()) {
      window.removeEventListener('resize', this.onResize)
    }
  }
}

new Rotation()
