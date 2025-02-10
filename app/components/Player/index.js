import GSAP from 'gsap'

import Element from '../../classes/Element'

import styles from './styles.scss'

import { Analyser } from '../../classes/Analyser'

export default class extends Element {
  constructor() {
    super({
      appear: true,
      element: 'div',
      name: 'Player',
    })

    this.element.classList = `Player ${styles.player}`
    this.element.innerHTML = `
      <button class="ButtonToggle ${styles.player__button} ${styles['player__button--toggle']}">
        <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 6.7 12" class="IconPause ${styles.player__button__icon} ${styles['player__button__icon--pause']}">
          <path fill="none" d="M0.5,0v11.3" />
          <path fill="none" d="M6.2,11.3V0" />
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 6.7 12" class="IconPlay ${styles.player__button__icon} ${styles['player__button__icon--play']}">
          <path fill="none" d="M0.4,0.4L6,6l-5.7,5.7" />
        </svg>
      </button>

      <a href="https://peggygou.com/" target="_blank" class="Link ${styles.player__information}">
        <span class="Title ${styles.player__information__title}">
          Peggy Gou - Han Jan
        </span>
      </a>
    `

    this.elements = {
      buttonNext: this.element.querySelector('.ButtonNext'),
      buttonPrevious: this.element.querySelector('.ButtonPrevious'),
      buttonToggle: this.element.querySelector('.ButtonToggle'),
      iconPause: this.element.querySelector('.IconPause'),
      iconPlay: this.element.querySelector('.IconPlay'),
      link: this.element.querySelector('.Link'),
      title: this.element.querySelector('.Title'),
    }
  }

  show() {
    const timeline = GSAP.timeline()

    timeline.to(this.element, {
      autoAlpha: 1,
      duration: 1,
    })

    return super.show(timeline)
  }

  hide() {
    const timeline = GSAP.timeline()

    timeline.to(this.element, {
      autoAlpha: 0,
      duration: 1,
    })

    return super.hide(timeline)
  }

  next() {
    Analyser.next()
  }

  previous() {
    Analyser.previous()
  }

  toggle() {
    Analyser.toggle()
  }

  addEventListeners() {
    this.elements.buttonToggle.addEventListener('click', this.toggle)

    Analyser.audio.addEventListener('canplay', this.onLoad)
    Analyser.audio.addEventListener('pause', this.onPause)
    Analyser.audio.addEventListener('playing', this.onPlaying)
  }

  removeEventListeners() {
    this.elements.buttonToggle.removeEventListener('click', this.toggle)
  }

  onRoute(route) {
    if (route === '/') {
      this.show()
    } else {
      this.hide()
    }
  }

  onPause() {
    this.elements.iconPause.style.display = 'none'
    this.elements.iconPlay.style.display = 'block'
  }

  onPlaying() {
    this.elements.iconPause.style.display = 'block'
    this.elements.iconPlay.style.display = 'none'
  }
}
