import { Expo, TimelineMax } from 'gsap'
import { each, filter, first } from 'lodash'

import Page from 'classes/Page'
import Projects from 'data/Work'

import { split } from 'utils/text'

import styles from './styles.scss'
import view from './view.pug'

export default class extends Page {
  constructor () {
    super({
      element: 'section',
      name: 'Project',
      url: '/project/'
    })

    this.element.className = `Project ${styles.case}`
    this.element.innerHTML = view({
      projects: Projects,
      styles
    })

    this.elements = {
      wrapper: this.element.querySelectorAll('.Wrapper'),
      images: this.element.querySelectorAll('.Image'),
      loader: this.element.querySelectorAll('.Loader')
    }

    this.projects = []

    this.setup()
  }

  setup () {
    each(this.elements.wrapper, project => {
      const buttonText = project.querySelector('.ButtonText')

      const elements = {
        id: project.id,
        title: project.querySelector('.Title'),
        buttonTop: project.querySelector('.ButtonTop'),
        buttonRight: project.querySelector('.ButtonRight'),
        buttonBottom: project.querySelector('.ButtonBottom'),
        buttonLeft: project.querySelector('.ButtonLeft'),
        buttonText,
        buttonTextSpans: buttonText && split({
          element: buttonText,
          append: false,
          calculate: false
        }),
        buttonArrow: project.querySelector('.ButtonArrow'),
        items: project.querySelectorAll('.Item'),
        medias: project.querySelectorAll('.Media'),
        images: project.querySelectorAll('.Image')
      }

      this.projects.push(elements)
    })
  }

  show () {
    document.body.appendChild(this.element)

    window.requestAnimationFrame(() => {
      this.selected = first(filter(this.projects, {
        id: window.location.pathname.replace('/project/', '')
      }))

      each(this.elements.wrapper, project => {
        if (this.selected.id === project.id) {
          project.classList.add(styles['wrapper--active'])
        } else {
          project.classList.remove(styles['wrapper--active'])
        }
      })

      document.body.removeChild(this.element)

      const ease = Expo.easeOut
      const timeline = new TimelineMax({
        onStart: () => {
          each(this.selected.images, image => {
            if (!image.src) {
              image.setAttribute('src', image.getAttribute('data-src'))
            }
          })
        }
      })

      timeline.set(this.element, {
        autoAlpha: 1
      })

      timeline.fromTo(this.selected.title, 1.5, {
        autoAlpha: 0,
        y: 50
      }, {
        autoAlpha: 1,
        ease,
        y: 0
      }, 0, 0)

      timeline.staggerFromTo(this.selected.items, 1.5, {
        autoAlpha: 0,
        y: 50
      }, {
        autoAlpha: 1,
        ease,
        y: 0
      }, 0.1, 0, 0)

      if (this.selected.buttonArrow) {
        timeline.staggerFromTo(this.selected.buttonTextSpans, 1.5, {
          autoAlpha: 0,
          x: -15
        }, {
          autoAlpha: 1,
          ease,
          x: 0
        }, 0.1, 0, 0)

        timeline.fromTo(this.selected.buttonArrow, 1.5, {
          autoAlpha: 0,
          x: -15
        }, {
          autoAlpha: 1,
          ease,
          x: 0
        }, 0, 0)

        timeline.fromTo(this.selected.buttonTop, 0.375, {
          x: '-100%'
        }, {
          x: '0%'
        }, 0, 0)

        timeline.fromTo(this.selected.buttonRight, 0.375, {
          y: '-100%'
        }, {
          delay: 0.375,
          y: '0%'
        }, 0, 0)

        timeline.fromTo(this.selected.buttonBottom, 0.375, {
          x: '100%'
        }, {
          delay: 0.375 * 2,
          x: '0%'
        }, 0, 0)

        timeline.fromTo(this.selected.buttonLeft, 0.375, {
          y: '100%'
        }, {
          delay: 0.375 * 3,
          y: '0%'
        }, 0, 0)
      }

      timeline.fromTo(this.selected.medias, 1.5, {
        autoAlpha: 0
      }, {
        autoAlpha: 1
      }, 0, 0)

      return super.show(timeline)
    })
  }

  hide () {
    if (this.element.parentNode !== document.body) return

    const ease = Expo.easeOut
    const timeline = new TimelineMax({
      onComplete: () => {
        each(this.elements.wrapper, project => {
          project.classList.remove(styles['wrapper--active'])
        })
      }
    })

    timeline.to(this.selected.medias, 1.5, {
      autoAlpha: 0
    }, 0)

    timeline.to(this.selected.title, 1.5, {
      autoAlpha: 0,
      delay: 0.2,
      ease,
      y: -50
    }, 0, 0)

    timeline.staggerTo(this.selected.items, 0.375, {
      autoAlpha: 0,
      ease,
      y: -50
    }, 0.1, 0, 0)

    if (this.selected.buttonArrow) {
      timeline.staggerTo(this.selected.buttonTextSpans, 1.5, {
        autoAlpha: 0,
        ease,
        x: -15
      }, 0.1, 0, 0)

      timeline.to(this.selected.buttonArrow, 1.5, {
        autoAlpha: 0,
        ease,
        x: -15
      }, 0, 0)

      timeline.to(this.selected.buttonLeft, 0.375, {
        y: '100%'
      }, 0, 0)

      timeline.to(this.selected.buttonBottom, 0.375, {
        delay: 0.375,
        x: '100%'
      }, 0, 0)

      timeline.to(this.selected.buttonRight, 0.375, {
        delay: 0.375 * 2,
        y: '-100%'
      }, 0, 0)

      timeline.to(this.selected.buttonTop, 0.375, {
        delay: 0.375 * 3,
        x: '-100%'
      }, 0, 0)
    }

    timeline.set(this.element, {
      autoAlpha: 0
    })

    return super.hide(timeline)
  }

  addEventListeners () {
    super.addEventListeners()

    each(this.elements.images, image => {
      image.addEventListener('load', this.onImageLoad)
    })
  }

  removeEventListeners () {
    super.removeEventListeners()

    each(this.elements.images, image => {
      image.removeEventListener('load', this.onImageLoad)
    })
  }

  onImageLoad (event) {
    event.target.parentNode.parentNode.parentNode.classList.add(styles['screenshot--active'])
  }
}
