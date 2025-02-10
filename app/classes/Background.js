import { PlaneBufferGeometry, Points, RepeatWrapping, ShaderMaterial, TextureLoader } from 'three'

import GSAP from 'gsap'

import FragmentShader from '../shaders/background-frag.glsl'
import VertexShader from '../shaders/background-vert.glsl'

import image from 'assets/texture/particle.png'

export default class Background extends Points {
  constructor({ size }) {
    super()

    this.height = size * 2
    this.width = size * 2

    this.velocity = 0.01

    this.geometryCreate()
    this.textureCreate()
    this.materialCreate()
  }

  geometryCreate() {
    this.geometry = new PlaneBufferGeometry(this.width, this.height, this.height / 8, this.width / 8)

    this.position.z = -100
  }

  textureCreate() {
    this.texture = new TextureLoader().load(image)
    this.texture.premultiplyAlpha = true
    this.texture.repeat.set(1, 1)
    this.texture.wrapS = RepeatWrapping
    this.texture.wrapT = RepeatWrapping
  }

  materialCreate() {
    this.material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        image: {
          value: this.texture,
        },
        multiplier: {
          value: 0,
        },
        time: {
          value: 0,
        },
      },
      fragmentShader: FragmentShader,
      vertexShader: VertexShader,
      depthTest: false,
      depthWrite: false,
    })
  }

  show() {
    GSAP.to(this.overlay.material, 1, { opacity: 1 })
  }

  hide() {
    GSAP.to(this.overlay.material, 1, { opacity: 0 })
  }

  update() {
    this.material.uniforms.time.value += this.velocity
  }

  onRoute(route) {
    if (route === '/about') {
      GSAP.to(this.material.uniforms.multiplier, {
        duration: 2,
        value: 1,
      })

      GSAP.to(this.position, {
        duration: 1,
        y: -this.height / 4,
      })

      GSAP.to(this.rotation, {
        duration: 1,
        x: -Math.PI / 2,
      })

      GSAP.to(this, {
        duration: 2,
        velocity: 0.005,
      })
    } else {
      GSAP.to(this.material.uniforms.multiplier, {
        duration: 1,
        value: 0,
      })

      GSAP.to(this.position, {
        duration: 1,
        y: 0,
      })

      GSAP.to(this.rotation, {
        duration: 1,
        x: 0,
      })

      GSAP.to(this, {
        duration: 1,
        velocity: 0.01,
      })
    }
  }
}
