import { generateUUID } from "../../../../common/utils/common"
import { SvgRole } from "./LabelingCore"
import labelNS from "./labeling-tool/labelNS"

export class Label {
  private readonly _svgNs = "http://www.w3.org/2000/svg"
  private readonly _g: SVGGElement
  private readonly _rect: SVGRectElement
  private readonly _id: string
  private _name = ""
  private _x: number
  private _y: number
  private _width = 0
  private _height = 0
  private _degree = 0
  private _rotateX = 0
  private _rotateY = 0
  private _scale: number
  private _color = "#5c6dda"
  private _selected = false

  //   9
  // 0 1 2
  // 7 8 3
  // 6 5 4
  private readonly _HANDLER_CURSOR_LIST = [
    "nw-resize",
    "n-resize",
    "ne-resize",
    "e-resize",
    "se-resize",
    "s-resize",
    "sw-resize",
    "w-resize",
  ]

  constructor(x = 0, y = 0, scale = 1) {
    this._id = generateUUID()
    this._x = x
    this._y = y
    this._scale = scale
    this._g = document.createElementNS(this._svgNs, "g") as SVGGElement
    this._g.setAttribute("transform", `translate(${x} ${y}) scale(${scale}) rotate(0 0 0)`)
    this._g.id = this._id
    this._rect = document.createElementNS(this._svgNs, "rect") as SVGRectElement
    this._rect.setAttribute("width", this._width.toString())
    this._rect.setAttribute("height", this._height.toString())
    this._rect.setAttribute("fill", this._color)
    this._rect.setAttribute("fill-opacity", "0.2")
    this._rect.setAttribute("stroke", this._color)
    this._rect.setAttribute("stroke-width", "3")
    this._rect.dataset.role = SvgRole.LabelBody
    this._g.appendChild(this._rect)
  }

  get id() {
    return this._id
  }

  get name() {
    return this._name
  }

  set name(name) {
    this._name = name
  }

  get g() {
    return this._g
  }

  get rect() {
    return this._rect
  }

  get x() {
    return this._x
  }

  set x(x) {
    this._x = x
    this._g.setAttribute(
      "transform",
      `translate(${x} ${this._y}) scale(${this._scale}) rotate(${this._degree} ${this._rotateX} ${this._rotateY})`,
    )
  }

  get y() {
    return this._y
  }

