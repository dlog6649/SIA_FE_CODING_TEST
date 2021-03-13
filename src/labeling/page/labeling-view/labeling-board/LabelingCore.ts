import { LabelMode, selectLabels } from "../../../../common/modules/annotator"
import { hideContextmenu, hideDefaultContextmenu, showContextmenu } from "./labeling-tool/LabelMenu"
import labelNS from "./labeling-tool/labelNS"
import { throttle } from "../../../../common/utils/common"
import { Mode } from "../LabelingView"
import { initializeLabel, labelBodyMouseDownEvent } from "./labeling-tool/LabelCreator"
import { dispatch, HANDLER_CURSOR_LIST } from "./LabelingBoard"
import { deleteAnchors, getSelectedLabelsIds } from "./labeling-tool/LabelMain"
import React from "react"
import { Label } from "./Label"

export class LabelingCore {
  private _svg: SVGSVGElement
  private _mode = Mode.Selection
  private _zoom = 1
  private _curLabel: Label | null = null
  private _startX = 0
  private _startY = 0
  private _isDrawing = false
  private _isDragging = false
  private _isPushingSpacebar = false
  private _labelList: Label[]
  private _setLabelList: (labelList: Label[]) => void
  private readonly _svgNs = "http://www.w3.org/2000/svg"
  private _selectedElement: "label" | "resizer" | "rotator" = "label"
  private _selectedLabelList: { label: Label; x: number; y: number }[] = []

  constructor(svg: SVGSVGElement, labelList: Label[], setLabelList: (labelList: Label[]) => void) {
    this._svg = svg
    this._svg.addEventListener("mousedown", this.onSvgMouseDown)
    this._svg.addEventListener("mousemove", this.onSvgMouseMove)
    this._svg.addEventListener("mouseup", this.onSvgMouseUp)
    this._labelList = labelList
    this._setLabelList = setLabelList
  }

  get svgNs() {
    return this._svgNs
  }

  set mode(mode: Mode) {
    this._mode = mode
    if (mode === Mode.Selection) {
      this._labelList.forEach((label) => {
        label.rect.style.cursor = "move"
      })
    } else {
      this._labelList.forEach((label) => {
        label.rect.style.cursor = "default"
      })
    }
  }

  set zoom(zoom: number) {
    this._zoom = zoom
  }

  initLabelList = (labelList: Label[]) => {
    labelList.forEach((label) => {
      this._svg.appendChild(label.g)
    })
  }

  set labelList(labelList: Label[]) {
    this._labelList = labelList
  }

  get startX() {
    return this._startX
  }

  set startX(startX) {
    this._startX = startX
  }

  get startY() {
    return this._startY
  }

  set startY(startY) {
    this._startY = startY
  }

  get isPushingSpaceBar() {
    return this._isPushingSpacebar
  }

  set isDragging(isDragging: boolean) {
    this._isDragging = isDragging
  }

  set curLabel(label: Label) {
    this._curLabel = label
  }

  onSvgMouseDown = (evt: MouseEvent) => {
    if (this._isPushingSpacebar) {
      // labelNS.isDragging = true
      // initImgForDrag(evt)
    } else if (this._mode === Mode.Creation) {
      const LEFT_BUTTON = 0
      if (evt.button !== LEFT_BUTTON) return
      this._isDrawing = true
      this._startX = evt.offsetX
      this._startY = evt.offsetY
      const label = new Label(this._startX, this._startY, this._zoom)
      this._svg.appendChild(label.g)
      this._curLabel = label
      // } else if (p.mode === Mode.Selection) {
      // const selectedLabels = [...labelNS.svg.childNodes].filter((node) => node.classList.contains("selected"))
      // if (!selectedLabels.length) {
      //   return
      // }
      // deleteAnchors(evt)
      // dispatch(selectLabels({ selectedLabelsIds: getSelectedLabelsIds() }))
      // }
    } else if (this._mode === Mode.Selection) {
      const target = evt.target as SVGElement
      const { role } = target.dataset
      const id = target.parentElement?.id

      console.log(this._mode)

      if (evt.ctrlKey) {
        if (role === "label") {
          if (!id) return
          const newLabelList = this._labelList.map((label) => {
            if (label.id === id) label.selected = !label.selected
            return label
          })
          this._setLabelList(newLabelList)
          this._selectedElement = "label"
          this._selectedLabelList = newLabelList
            .filter((label) => label.selected)
            .map((label) => ({
              label,
              x: label.x,
              y: label.y,
            }))
          this._isDragging = true
          this._startX = evt.offsetX
          this._startY = evt.offsetY
        }
      } else {
        if (role === "svg") {
          this._setLabelList(
            this._labelList.map((label) => {
              label.selected = false
              return label
            }),
          )
        } else if (role === "label") {
          console.log(role)
          if (!id) return
          const newLabelList = this._labelList.map((label) => {
            label.selected = label.id === id
            return label
          })
          this._setLabelList(newLabelList)
          this._selectedElement = "label"
          this._selectedLabelList = newLabelList
            .filter((label) => label.selected)
            .map((label) => ({
              label,
              x: label.x,
              y: label.y,
            }))
          this._isDragging = true
          this._startX = evt.offsetX
          this._startY = evt.offsetY
        }
      }

      // switch (target.dataset.role) {
      //   case "label":
      //     const g = target.parentElement
      //     if(!g) return
      //     if(target.parentElement?.id
      //     break
      //   case HANDLER_CURSOR_LIST[0]:
      //     break
      //   default:
      //     break
      // }
    }
  }

