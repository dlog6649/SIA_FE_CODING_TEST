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
  private readonly _setLabelList: (labelList: Label[]) => void
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
    qp0_x: number
    qp0_y: number
    pp_x: number
    pp_y: number
  } | null = null
  readonly MIN_ZOOM = 0.1
  readonly MAX_ZOOM = 2
  private readonly _setZoom: (zoom: number) => void
  private _copiedLabelList: Label[] = []

  constructor(
    svg: SVGSVGElement,
    labelList: Label[],
    setLabelList: (labelList: Label[]) => void,
    setZoom: (zoom: number) => void,
  ) {
    this._svg = svg
    this._svg.addEventListener("mousedown", this.onSvgMouseDown)
    this._svg.addEventListener("mousemove", this.onSvgMouseMove)
    this._svg.addEventListener("mouseup", this.onSvgMouseUp)
    this._svg.addEventListener("mousewheel", this.onSvgMouseWheel)

    // this._svg.addEventListener("contextmenu", this.onSvgContextMenu)

    this._labelList = labelList
    this.appendLabelList(labelList)
    this._setLabelList = setLabelList
    this._setZoom = setZoom
  }

  // onSvgContextMenu = (evt: MouseEvent) => {
  //   evt.preventDefault()
  //   if (this._mode === Mode.Creation) return
  // }

  onEditMenuClick = () => {}

  onCutMenuClick = () => {
    this.copySelectedLabelList()
    this.deleteSelectedLabelList()
  }

  onCopyMenuClick = () => {
    this.copySelectedLabelList()
  }

  onPasteMenuClick = () => {
    this.appendCopiedLabelList(this._copiedLabelList)
    this._setLabelList(this._labelList.concat(this._copiedLabelList))
  }

  onDeleteMenuClick = () => {
    this.deleteSelectedLabelList()
  }

  appendCopiedLabelList = (labelList: Label[]) => {
    labelList.forEach((label) => this._svg.appendChild(label.g))
  }

  copySelectedLabelList = () => {
    this._copiedLabelList = this._labelList
      .filter((label) => label.selected)
      .map((label) => new Label().copyLabel(label))
  }

  deleteSelectedLabelList = () => {
    this._setLabelList(
      this._labelList.filter((label) => {
        this.removeSelectedLabel(label)
        return !label.selected
      }),
    )
  }

  removeSelectedLabel = (label: Label) => {
    if (!label.selected) return
    this._svg.removeChild(label.g)
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
    this.setZoomLabelList(this._zoom, zoom)
    this._zoom = zoom
  }

  private appendLabelList = (labelList: Label[]) => {
    labelList.forEach((label) => {
      this._svg.appendChild(label.g)
    })
  }

  set labelList(labelList: Label[]) {
    this._labelList = labelList
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
          const qp0_x = (q0_x - c0_x) * cos_t - (q0_y - c0_y) * sin_t + c0_x
          const qp0_y = (q0_x - c0_x) * sin_t + (q0_y - c0_y) * cos_t + c0_y
          const pp_x = (p0_x - c0_x) * cos_t - (p0_y - c0_y) * sin_t + c0_x
          const pp_y = (p0_x - c0_x) * sin_t + (p0_y - c0_y) * cos_t + c0_y

          this._selectedLabel = {
            label: found,
            x,
            y,
            width,
            height,
            rotateX,
            rotateY,
            qp0_x,
            qp0_y,
            pp_x,
            pp_y,
          }
        }
      }
    }
  }

  onSvgMouseMove = (evt: MouseEvent) => {
    if (this._mode === Mode.Creation && this._isDrawing) {
      this.drawLabel(evt)
    } else if (this._mode === Mode.Selection && this._isDragging) {
      if (this._curSvgRole === SvgRole.LabelBody) {
        this.dragLabelList(evt)
      } else if (this._curSvgRole === SvgRole.Rotator) {
        this.rotateLabel(evt)
      } else if (this._curSvgRole === SvgRole.Resizer) {
        this.resizeLabel(evt)
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
      this._setLabelList([...this._labelList])
    }
    this._isDragging = false
    this._isDrawing = false
  }

  onSvgMouseWheel = (evt: Event) => {
    let newZoom = (evt as WheelEvent).deltaY < 0 ? this._zoom + 0.1 : this._zoom - 0.1
    newZoom = parseFloat(newZoom.toFixed(1))
    if (newZoom < this.MIN_ZOOM || newZoom > this.MAX_ZOOM) return
    this._setZoom(newZoom)
  }

  setZoomLabelList = (preZoom: number, newZoom: number) => {
    this._labelList.forEach((label) => {
      label.scale = newZoom
      label.x = (label.x / preZoom) * newZoom
      label.y = (label.y / preZoom) * newZoom
      label.setAttributes()
    })
  }

  drawLabel = (evt: MouseEvent) => {
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
    this._curLabel.setAttributes()
  }

  dragLabelList = (evt: MouseEvent) => {
    const endX = evt.offsetX
    const endY = evt.offsetY
    const deltaX = endX - this._startX
    const deltaY = endY - this._startY
    this._selectedLabelList.forEach((selectedLabel) => {
      selectedLabel.label.x = selectedLabel.x + deltaX
      selectedLabel.label.y = selectedLabel.y + deltaY
      selectedLabel.label.setAttributes()
    })
  }

  rotateLabel = (evt: MouseEvent) => {
    if (!this._curLabel) return
    const endX = evt.offsetX
    const endY = evt.offsetY
    const originalRotateX = this._curLabel.width * this._curLabel.scale * 0.5
    const originalRotateY = this._curLabel.height * this._curLabel.scale * 0.5
    let degree =
      (Math.atan2(endY - (this._curLabel.y + originalRotateY), endX - (this._curLabel.x + originalRotateX)) * 180) /
        Math.PI +
      90
    degree = degree < 0 ? degree + 360 : degree
    this._curLabel.degree = degree
    this._curLabel.setAttributes()
  }

  resizeLabel = (evt: MouseEvent) => {
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
      qp_x = this._selectedLabel.qp0_x
      qp_y = this._selectedLabel.qp0_y + (endY - this._selectedLabel.qp0_y)
    } else if (this._resizerCursor === _HANDLER_CURSOR_LIST[3] || this._resizerCursor === _HANDLER_CURSOR_LIST[7]) {
      qp_x = this._selectedLabel.qp0_x + (endX - this._selectedLabel.qp0_x)
      qp_y = this._selectedLabel.qp0_y
    } else {
      qp_x = this._selectedLabel.qp0_x + (endX - this._selectedLabel.qp0_x)
      qp_y = this._selectedLabel.qp0_y + (endY - this._selectedLabel.qp0_y)
    }
    const cp_x = (qp_x + this._selectedLabel.pp_x) * 0.5
    const cp_y = (qp_y + this._selectedLabel.pp_y) * 0.5

    const mtheta = (-1 * Math.PI * this._selectedLabel.label.degree) / 180
    const cos_mt = Math.cos(mtheta)
    const sin_mt = Math.sin(mtheta)

    const q_x = (qp_x - cp_x) * cos_mt - (qp_y - cp_y) * sin_mt + cp_x
    const q_y = (qp_x - cp_x) * sin_mt + (qp_y - cp_y) * cos_mt + cp_y
    const p_x = (this._selectedLabel.pp_x - cp_x) * cos_mt - (this._selectedLabel.pp_y - cp_y) * sin_mt + cp_x
    const p_y = (this._selectedLabel.pp_x - cp_x) * sin_mt + (this._selectedLabel.pp_y - cp_y) * cos_mt + cp_y

    console.log(this._resizerCursor)
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

    console.log(this._selectedLabel.label.width, w)
    console.log(this._selectedLabel.label.height, h)
    this._selectedLabel.label.x = x
    this._selectedLabel.label.y = y
    this._selectedLabel.label.width = w
    this._selectedLabel.label.height = h
    this._selectedLabel.label.setAttributes()
    this._selectedLabel.label.moveHandlers()
  }
}
