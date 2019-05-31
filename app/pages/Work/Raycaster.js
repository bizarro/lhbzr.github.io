import { Raycaster } from 'three'

export default class Raycast extends Raycaster {
  constructor({ camera, objects }) {
    super()

    this.camera = camera
    this.objects = objects
  }

  check (x, y) {
    x = +(x / window.innerWidth) * 2 - 1
    y = -(y / window.innerHeight) * 2 + 1

    this.setFromCamera({ x, y }, this.camera)

    const intersections = this.intersectObjects(this.objects, true).map(intersection => {
      return intersection.object.parent
    })

    const intersection = intersections[0] ? intersections[0] : null

    return intersection
  }

  onClick (x, y) {
    const intersection = this.check(x, y)

    if (intersection) {
      intersection.onClick()
    }
  }
}
