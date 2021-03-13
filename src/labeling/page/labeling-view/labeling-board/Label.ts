import labelNS from "./labeling-tool/labelNS"
import { createAnchors } from "./labeling-tool/LabelCreator"
import { LabelMode } from "../../../../common/modules/annotator"
import * as LabelMain from "./labeling-tool/LabelMain"
import { generateUUID } from "../../../../common/utils/common"

export class Label {
  private readonly _g: SVGGElement
  private readonly _rect: SVGRectElement
  private readonly _id = generateUUID()
  private _name = ""
  private _x: number
  private _y: number
  private _width = 0
  private _height = 0
  private _degree = 0
  private _scale: number
  private _color = "#5c6dda"
  private _selected = false

  constructor(x = 0, y = 0, scale = 1) {
    this._x = x
    this._y = y
    this._scale = scale
    this._g = document.createElementNS(labelNS.svgNS, "g") as SVGGElement
    this._g.setAttribute("transform", `translate(${x} ${y}) scale(${scale}) rotate(0 0 0)`)
    this._rect = document.createElementNS(labelNS.svgNS, "rect") as SVGRectElement
    this._rect.setAttribute("width", this._width.toString())
    this._rect.setAttribute("height", this._height.toString())
    this._rect.setAttribute("fill", this._color)
    this._rect.setAttribute("fill-opacity", "0.2")
    this._rect.setAttribute("stroke", this._color)
    this._rect.setAttribute("stroke-width", "3")
    // this._rect.addEventListener("mousedown", this.labelBodyMouseDownEvent)
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
      `translate(${x} ${this._y}) scale(${this._scale}) rotate(0 ${this._width * 0.5} ${this._height * 0.5})`,
    )
  }

  get y() {
    return this._y
  }

  set y(y) {
    this._y = y
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${y}) scale(${this._scale}) rotate(0 ${this._width * 0.5} ${this._height * 0.5})`,
    )
  }

  get width() {
    return this._width
  }

  set width(width) {
    this._width = width
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${this._y}) scale(${this._scale}) rotate(0 ${width * 0.5} ${this._height * 0.5})`,
    )
    this._rect.setAttribute("width", width.toString())
  }

  get height() {
    return this._height
  }

  set height(height) {
    this._height = height
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${this._y}) scale(${this._scale}) rotate(0 ${this._width * 0.5} ${height * 0.5})`,
    )
    this._rect.setAttribute("height", height.toString())
  }

  set scale(scale: number) {
    this._scale = scale
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${this._y}) scale(${scale}) rotate(0 ${this._width * 0.5} ${this._height * 0.5})`,
    )
  }

  get degree() {
    return this._degree
  }

  set degree(degree) {
    this._degree = degree
    this._g.setAttribute(
      "transform",
      `translate(${this._x} ${this._y}) scale(${this._scale}) 
      rotate(${degree} ${this._width * 0.5} ${this._height * 0.5})`,
    )
  }

  get selected() {
    return this._selected
  }

  set selected(selected) {
    this._selected = selected
    // createHandlers
  }

  get color() {
    return this._color
  }

  set color(color) {
    this._color = color
    this._rect.setAttribute("fill", color)
    this._rect.setAttribute("stroke", color)
  }

  // labelBodyMouseDownEvent = (e) => {
  //   if (e.button !== 0 && e.button !== 2) {
  //     return
  //   }
  //   labelNS.curLabel = e.target.parentNode
  //   if (labelNS.mode === LabelMode.CREATE || labelNS.isPushingSpacebar) {
  //     return
  //   }
  //   console.log("labelBodyMouseDownEvent")
  //   e.stopPropagation()
  //   labelNS.isDragging = true
  //   labelNS.curLabel = labelNS.selectedLabel = e.target.parentNode
  //   labelNS.selectedHandler = labelNS.LABEL_BODY
  //   labelNS.startX = e.offsetX
  //   labelNS.startY = e.offsetY
  //   if (labelNS.curLabel.childNodes.length < 3) {
  //     createAnchors(labelNS.curLabel)
  //   }
  //   LabelMain.deleteAnchors(e)
  //
  //   // 선택된 레이블들의 이전 정보 세팅
  //   const infos = []
  //   const selectedLabels = [...labelNS.svg.childNodes].filter((node) => node.classList.contains("selected"))
  //   selectedLabels.forEach((label) => {
  //     const { x, y, deg, rotX, rotY } = parseTransform(label)
  //     infos.push({ id: parseInt(label.dataset.id), preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY })
  //   })
  //   labelNS.selectedLabelsInfo = infos
  // }
}