  set y(y) {
    this._y = y
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${y}) scale(${this._scale}) rotate(${this._degree} ${this._rotateX} ${this._rotateY})`,
    )
  }

  get width() {
    return this._width
  }

  set width(width) {
    this._width = width
    this._rotateX = width * 0.5
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${this._y}) scale(${this._scale}) rotate(${this._degree} ${this._rotateX} ${this._rotateY})`,
    )
    this._rect.setAttribute("width", width.toString())
  }

  get height() {
    return this._height
  }

  set height(height) {
    this._height = height
    this._rotateY = height * 0.5
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${this._y}) scale(${this._scale}) rotate(${this._degree} ${this._rotateX} ${this._rotateY})`,
    )
    this._rect.setAttribute("height", height.toString())
  }

  get scale() {
    return this._scale
  }

  set scale(scale: number) {
    this._scale = scale
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${this._y}) scale(${scale}) rotate(${this._degree} ${this._rotateX} ${this._rotateY})`,
    )
  }

  get degree() {
    return this._degree
  }

  set degree(degree) {
    this._degree = degree
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${this._y}) scale(${this._scale}) rotate(${degree} ${this._rotateX} ${this._rotateY})`,
    )
  }

  get rotateX() {
    return this._rotateX
  }

  get rotateY() {
    return this._rotateY
  }

  get selected() {
    return this._selected
  }

  set selected(selected) {
    if (this._selected === selected) return
    this._selected = selected
    if (selected) {
      this.createHandlers()
    } else {
      this.removeHandlers()
    }
  }

  get color() {
    return this._color
  }

  set color(color) {
    this._color = color
    this._rect.setAttribute("fill", color)
    this._rect.setAttribute("stroke", color)
  }

  private createHandlers = () => {
    const halfOfWidth = this._width * 0.5
    const halfOfHeight = this._height * 0.5

    const line = document.createElementNS(this._svgNs, "line")
    line.setAttribute("x1", halfOfWidth.toString())
    line.setAttribute("y1", "0")
    line.setAttribute("x2", halfOfWidth.toString())
    line.setAttribute("y2", "-25")
    line.setAttribute("stroke", this._color)
    line.setAttribute("stroke-width", "3")
    this._g.appendChild(line)

    const circle = document.createElementNS(this._svgNs, "circle")
    circle.setAttribute("cx", halfOfWidth.toString())
    circle.setAttribute("cy", "-25")
    circle.setAttribute("r", "5")
    circle.setAttribute("cursor", "crosshair")
    circle.setAttribute("fill", "white")
    circle.setAttribute("stroke", this._color)
    circle.setAttribute("stroke-width", "3")
    circle.dataset.role = SvgRole.Rotator
    this._g.appendChild(circle)

    const anchorPosXList = [
      -7,
      halfOfWidth - 5,
      this._width - 3,
      this._width - 3,
      this._width - 3,
      halfOfWidth - 5,
      -7,
      -7,
    ]
    const anchorPosYList = [
      -7,
      -7,
      -7,
      halfOfHeight - 5,
      this._height - 3,
      this._height - 3,
      this._height - 3,
      halfOfHeight - 5,
    ]
    for (let i = 0; i < 8; i++) {
      const anchor = document.createElementNS(this._svgNs, "rect")
      anchor.setAttribute("x", anchorPosXList[i].toString())
      anchor.setAttribute("y", anchorPosYList[i].toString())
      anchor.setAttribute("cursor", this._HANDLER_CURSOR_LIST[i])
      anchor.setAttribute("width", "10")
      anchor.setAttribute("height", "10")
      anchor.setAttribute("fill", "white")
      anchor.setAttribute("stroke", this._color)
      anchor.setAttribute("stroke-width", "3")
      anchor.dataset.role = SvgRole.Resizer
      anchor.dataset.cursor = this._HANDLER_CURSOR_LIST[i]
      anchor.dataset.sequence = i.toString()
      this._g.appendChild(anchor)
    }

    // let nameLen = 0
    // if (label.dataset.name) {
    //   nameLen = label.dataset.name.length
    //   nameLen *= 5
    // }
    //
    // const infoBox = document.createElementNS(this._svgNs, "rect")
    // infoBox.setAttribute("x", width + 23)
    // infoBox.setAttribute("y", height + 5)
    // infoBox.setAttribute("rx", 5)
    // infoBox.setAttribute("ry", 5)
    // infoBox.setAttribute("width", 70 + nameLen)
    // if (!label.dataset.name) {
    //   infoBox.setAttribute("height", 36)
    // } else {
    //   infoBox.setAttribute("height", 50)
    // }
    // infoBox.setAttribute("fill", "white")
    // infoBox.setAttribute("filter", "url(#f1)")
    // infoBox.classList.add("infoBox")
    // label.appendChild(infoBox)
    //
    // const infoTxt = document.createElementNS(this._svgNs, "text")
    // infoTxt.setAttribute("y", height + 5)
    //
    // const tspan0 = document.createElementNS(this._svgNs, "tspan")
    // tspan0.setAttribute("x", width + 30)
    // tspan0.setAttribute("dy", 15)
    // tspan0.setAttribute("font-size", 11)
    // tspan0.setAttribute("font-weight", 600)
    // tspan0.setAttribute("cursor", "default")
    //
    // const tspan1 = document.createElementNS(this._svgNs, "tspan")
    // tspan1.setAttribute("x", width + 30)
    // tspan1.setAttribute("dy", 15)
    // tspan1.setAttribute("font-size", 10)
    // tspan1.setAttribute("cursor", "default")
    // tspan1.setAttribute("draggable", "false")
    //
    // const tspan2 = document.createElementNS(this._svgNs, "tspan")
    // tspan2.setAttribute("x", width + 30)
    // tspan2.setAttribute("dy", 14)
    // tspan2.setAttribute("font-size", 10)
    // tspan2.setAttribute("cursor", "default")
    //
    // tspan0.innerHTML = label.dataset.name
    // tspan1.innerHTML = `W ${width}`
    // tspan2.innerHTML = `H ${height}`
    //
    // infoTxt.appendChild(tspan0)
    // infoTxt.appendChild(tspan1)
    // infoTxt.appendChild(tspan2)
    //
    // label.appendChild(infoTxt)
  }

  private removeHandlers = () => {
    for (let i = this._g.childElementCount - 1; i > 0; i--) {
      this._g.removeChild(this._g.children[i])
    }
  }

  moveHandlers = () => {
    const width = this._width
    const height = this._height
    const halfOfWidth = width * 0.5
    const halfOfHeight = height * 0.5
    const anchorPosXList = [-7, halfOfWidth - 5, width - 3, width - 3, width - 3, halfOfWidth - 5, -7, -7]
    const anchorPosYList = [-7, -7, -7, halfOfHeight - 5, height - 3, height - 3, height - 3, halfOfHeight - 5]
    let i = 0
    let anchor = this._rect.nextElementSibling
    while (anchor) {
      switch (anchor.tagName) {
        case labelNS.tagNm.RECT:
          if (anchor.classList.contains("infoBox")) {
            anchor.setAttribute("x", (width + 23).toString())
            anchor.setAttribute("y", (height + 5).toString())
          } else {
            anchor.setAttribute("x", anchorPosXList[i].toString())
            anchor.setAttribute("y", anchorPosYList[i].toString())
            i++
          }
          break
        case labelNS.tagNm.LINE:
          anchor.setAttribute("x1", halfOfWidth.toString())
          anchor.setAttribute("x2", halfOfWidth.toString())
          break
        case labelNS.tagNm.CIRCLE:
          anchor.setAttribute("cx", halfOfWidth.toString())
          break
        case labelNS.tagNm.TEXT:
          anchor.setAttribute("y", (height + 5).toString())
          const children = anchor.children
          for (let i = 0; i < children.length; i++) {
            children[i].setAttribute("x", (width + 30).toString())
          }
          break
        case labelNS.tagNm.FOREIGNOBJECT:
          anchor.setAttribute("x", (width + 20).toString())
          break
      }
      anchor = anchor.nextElementSibling
    }
  }
}
