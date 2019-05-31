import {
  Color,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  TetrahedronGeometry
} from 'three'

import {
  TweenMax
} from 'gsap'

export default class Triangle extends Object3D {
  constructor ({ index }) {
    super()

    this.index = index

    this.geometry = new TetrahedronGeometry(50, 0)

    this.material = new MeshPhongMaterial({
      color: new Color('#fff'),
      opacity: 0,
      transparent: true,
      wireframe: true
    })

    this.triangle = new Mesh(this.geometry, this.material)
    this.triangle.position.y = 100
    this.triangle.position.z = -100

    this.rotation.z = index * (360 / 100) * Math.PI / 180

    this.add(this.triangle)
  }

  async appear () {
    return await new Promise(resolve => {
      const delay = Math.random()

      TweenMax.to(this.triangle.position, 1, {
        delay,
        overwrite: true,
        z: 0,
        onComplete: () => {
          resolve()
        }
      })

      TweenMax.to(this.material, 1, {
        delay,
        opacity: 1,
        onStart: () => {
          this.triangle.visible = true
        }
      })
    })
  }

  async disappear () {
    return await new Promise(resolve => {
      const delay = Math.random() * 0.5

      TweenMax.to(this.triangle.position, 1, {
        delay,
        overwrite: true,
        z: -100,
        onComplete: () => {
          resolve()
        }
      })

      TweenMax.to(this.material, 1, {
        delay,
        overwrite: true,
        opacity: 0,
        onComplete: () => {
          this.triangle.visible = false
        }
      })
    })
  }

  update ({ frequency }) {
    const value = Math.max(frequency / 100, 1)

    TweenMax.set(this.triangle.scale, {
      z: value
    })
  }
}
