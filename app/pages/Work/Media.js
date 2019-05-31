import EventEmitter from 'events'

import {
  AdditiveBlending,
  Color,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PlaneBufferGeometry,
  ShaderMaterial,
  Texture,
  TextureLoader
} from 'three'

import { Detection } from 'classes/Detection'

import ImageFragmentShader from 'shaders/image-frag.glsl'
import ImageVertexShader from 'shaders/image-vert.glsl'

import OverlayFragmentShader from 'shaders/overlay-frag.glsl'
import OverlayVertexShader from 'shaders/overlay-vert.glsl'

import TitleFragmentShader from 'shaders/title-frag.glsl'
import TitleVertexShader from 'shaders/title-vert.glsl'

import { trim } from 'utils/canvas'

export default class Media extends Group {
  constructor ({ color, index, image, renderer, size, slug, title }) {
    super()

    this.isActive = false

    this.events = new EventEmitter()

    this.color = new Color(color)
    this.index = index
    this.slug = slug
    this.renderer = renderer
    this.text = title

    this.image = new TextureLoader().load(image, () => {
      this.image.generateMipmaps = false
      this.image.minFilter = LinearFilter
      this.image.needsUpdate = true
      this.image.premultiplyAlpha = true

      this.renderer.setTexture2D(this.image)
    })

    this.height = size * 0.563333333 // Ratio
    this.multiplier = 10
    this.noise = 50
    this.opacity = 0
    this.padding = size * 0.1
    this.width = size

    this.position.x += index * (this.width + this.padding)

    this.hoverCreate()
    this.mediaCreate()
    this.overlayCreate()
  }

  hoverCreate () {
    this.hoverGeometry = new PlaneBufferGeometry(this.width, this.height, 1, 1)

    this.hoverMaterial = new MeshBasicMaterial({
      opacity: 0,
      transparent: true
    })

    this.hover = new Mesh(this.hoverGeometry, this.hoverMaterial)
    this.hover.position.z += 15

    this.add(this.hover)
  }

  mediaCreate () {
    this.mediaGeometry = new PlaneBufferGeometry(this.width, this.height, 100, 100)

    this.mediaMaterial = new ShaderMaterial({
      uniforms: {
        alpha: {
          value: this.opacity
        },
        image: {
          value: this.image
        },
        multiplier: {
          value: this.multiplier
        },
        noise: {
          value: this.noise
        },
        time: {
          value: 0
        }
      },
      transparent: true,
      fragmentShader: ImageFragmentShader,
      vertexShader: ImageVertexShader
    })

    this.media = new Mesh(this.mediaGeometry, this.mediaMaterial)

    this.add(this.media)
  }

  overlayCreate () {
    this.overlayGeometry = new PlaneBufferGeometry(this.width, this.height, 100, 100)

    this.overlayMaterial = new ShaderMaterial({
      blending: AdditiveBlending,
      uniforms: {
        alpha: {
          value: this.opacity
        },
        color: {
          value: this.color
        },
        multiplier: {
          value: this.multiplier
        },
        noise: {
          value: this.noise
        },
        time: {
          value: 0
        },
        isMobile: {
          value: Detection.isMobile() ? 1 : 0
        }
      },
      transparent: true,
      fragmentShader: OverlayFragmentShader,
      vertexShader: OverlayVertexShader
    })

    this.overlay = new Mesh(this.overlayGeometry, this.overlayMaterial)

    this.add(this.overlay)
  }

  titleCreate () {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.height = window.innerHeight * 3
    canvas.width = window.innerWidth * 3

    context.fillStyle = '#fff'
    context.font = '80px Borda'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(this.text, canvas.width / 2, canvas.height / 2)

    const canvasTrimmed = trim(canvas)

    this.titleGeometry = new PlaneBufferGeometry(canvasTrimmed.width / 8, canvasTrimmed.height / 8, 100, 100)

    this.titleTexture = new Texture(canvasTrimmed)
    this.titleTexture.generateMipmaps = false
    this.titleTexture.minFilter = LinearFilter
    this.titleTexture.needsUpdate = true
    this.titleTexture.premultiplyAlpha = true

    this.renderer.setTexture2D(this.titleTexture)

    this.titleMaterial = new ShaderMaterial({
      blending: AdditiveBlending,
      uniforms: {
        alpha: {
          value: this.opacity
        },
        image: {
          value: this.titleTexture
        },
        multiplier: {
          value: this.multiplier
        },
        noise: {
          value: this.noise
        },
        time: {
          value: 0
        }
      },
      transparent: true,
      fragmentShader: TitleFragmentShader,
      vertexShader: TitleVertexShader
    })

    this.title = new Mesh(this.titleGeometry, this.titleMaterial)

    this.title.position.y -= this.height / 2 + 15
    this.title.position.z += 15

    this.add(this.title)
  }

  onClick () {
    this.events.emit('select', this.slug)
  }

  enable () {
    this.isActive = true
  }

  disable () {
    this.isActive = false
  }

  update ({ opacity }) {
    this.opacity = opacity

    this.overlay.material.uniforms.alpha.value = this.opacity
    this.media.material.uniforms.alpha.value = this.opacity

    if (this.title) {
      this.title.material.uniforms.alpha.value = this.opacity
    }

    if (this.isActive) {
      this.media.material.uniforms.time.value += 0.005
      this.overlay.material.uniforms.time.value += 0.005

      if (this.title) {
        this.title.material.uniforms.time.value += 0.005
      }
    }
  }
}
