import { Expo, TimelineMax } from 'gsap'
import { each, filter, first, map } from 'lodash'

import Page from '../../classes/Page'
import Projects from '../../data/Work'

import { split } from '../../utils/text'

import styles from './styles.scss'

export default class extends Page {
  constructor () {
    super({
      element: 'section',
      name: 'Project',
      url: '/project/'
    })

    this.element.className = `Project ${styles.case}`
    this.element.innerHTML = `
      ${map(Projects, project => `
        <div id="${project.slug}" class="Wrapper ${styles.wrapper}">
          <header class="Header ${styles.header}">
            <h1 class="Title ${styles.title}">
              ${project.title}
            </h1>

            ${this.renderButton(project.url)}
          </header>

          <div class="${styles.description}">
            ${this.renderInformations(project)}
            ${this.renderAwards(project.awards)}
            ${this.renderApps(project.apps)}
          </div>

          <div class="${styles.content} ${styles[`content--${project.template}`]}">
            ${this.renderContent(project.content)}
          </div>
        </div>
      `).join('')}
    `

    this.elements = {
      wrapper: this.element.querySelectorAll('.Wrapper'),
      images: this.element.querySelectorAll('.Image'),
      loader: this.element.querySelectorAll('.Loader')
    }

    this.projects = []

    this.setup()
  }

  renderButton (url) {
    if (!url) {
      return ''
    }

    return `
      <a href="${url}" target="_blank" class="${styles.button}">
        <span class="ButtonTop ${styles.button__border} ${styles['button__border--top']}"></span>
        <span class="ButtonRight ${styles.button__border} ${styles['button__border--right']}"></span>
        <span class="ButtonBottom ${styles.button__border} ${styles['button__border--bottom']}"></span>
        <span class="ButtonLeft ${styles.button__border} ${styles['button__border--left']}"></span>

        <span class="ButtonText">Launch Project</span>

        <span class="ButtonArrow ${styles.button__arrow}"></span>
      </a>
    `
  }

  renderInformations (project) {
    return `
      <div class="${styles.information}">
        <div class="Item ${styles.information__item}">
          <strong class="${styles.information__item__label}">
            Category
          </strong>

          <span class="${styles.information__item__description}">
            ${project.category}
          </span>
        </div>

        <div class="Item ${styles.information__item}">
          <strong class="${styles.information__item__label}">
            Date
          </strong>

          <span class="${styles.information__item__description}">
            ${project.date}
          </span>
        </div>

        <div class="Item ${styles.information__item}">
          <strong class="${styles.information__item__label}">
            Role
          </strong>

          <span class="${styles.information__item__description}">
            ${project.role}
          </span>
        </div>

        <div class="Item ${styles.information__item}">
          <strong class="${styles.information__item__label}">
            Company
          </strong>

          <span class="${styles.information__item__description}">
            ${project.company}
          </span>
        </div>

        <div class="Item ${styles.information__item}">
          <strong class="${styles.information__item__label}">
            Client
          </strong>

          <span class="${styles.information__item__description}">
            ${project.client}
          </span>
        </div>

        <div class="Item ${styles.information__item}">
          <strong class="${styles.information__item__label}">
            Technologies
          </strong>

          <span class="${styles.information__item__description}">
            ${project.technologies}
          </span>
        </div>
      </div>
    `
  }

  renderAwards (awards) {
    if (!awards) {
      return ''
    }

    return `
      <div class="Item ${styles.awards}">
        <h2 class="${styles.awards__title}">
          Awards
        </h2>

        <div class="${styles.awards__list}">
          ${map(awards, award => `
            <div class="${styles.awards__item}">
              <img class="${styles.awards__item__image}" src="${award.image}">

              <span class="${styles.awards__item__description}">
                ${award.description}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  renderApps (apps) {
    if (!apps) {
      return ''
    }

    return `
      <div class="Item ${styles.apps}">
        <h2 class="${styles.apps__title}">
          Stores
        </h2>

        <div class="${styles.apps__list}">
          ${map(apps, app => `
            <div class="${styles.apps__item}">
              <a href="${app.link}" target="_blank">
                <img class="${styles.apps__item__image}" src="${app.image}">
              </a>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  renderContent (content) {
    const html = content.map(content => {
      if (content.type === 'screenshot') {
        return `
          <div class="Media ${styles.screenshot}">
            <div class="${styles.screenshot__box}" style="max-width: ${content.width}px;">
              <span class="Loader ${styles.screenshot__loader}">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span
                class="${styles.screenshot__placeholder}"
                style="padding-top: ${content.height / content.width * 100}%;"
              >
                <img data-src="${content.source}" class="Image ${styles.screenshot__image}">
              </span>
            </div>
          </div>
        `
      }

      if (content.type === 'portrait') {
        return `
          <div class="Media ${styles.portrait}">
            <div class="${styles.portrait__box}" style="max-width: ${content.width}px;">
              <span class="Loader ${styles.portrait__loader}">
                <span></span>
                <span></span>
                <span></span>
              </span>

              <span
                class="${styles.portrait__placeholder}"
                style="padding-top: ${content.height / content.width * 100}%;"
              >
                <img data-src="${content.source}" class="Image ${styles.portrait__image}">
              </span>
            </div>
          </div>
        `
      }

      if (content.type === 'landscape') {
        return `
          <div class="Media ${styles.landscape}">
            <div class="${styles.landscape__box}" style="max-width: ${content.width}px;">
              <span class="Loader ${styles.landscape__loader}">
                <span></span>
                <span></span>
                <span></span>
              </span>

              <span
                class="${styles.landscape__placeholder}"
                style="padding-top: ${content.height / content.width * 100}%;"
              >
                <img data-src="${content.source}" class="Image ${styles.landscape__image}">
              </span>
            </div>
          </div>
        `
      }
    })

    return html.join('')
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
