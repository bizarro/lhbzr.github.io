import Element from './Element'

import { Detection } from '../classes/Detection'

class Unsupported extends Element {
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
            Unsupported Browser
          </h1>

          <p class="unsupported__description">
            This website experience is optimized for these browsers:<br>
            Google Chrome 55+, Mozilla Firefox 55+ and Safari 9+.
          </p>

          <button class="Button unsupported__button">
            Continue Anyway
          </button>
        </div>
      </div>
    `

    this.elements = {
      button: this.element.querySelector('Button')
    }

    Detection.check(() => {

    }, () => {
      this.show()
    })
  }

  show () {
    this.elements.button.addEventListener('click', () => {
      this.element.classList.add('unsupported--disabled')
    })

    return super.show()
  }

  hide () {
    return super.hide()
  }
}

new Unsupported()
