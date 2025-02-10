import GSAP from 'gsap'
import { each } from 'lodash'

import Page from 'classes/Page'

import { split, calculate } from 'utils/text'

import styles from './styles.scss'
import view from './view.pug'

export default class extends Page {
  constructor() {
    super({
      element: 'section',
      name: 'About',
      url: '/about',
    })

    const socials = [
      {
        label: 'Twitter',
        url: 'https://www.twitter.com/bizar_ro/',
      },
      {
        label: 'GitHub',
        url: 'https://www.github.com/bizarro/',
      },
      {
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/luis-bizarro/',
      },
      {
        label: 'Inquiries',
        url: 'https://bizar.ro/#inquiries',
      },
    ]

    this.element.className = `About ${styles.about}`
    this.element.innerHTML = view({
      title: 'Title',
      socials,
      styles,
    })

    this.elements = {
      title: this.element.querySelector('.Title'),
      description: this.element.querySelectorAll('.Description'),
      descriptionSpans: [],
      social: this.element.querySelector('.Social'),
    }

    this.setup()
  }

  setup() {
    each(this.elements.description, (description) => {
      const group = split({
        element: description,
        expression: ' ',
      })

      group.forEach((element) => {
        this.elements.descriptionSpans.push(element)
      })
    })
  }

  show() {
    const timeline = GSAP.timeline()
    const timelineAnimation = {
      duration: 1.5,
      ease: 'expo.out',
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const { descriptionSpans, social, title } = this.elements
        const spans = calculate(descriptionSpans)

        timeline.set(this.element, {
          autoAlpha: 1,
        })

        timeline.fromTo(
          title,
          {
            autoAlpha: 0,
            y: 50,
          },
          {
            ...timelineAnimation,
            autoAlpha: 1,
            y: 0,
          },
        )

        spans.forEach((span, index) => {
          timeline.fromTo(
            span,
            {
              autoAlpha: 0,
              y: 50,
            },
            {
              ...timelineAnimation,
              autoAlpha: 1,
              delay: 0.05 * index,
              y: 0,
            },
            0.05,
          )
        })

        timeline.fromTo(
          social,
          {
            autoAlpha: 0,
            y: 50,
          },
          {
            ...timelineAnimation,
            autoAlpha: 1,
            y: 0,
          },
          0.05 + spans.length * 0.05,
        )
      })
    })

    return super.show(timeline)
  }

  hide() {
    const { descriptionSpans, social, title } = this.elements
    const spans = calculate(descriptionSpans)

    const timeline = GSAP.timeline()
    const timelineAnimation = {
      duration: 0.6,
      ease: 'expo.out',
    }

    timeline.to(title, {
      ...timelineAnimation,
      autoAlpha: 0,
      y: -50,
    })

    spans.forEach((span, index) => {
      timeline.to(
        span,
        {
          ...timelineAnimation,
          autoAlpha: 0,
          delay: index * 0.05,
          y: -50,
        },
        0.05,
      )
    })

    timeline.to(
      social,
      {
        ...timelineAnimation,
        autoAlpha: 0,
        y: -50,
      },
      0.05 + spans.length * 0.05,
    )

    timeline.set(this.element, {
      autoAlpha: 0,
    })

    return super.hide(timeline)
  }
}
