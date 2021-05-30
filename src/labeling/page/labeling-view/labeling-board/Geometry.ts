import Shape from "./Shape"
import { Coordinate } from "./types"

export default abstract class Geometry implements Shape {
  constructor(private _coordinates: Coordinate[]) {}

  getCoordinates = () => {
    return this._coordinates
  }
}
