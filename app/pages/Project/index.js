import GSAP from 'gsap'
import { each, filter, first } from 'lodash'

import Page from 'classes/Page'
import Projects from 'data/Work'

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
      const elements = {
        id: project.id,
        title: project.querySelector('.Title'),
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

      const ease = 'expo.out'
      const timeline = GSAP.timeline({
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

      timeline.fromTo(this.selected.title, {
        autoAlpha: 0,
        y: 50
      }, {
        autoAlpha: 1,
        duration: 1.5,
        ease,
        y: 0
      }, 0, 0)

      timeline.fromTo(this.selected.items, {
        autoAlpha: 0,
        y: 50
      }, {
        autoAlpha: 1,
        delay: 0.05,
        duration: 1.5,
        ease,
        stagger: 0.1,
        y: 0
      }, 0, 0)

      timeline.fromTo(this.selected.medias, {
        autoAlpha: 0
      }, {
        autoAlpha: 1,
        duration: 1.5
      }, 0, 0)

      return super.show(timeline)
    })
  }

  hide () {
    if (this.element.parentNode !== document.body) return

    const ease = 'expo.out'
    const timeline = GSAP.timeline({
      onComplete: () => {
        each(this.elements.wrapper, project => {
          project.classList.remove(styles['wrapper--active'])
        })
      }
    })

    timeline.to(this.selected.medias, {
      autoAlpha: 0,
      duration: 1.5,
    }, 0)

    timeline.to(this.selected.title, {
      autoAlpha: 0,
      duration: 1.5,
      ease,
      y: -50
    }, 0, 0)

    timeline.to(this.selected.items, {
      autoAlpha: 0,
      delay: 0.05,
      duration: 1.5,
      ease,
      stagger: 0.1,
      y: -50
    }, 0, 0)

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