  onSvgMouseMove = (evt: MouseEvent) => {
    if (this._mode === Mode.Creation && this._isDrawing) {
      if (!this._curLabel) return
      const endX = evt.offsetX
      const endY = evt.offsetY
      const x = this._startX < endX ? this._startX : endX
      const y = this._startY < endY ? this._startY : endY
      const width = Math.abs(this._startX - endX) / this._zoom
      const height = Math.abs(this._startY - endY) / this._zoom
      this._curLabel.x = x
      this._curLabel.y = y
      this._curLabel.width = width
      this._curLabel.height = height
    } else if (this._mode === Mode.Selection && this._isDragging) {
      if (this._selectedElement === "label") {
        const endX = evt.offsetX
        const endY = evt.offsetY
        const deltaX = endX - this._startX
        const deltaY = endY - this._startY
        this._selectedLabelList.forEach((selectedLabel) => {
          selectedLabel.label.x = selectedLabel.x + deltaX
          selectedLabel.label.y = selectedLabel.y + deltaY
        })
      }
    }
  }

  onSvgMouseUp = (evt: MouseEvent) => {
    if (this._mode === Mode.Creation && this._isDrawing) {
      if (!this._curLabel) return
      if (this._curLabel.width > 10 && this._curLabel.height > 10) {
        this._setLabelList(this._labelList.concat(this._curLabel))
      }
      this._curLabel = null
    }
    this._isDragging = false
    this._isDrawing = false
  }

  // svgMousedownEvent = (evt: MouseEvent) => {
  //   if (this._isPushingSpacebar) {
  //     // this._isDragging = true
  //     // initImgForDrag(evt)
  //   } else if (this._mode === Mode.Creation) {
  //     // evt.button 0은 마우스 왼쪽 클릭
  //     if (evt.button !== 0) return
  //     this._isDrawing = true
  //     this.initializeLabel(evt)
  //   } else if (this._mode === Mode.Selection) {
  //     // const selectedLabels = [...this.svg.childNodes].filter((node) => node.classList.contains("selected"))
  //     // if (!selectedLabels.length) return
  //     // deleteAnchors(evt)
  //     // dispatch(selectLabels({ selectedLabelsIds: getSelectedLabelsIds() }))
  //   }
  // }

  // document.addEventListener("keydown", documentKeydownEvent)
  // document.addEventListener("keyup", documentKeyupEvent)
  // document.addEventListener("mouseup", documentMouseupEvent)
  // document.addEventListener("click", hideContextmenu)
  // document.addEventListener("mousewheel", hideContextmenu)
  // document.addEventListener("contextmenu", hideDefaultContextmenu)
  // // document.addEventListener("mousemove", pauseEvent)
  //
  // this._svg = document.querySelector("#svg")
  // this._svg.addEventListener("mousedown", svgMousedownEvent)
  // this._svg.addEventListener("mousemove", throttle(svgMousemoveEvent, 25))
  // this._svg.addEventListener("mousewheel", throttle(svgMousewheelEvent, 40))
  // this._svg.addEventListener("contextmenu", showContextmenu)

  // LABEL_RESIZE: "LABEL_RESIZE",
  // LABEL_ROTATOR: "LABEL_ROTATOR",
  // LABEL_BODY: "LABEL_BODY",
  // menuNm: {
  //   EDIT: "edit",
  //   CUT: "cut",
  //   COPY: "copy",
  //   PASTE: "paste",
  //   DELETE: "delete",
  // },
  // tagNm: {
  //   LINE: "line",
  //   CIRCLE: "circle",
  //   RECT: "rect",
  //   TEXT: "text",
  //   FOREIGNOBJECT: "foreignObject",
  //   IMAGE: "image",
  //   G: "g",
  //   SPAN: "SPAN",
  // },
  // svgNS: "http://www.w3.org/2000/svg",
  // svg: null,
  // contextmenu: null,
  // mode: LabelMode.SELECT,
  // curId: 0,
  // curScale: 1.0,
  // isDrawing: false,
  // isDragging: false,
  // isPushingSpacebar: false,
  // isWritingTxt: false,
  // startX: 0,
  // startY: 0,
  // preX: 0,
  // preY: 0,
  // preDegree: 0,
  // preRotX: 0.0,
  // preRotY: 0.0,
  // preWidth: 0.0,
  // preHeight: 0.0,
  // qp0_x: 0.0,
  // qp0_y: 0.0,
  // pp_x: 0.0,
  // pp_y: 0.0,
  // menuX: 0,
  // menuY: 0,
  // curLabel: null,
  // selectedLabel: null,
  // selectedLabelsInfo: [],
  // allLabelsInfo: [],
  // cloneLabels: [],
  // selectedHandler: null,
  // anchor: null,
}
