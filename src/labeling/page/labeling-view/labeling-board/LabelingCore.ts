import { Mode } from "../LabelingView"
import { Label } from "./Label"

export enum SvgRole {
  Svg = "Svg",
  LabelBody = "LabelBody",
  Resizer = "Resizer",
  Rotator = "Rotator",
}

const _HANDLER_CURSOR_LIST = [
  "nw-resize",
  "n-resize",
  "ne-resize",
  "e-resize",
  "se-resize",
  "s-resize",
  "sw-resize",
  "w-resize",
]

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
  private _curSvgRole: SvgRole = SvgRole.LabelBody
  private _selectedLabelList: { label: Label; x: number; y: number }[] = []
  private _resizerCursor = ""
  private _selectedLabel: {
    label: Label
    x: number
    y: number
    width: number
    height: number
    rotateX: number
    rotateY: number
  } | null = null
  private _qp0_x = 0
  private _qp0_y = 0
  private _pp_x = 0
  private _pp_y = 0

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

  get isPushingSpaceBar() {
    return this._isPushingSpacebar
  }

  set isDragging(isDragging: boolean) {
    this._isDragging = isDragging
  }

  onSvgMouseDown = (evt: MouseEvent) => {
    console.log(this._mode)

    if (this._isPushingSpacebar) {
      this._isDragging = true
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
    } else if (this._mode === Mode.Selection) {
      const target = evt.target as SVGElement
      const { role } = target.dataset
      this._curSvgRole = role as SvgRole
      const id = target.parentElement?.id
      if (evt.ctrlKey) {
        if (role === SvgRole.LabelBody) {
          if (!id) return
          const newLabelList = this._labelList.map((label) => {
            if (label.id === id) label.selected = !label.selected
            return label
          })
          this._setLabelList(newLabelList)
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
        console.log(role)
        if (role === SvgRole.Svg) {
          this._setLabelList(
            this._labelList.map((label) => {
              label.selected = false
              return label
            }),
          )
        } else if (role === SvgRole.LabelBody) {
          if (!id) return
          const newLabelList = this._labelList.map((label) => {
            label.selected = label.id === id
            return label
          })
          this._setLabelList(newLabelList)
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
        } else if (role === SvgRole.Rotator) {
          const found = this._labelList.find((label) => label.id === id)
          if (!found) return
          this._curLabel = found
          this._isDragging = true
        } else if (role === SvgRole.Resizer) {
          const found = this._labelList.find((label) => label.id === id)
          if (!found) return
          if (!target.dataset.cursor) return
          const sequence = target.dataset.sequence
          if (!sequence) return

          this._curSvgRole = role
          this._curLabel = found
          this._resizerCursor = target.dataset.cursor
          this._isDragging = true

          const { x, y, width, height, scale, degree, rotateX, rotateY } = found

          this._selectedLabel = {
            label: found,
            x,
            y,
            width,
            height,
            rotateX,
            rotateY,
          }

          const theta = (Math.PI / 180) * degree
          const cos_t = Math.cos(theta)
          const sin_t = Math.sin(theta)
          const c0_x = x + rotateX * scale
          const c0_y = y + rotateY * scale

          const rightSide = x + width
          const bottomSide = y + height

          const q0_x_arr = [x, c0_x, rightSide, rightSide, rightSide, c0_x, x, x]
          const q0_y_arr = [y, y, y, c0_y, bottomSide, bottomSide, bottomSide, c0_y]
          const p0_x_arr = [rightSide, c0_x, x, x, x, c0_x, rightSide, rightSide]
          const p0_y_arr = [bottomSide, bottomSide, bottomSide, c0_y, y, y, y, c0_y]

          const q0_x = q0_x_arr[sequence]
          const q0_y = q0_y_arr[sequence]

          const p0_x = p0_x_arr[sequence]
          const p0_y = p0_y_arr[sequence]

          this._qp0_x = (q0_x - c0_x) * cos_t - (q0_y - c0_y) * sin_t + c0_x
          this._qp0_y = (q0_x - c0_x) * sin_t + (q0_y - c0_y) * cos_t + c0_y

          this._pp_x = (p0_x - c0_x) * cos_t - (p0_y - c0_y) * sin_t + c0_x
          this._pp_y = (p0_x - c0_x) * sin_t + (p0_y - c0_y) * cos_t + c0_y
        }
      }
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
      console.log(this._curSvgRole)
      if (this._curSvgRole === SvgRole.LabelBody) {
        const endX = evt.offsetX
        const endY = evt.offsetY
        const deltaX = endX - this._startX
        const deltaY = endY - this._startY
        this._selectedLabelList.forEach((selectedLabel) => {
          selectedLabel.label.x = selectedLabel.x + deltaX
          selectedLabel.label.y = selectedLabel.y + deltaY
        })
      } else if (this._curSvgRole === SvgRole.Rotator) {
        if (!this._curLabel) return
        const endX = evt.offsetX
        const endY = evt.offsetY
        const oriRotX = this._curLabel.width * this._curLabel.scale * 0.5
        const oriRotY = this._curLabel.height * this._curLabel.scale * 0.5
        console.log(oriRotX, oriRotY)
        // 이 부분에서 scale을 곱해줘야 SCALE이 바뀌었을때 유효해지는가?
        let degree =
          (Math.atan2(endY - (this._curLabel.y + oriRotY), endX - (this._curLabel.x + oriRotX)) * 180) / Math.PI + 90
        degree = degree < 0 ? degree + 360 : degree
        this._curLabel.degree = degree
      } else if (this._curSvgRole === SvgRole.Resizer) {
        const endX = evt.offsetX
        const endY = evt.offsetY
        let x
        let y
        let w
        let h
        let qp_x
        let qp_y
        if (this._selectedLabel === null) return
        if (this._resizerCursor === _HANDLER_CURSOR_LIST[1] || this._resizerCursor === _HANDLER_CURSOR_LIST[5]) {
          qp_x = this._qp0_x
          qp_y = this._qp0_y + (endY - this._qp0_y)
        } else if (this._resizerCursor === _HANDLER_CURSOR_LIST[3] || this._resizerCursor === _HANDLER_CURSOR_LIST[7]) {
          qp_x = this._qp0_x + (endX - this._qp0_x)
          qp_y = this._qp0_y
        } else {
          qp_x = this._qp0_x + (endX - this._qp0_x)
          qp_y = this._qp0_y + (endY - this._qp0_y)
        }
        const cp_x = (qp_x + this._pp_x) * 0.5
        const cp_y = (qp_y + this._pp_y) * 0.5

        const mtheta = (-1 * Math.PI * this._selectedLabel.label.degree) / 180
        const cos_mt = Math.cos(mtheta)
        const sin_mt = Math.sin(mtheta)

        const q_x = (qp_x - cp_x) * cos_mt - (qp_y - cp_y) * sin_mt + cp_x
        const q_y = (qp_x - cp_x) * sin_mt + (qp_y - cp_y) * cos_mt + cp_y
        const p_x = (this._pp_x - cp_x) * cos_mt - (this._pp_y - cp_y) * sin_mt + cp_x
        const p_y = (this._pp_x - cp_x) * sin_mt + (this._pp_y - cp_y) * cos_mt + cp_y

        if (this._resizerCursor === _HANDLER_CURSOR_LIST[1] || this._resizerCursor === _HANDLER_CURSOR_LIST[5]) {
          w = this._selectedLabel.width
          h = p_y - q_y
          x = this._selectedLabel.x
          y = q_y
        } else if (this._resizerCursor === _HANDLER_CURSOR_LIST[3] || this._resizerCursor === _HANDLER_CURSOR_LIST[7]) {
          w = p_x - q_x
          h = this._selectedLabel.height
          x = q_x
          y = this._selectedLabel.y
        } else {
          w = p_x - q_x
          h = p_y - q_y
          x = q_x
          y = q_y
        }

        if (w < 0) {
          w *= -1
          x = p_x
        }
        if (h < 0) {
          h *= -1
          y = p_y
        }

        w /= this._selectedLabel.label.scale
        h /= this._selectedLabel.label.scale

        x = parseFloat(x.toFixed(2))
        y = parseFloat(y.toFixed(2))
        w = parseFloat(w.toFixed(2))
        h = parseFloat(h.toFixed(2))

        this._selectedLabel.label.x = x
        this._selectedLabel.label.y = y
        this._selectedLabel.label.width = w
        this._selectedLabel.label.height = h
      }
    }
  }

  onSvgMouseUp = (evt: MouseEvent) => {
    if (this._mode === Mode.Creation && this._isDrawing) {
      if (!this._curLabel) return
      if (this._curLabel.width > 10 && this._curLabel.height > 10) {
        this._setLabelList(this._labelList.concat(this._curLabel))
      } else {
        this._svg.removeChild(this._curLabel.g)
      }
      this._curLabel = null
    } else if (this._mode === Mode.Selection && this._isDragging) {
      // degree가 다른 라벨들에 대해서 새로운 x, y값을 지정해야 하는가?
      this._setLabelList([...this._labelList])
    }
    this._isDragging = false
    this._isDrawing = false
  }
}
