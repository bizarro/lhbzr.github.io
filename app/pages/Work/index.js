import Page from 'classes/Page'

import {
  Group,
  Vector3
} from 'three'

import {
  clamp,
  each,
  debounce,
  inRange,
  map
} from 'lodash'

import {
  TimelineMax
} from 'gsap'

import Media from './Media'
import Projects from 'data/Work'
import Raycaster from './Raycaster'

export default class extends Page {
  constructor ({ camera, renderer, size }) {
    super({
      element: null,
      name: 'Work',
      url: '/work'
    })

    this.wrapper = new Group()

    this.projects = Projects
    this.projectsLength = this.projects.length - 1

    each(Projects, (work, index) => {
      const media = new Media({
        brand: work.brand,
        color: work.color,
        index,
        image: work.image,
        renderer,
        size,
        slug: work.slug,
        title: work.title
      })

      media.events.on('select', this.onSelect)

      this.wrapper.add(media)
    })

    this.opacity = 0

    this.width = this.wrapper.children[0].width + this.wrapper.children[0].padding
    this.widthMinimum = 0
    this.widthMaximum = -this.width * this.projectsLength

    this.objects = map(this.wrapper.children, child => child.hover)

    this.raycaster = new Raycaster({
      camera,
      objects: this.objects
    })

    this.index = 0

    this.x = {
      start: 0,
      end: 0,
      target: 0,
      position: 0
    }

    this.y = {
      start: null,
      end: null
    }

    this.onCheckDebounce = debounce(this.onCheck, 400)
  }

  getSpacing (camera) {
    const child = this.wrapper.children[0]
    const childPosition = child.getWorldPosition()

    const projection = new Vector3(0, childPosition.y + child.height / 2, 0).project(camera)

    return -(projection.y - 1) / 2 * window.innerHeight
  }

  activate () {
    each(this.wrapper.children, child => child.titleCreate())
  }

  show () {
    const timeline = new TimelineMax({
      onStart: () => (this.isActive = true)
    })

    timeline.set(this.wrapper.position, { x: this.widthMaximum })

    timeline.to(this, 1, {
      opacity: 1
    }, 'start')

    timeline.fromTo(this.x, 1, {
      target: this.widthMaximum
    }, {
      target: -this.width * this.index
    }, 'start')

    return super.show(timeline)
  }

  hide () {
    const timeline = new TimelineMax({
      onComplete: () => (this.isActive = false)
    })

    timeline.to(this, 0.5, {
      opacity: 0
    })

    return super.hide(timeline)
  }

  update () {
    this.index = Math.abs(Math.round(this.wrapper.position.x / this.width))

    each(this.wrapper.children, (child, index) => {
      child.update({
        opacity: this.opacity
      })

      if (index === this.index || index === this.index - 1 || index === this.index + 1) {
        child.enable()
      } else {
        child.disable()
      }
    })

    this.wrapper.position.x += (this.x.target - this.wrapper.position.x) * 0.05
  }

  onDown (event) {
    if (!this.isActive) return

    this.isDown = true

    this.x.position = this.wrapper.position.x
    this.x.start = event.touches ? event.touches[0].clientX : event.clientX
    this.y.start = event.touches ? event.touches[0].clientY : event.clientY
  }

  onMove (event) {
    if (!this.isActive || !this.isDown) return

    this.x.end = event.touches ? event.touches[0].clientX : event.clientX
    this.y.end = event.touches ? event.touches[0].clientY : event.clientY

    this.x.target = this.x.position + (this.x.end - this.x.start)
    this.x.target = clamp(this.x.target, this.widthMaximum, this.widthMinimum)
  }

  onUp (event) {
    this.isDown = false

    if (!this.isActive) return

    const x = event.changedTouches ? event.changedTouches[0].clientX : event.clientX
    const y = event.changedTouches ? event.changedTouches[0].clientY : event.clientY

    const r = 35
    const isInXRange = inRange(x, this.x.start - r, this.x.start + r)
    const isInYRange = inRange(y, this.y.start - r, this.y.start + r)

    if (isInXRange && isInYRange) {
      this.raycaster.onClick(x, y)
    }

    this.onCheck()
  }

  onWheel (event) {
    if (!this.isActive) return

    let delta = event.wheelDeltaY || -event.deltaY
    let speed = 75

    if (delta < 0) speed *= -1

    this.x.target += speed
    this.x.target = clamp(this.x.target, this.widthMaximum, this.widthMinimum)

    this.onCheckDebounce()
  }

  onSelect (project) {
    this.emit('change', `/project/${project}`)
  }

  onCheck () {
    this.x.target = Math.round(this.x.target / this.width) * this.width

    if (this.x.target >= this.widthMinimum) {
      this.x.target = 0
    } else if (this.x.target <= this.widthMaximum) {
      this.x.target = this.widthMaximum
    }
  }

  addEventListeners () {
    window.addEventListener('mousedown', this.onDown)
    window.addEventListener('mousemove', this.onMove)
    window.addEventListener('mouseup', this.onUp)

    window.addEventListener('touchstart', this.onDown)
    window.addEventListener('touchmove', this.onMove)
    window.addEventListener('touchend', this.onUp)

    window.addEventListener('mousewheel', this.onWheel)
    window.addEventListener('wheel', this.onWheel)
  }

  removeEventListeners () {
    window.removeEventListener('mousedown', this.onDown)
    window.removeEventListener('mousemove', this.onMove)
    window.removeEventListener('mouseup', this.onUp)

    window.removeEventListener('touchstart', this.onDown)
    window.removeEventListener('touchmove', this.onMove)
    window.removeEventListener('touchend', this.onUp)

    window.removeEventListener('mousewheel', this.onWheel)
    window.removeEventListener('wheel', this.onWheel)
  }
}
