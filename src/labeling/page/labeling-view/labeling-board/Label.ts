import labelNS from "./labeling-tool/labelNS"
import { createAnchors } from "./labeling-tool/LabelCreator"
import { LabelMode } from "../../../../common/modules/annotator"
import * as LabelMain from "./labeling-tool/LabelMain"
import { generateUUID, parseTransform } from "../../../../common/utils/common"
import { LabelingCore } from "./LabelingCore"
import { Mode } from "../LabelingView"

export class Label {
  private readonly _g: SVGGElement
  private readonly _rect: SVGRectElement
  private readonly _id: string
  private _name = ""
  private _x: number
  private _y: number
  private _width = 0
  private _height = 0
  private _degree = 0
  private _scale: number
  private _color = "#5c6dda"
  private _selected = false
  private readonly _svgNs = "http://www.w3.org/2000/svg"

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
    this._rect.dataset.role = "label"
    this._rect.addEventListener("mousedown", this.onRectMouseDown)
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

  createHandlers = () => {
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
    // circle.addEventListener("mousedown", (evt: any) => {
    //   if (evt.button !== 0 && evt.button !== 2) return
    //   this._core.curLabel = this
    //   if (this._core.mode === Mode.Creation || this._core.isPushingSpaceBar) return
    //   evt.stopPropagation()
    //   labelNS.isDragging = true
    //   labelNS.curLabel = labelNS.selectedLabel = e.target.parentNode
    //   labelNS.selectedHandler = labelNS.LABEL_ROTATOR
    //   labelNS.startX = evt.offsetX
    //   labelNS.startY = evt.offsetY
    //
    //   const { x, y, deg, rotX, rotY } = parseTransform(labelNS.curLabel)
    //   labelNS.preX = x
    //   labelNS.preY = y
    //   labelNS.preDegree = deg
    //   labelNS.preRotX = rotX
    //   labelNS.preRotY = rotY
    //   LabelMain.deleteAnchors(evt)
    // })
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
      // anchor.addEventListener("mousedown", (evt: any) => {
      //   if (evt.button !== 0 && evt.button !== 2) {
      //     return
      //   }
      //   labelNS.curLabel = e.target.parentNode
      //   if (labelNS.mode === LabelMode.CREATE || labelNS.isPushingSpacebar) {
      //     return
      //   }
      //   console.log("anchor mousedown")
      //   e.stopPropagation()
      //   labelNS.isDragging = true
      //   labelNS.curLabel = labelNS.selectedLabel = e.target.parentNode
      //   labelNS.selectedHandler = labelNS.LABEL_RESIZE
      //   labelNS.anchor = labelNS.CURSOR_LIST[i]
      //
      //   const { x, y, deg, rotX, rotY, w, h } = parseTransform(labelNS.curLabel)
      //   labelNS.preX = x
      //   labelNS.preY = y
      //   labelNS.preDegree = deg
      //   labelNS.preRotX = rotX
      //   labelNS.preRotY = rotY
      //   labelNS.preWidth = parseFloat((w * labelNS.curScale).toFixed(2))
      //   labelNS.preHeight = parseFloat((h * labelNS.curScale).toFixed(2))
      //
      //   const theta = (Math.PI / 180) * deg
      //   const cos_t = Math.cos(theta)
      //   const sin_t = Math.sin(theta)
      //   const c0_x = x + rotX * labelNS.curScale
      //   const c0_y = y + rotY * labelNS.curScale
      //
      //   const rightSide = x + labelNS.preWidth
      //   const bottomSide = y + labelNS.preHeight
      //
      //   const q0_x_arr = [x, c0_x, rightSide, rightSide, rightSide, c0_x, x, x]
      //   const q0_y_arr = [y, y, y, c0_y, bottomSide, bottomSide, bottomSide, c0_y]
      //   const p0_x_arr = [rightSide, c0_x, x, x, x, c0_x, rightSide, rightSide]
      //   const p0_y_arr = [bottomSide, bottomSide, bottomSide, c0_y, y, y, y, c0_y]
      //
      //   const q0_x = q0_x_arr[i]
      //   const q0_y = q0_y_arr[i]
      //
      //   const p0_x = p0_x_arr[i]
      //   const p0_y = p0_y_arr[i]
      //
      //   labelNS.qp0_x = (q0_x - c0_x) * cos_t - (q0_y - c0_y) * sin_t + c0_x
      //   labelNS.qp0_y = (q0_x - c0_x) * sin_t + (q0_y - c0_y) * cos_t + c0_y
      //
      //   labelNS.pp_x = (p0_x - c0_x) * cos_t - (p0_y - c0_y) * sin_t + c0_x
      //   labelNS.pp_y = (p0_x - c0_x) * sin_t + (p0_y - c0_y) * cos_t + c0_y
      //
      //   LabelMain.deleteAnchors(e)
      // })

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

  removeHandlers = () => {
    for (let i = this._g.childElementCount - 1; i > 0; i--) {
      this._g.removeChild(this._g.children[i])
    }
  }

  onRectMouseDown = (evt: MouseEvent) => {
    console.log("dasfasdf")
    // this._selected = true
    // const LEFT_BUTTON = 0
    // const RIGHT_BUTTON = 2
    // if (evt.button !== LEFT_BUTTON && evt.button !== RIGHT_BUTTON) return
    // this._core.curLabel = this
    // if (this._core.mode === Mode.Creation || this._core.isPushingSpaceBar) return
    // evt.stopPropagation()
    // this._core.isDragging = true
    // this._core.curLabel = this
    // // labelNS.curLabel = labelNS.selectedLabel = e.target.parentNode
    // // labelNS.selectedHandler = labelNS.LABEL_BODY
    // this._core.startX = evt.offsetX
    // this._core.startY = evt.offsetY
    // if (labelNS.curLabel.childNodes.length < 3) {
    //   createAnchors(labelNS.curLabel)
    // }
    // LabelMain.deleteAnchors(evt)
    //
    // // 선택된 레이블들의 이전 정보 세팅
    // const infos = []
    // const selectedLabels = [...labelNS.svg.childNodes].filter((node) => node.classList.contains("selected"))
    // selectedLabels.forEach((label) => {
    //   const { x, y, deg, rotX, rotY } = parseTransform(label)
    //   infos.push({ id: parseInt(label.dataset.id), preX: x, preY: y, preDegree: deg, preRotX: rotX, preRotY: rotY })
    // })
    // labelNS.selectedLabelsInfo = infos
  }
}
