import Geometry from "./Geometry"
import { Coordinate } from "./types"

export default class Rectangle extends Geometry {
  constructor(coordinates: Coordinate[], private _angle = 0) {
    super(coordinates)
  }

  get center() {
    const coords = this.getCoordinates()
    return { x: 0, y: 0 }
  }

  getCenter = (p1: Coordinate, p2: Coordinate) => ({
    x: (p1.x + p2.x) * 0.5,
    y: (p1.y + p2.y) * 0.5,
  })
}
