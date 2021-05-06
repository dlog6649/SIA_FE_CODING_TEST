import { Coordinate } from "./LabelingBoard"

export class SvgImage {
  private readonly _svgNs = "http://www.w3.org/2000/svg"
  private _image: SVGImageElement
  private _coordinate: Coordinate
  private _scale: number

  constructor(url = "", coordinate: Coordinate = { x: 0, y: 0 }, scale = 1) {
    const image = document.createElementNS(this._svgNs, "image")
    image.setAttribute("transform", `translate(${coordinate.x} ${coordinate.y}) scale(${scale})`)
    image.setAttribute("href", url)
    image.setAttribute("alt", "sampleImg")
    this._image = image
    this._coordinate = coordinate
    this._scale = scale
  }

  get image() {
    return this._image
  }

  set imageUrl(it: string) {
    this._image.setAttribute("href", it)
  }

  set scale(it: number) {
    this._scale = it
  }

  setAttributes = () => {
    this._image.setAttribute(
      "transform",
      `translate(${this._coordinate.x} ${this._coordinate.y}) scale(${this._scale})`,
    )
  }
}

// TODO: create svg element creator class and extends it by image, foreignObject, rect, polygon, etc.
