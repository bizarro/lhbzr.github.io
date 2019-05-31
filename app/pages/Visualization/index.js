import { Group } from 'three'

import { Analyser } from 'classes/Analyser'
import Page from 'classes/Page'

import Triangle from './Triangle'

export default class Visualization extends Page {
  constructor () {
    super({
      element: null,
      name: 'Visualization',
      url: '/'
    })

    this.wrapper = new Group()

    for (let index = 0; index < 100; index++) {
      const triangle = new Triangle({ index })

      this.wrapper.add(triangle)
    }
  }

  async show () {
    await new Promise(resolve => {
      Promise.all(
        this.wrapper.children.map((triangle) => {
          return triangle.appear()
        })
      ).then(() => resolve())
    })
  }

  async hide () {
    await new Promise(resolve => {
      Promise.all(
        this.wrapper.children.map((triangle) => {
          return triangle.disappear()
        })
      ).then(() => resolve())
    })
  }

  update () {
    const frequencies = Analyser.getFrequency()

    this.wrapper.rotation.z += 0.0075

    this.wrapper.children.forEach((triangle, index) => {
      triangle.update({
        frequency: frequencies[index]
      })
    })
  }
}
