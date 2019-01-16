import AutoBind from 'auto-bind'

import './styles/base.scss'

import './classes/Rotation'
import './classes/Unsupported'

import {
  Color,
  DirectionalLight,
  Math as THREEMath,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from 'three'

import { compact, each, map } from 'lodash'

import Stats from 'stats.js'

import About from './pages/About'
import Project from './pages/Project'
import Visualization from './pages/Visualization'
import Work from './pages/Work'

import { URLS } from './data/URL'

import Background from './classes/Background'
import { Detection } from './classes/Detection'

import Cursor from './components/Cursor'
import Logo from './components/Logo'
import Menu from './components/Menu'
import Player from './components/Player'
import Preloader from './components/Preloader'

class App {
  constructor () {
    AutoBind(this)

    this.elements = []
    this.pages = []

    this.url = ''

    this.height = window.innerHeight
    this.width = window.innerWidth

    this.createCursor()
    this.createPreloader()

    this.createRenderer()
    this.createScene()
    this.createLights()

    this.createVisualization()
    this.createAbout()
    this.createWork()
    this.createProject()

    this.createBackground()
    this.createLogo()
    this.createMenu()
    this.createPlayer()

    this.setup()

    if (IS_DEVELOPMENT) {
      this.createStats()
    }

    this.render()

    this.addEventListeners()
  }

  setup () {
    each(this.pages, page => {
      if (page.on) page.on('change', this.onChange)
    })

    each(this.elements, element => {
      if (element.on) element.on('change', this.onChange)
    })
  }

  createCursor () {
    if (!Detection.isMobile() && !Detection.isTablet()) {
      this.cursor = new Cursor()
    }
  }

  createPreloader () {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        this.preloader = new Preloader()
        this.preloader.on('preloaded', this.onPreloaded)
      })
    })
  }

  createRenderer () {
    this.renderer = new WebGLRenderer()

    this.renderer.setSize(this.width, this.height)
    this.renderer.context.getShaderInfoLog = () => ''

    document.body.appendChild(this.renderer.domElement)
  }

  createScene () {
    this.scene = new Scene()

    this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 10000)
    this.camera.position.z = 300

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    this.camera.position.z = 300

    const distance = this.camera.position.z
    const fov = THREEMath.degToRad(this.camera.fov)
    const height = 2 * Math.tan(fov / 2) * distance
    const width = height * this.camera.aspect

    this.size = width
  }

  createLights () {
    this.lightColor = new Color('#fff')

    this.lightOne = new DirectionalLight(this.lightColor, 1)
    this.lightOne.position.set(1, 1, 1)

    this.lightTwo = new DirectionalLight(this.lightColor, 1)
    this.lightTwo.position.set(-1, -1, 1)

    this.scene.add(this.lightOne)
    this.scene.add(this.lightTwo)
  }

  createVisualization () {
    this.visualization = new Visualization()

    this.scene.add(this.visualization.wrapper)

    this.pages.push(this.visualization)
  }

  createAbout () {
    this.about = new About()

    this.pages.push(this.about)
  }

  createWork () {
    this.work = new Work({
      camera: this.camera,
      size: Math.min(this.size * 0.8, 300)
    })

    this.scene.add(this.work.wrapper)

    this.pages.push(this.work)
  }

  createProject () {
    this.project = new Project()

    this.pages.push(this.project)
  }

  createBackground () {
    this.background = new Background({
      size: this.size
    })

    this.scene.add(this.background)

    this.elements.push(this.background)
  }

  createLogo () {
    this.logo = new Logo()

    this.elements.push(this.logo)
  }

  createMenu () {
    this.menu = new Menu()

    this.elements.push(this.menu)
  }

  createPlayer () {
    this.player = new Player()

    this.elements.push(this.player)
  }

  createStats () {
    this.stats = new Stats()

    document.body.appendChild(this.stats.domElement)
  }

  onPreloaded () {
    const url = window.location.pathname.replace(/\/$/, '') || '/'

    each(this.elements, element => {
      if ((element.appear && url === '/') || element.name === 'Logo') element.show()
    })

    this.work.activate()

    this.onChange(url)
  }

  onChange (url, push = true) {
    if (this.isAnimating || this.url === url) return

    if (URLS.indexOf(url) === -1) {
      url = '/'
    }

    this.isAnimating = true

    this.logo.disable()
    this.menu.disable()

    let promises = map(this.pages, page => {
      if ((page.url !== '/' && this.url.indexOf(page.url) !== -1) || page.url === this.url) {
        return page.hide()
      }
    })

    promises = compact(promises)

    each(this.elements, element => {
      element.onRoute(url)
    })

    this.url = url

    Promise.all(promises).then(() => {
      this.isAnimating = false

      this.logo.enable()
      this.menu.enable()

      each(this.pages, page => {
        if ((page.url !== '/' && url.indexOf(page.url) !== -1) || page.url === url) {
          page.show()
        }
      })

      if (push) {
        window.history.pushState({ page: this.url }, 'Luis Henrique Bizarro — Creative Front End Developer', this.url)
      }

      if (this.cursor) {
        this.cursor.update()
      }
    })
  }

  onResize () {
    this.height = window.innerHeight
    this.width = window.innerWidth

    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()

    this.renderer.clear()
    this.renderer.setSize(this.width, this.height)
  }

  onPopState (event) {
    this.onChange(window.location.pathname, false)
  }

  render () {
    if (this.stats) {
      this.stats.begin()
    }

    this.renderer.render(this.scene, this.camera)

    this.background.update()
    this.visualization.update()
    this.work.update()

    if (this.stats) {
      this.stats.end()
    }

    this.frame = window.requestAnimationFrame(this.render)
  }

  addEventListeners () {
    window.addEventListener('popstate', this.onPopState)
    window.addEventListener('resize', this.onResize)
  }

  removeEventListeners () {
    window.removeEventListener('popstate', this.onPopState)
    window.removeEventListener('resize', this.onResize)
  }
}

new App()
