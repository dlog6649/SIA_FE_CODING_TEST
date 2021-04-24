import { Mode } from "../LabelingView"
import { Label } from "./Label"
import { ContextMenuState, Coordinate } from "./LabelingBoard"

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
  private _startCoordinate: Coordinate = { x: 0, y: 0 }
  private _menuCoordinate: Coordinate = { x: 0, y: 0 }
  private _isDrawing = false
  private _isDragging = false
  private _isPushingSpacebar = false
  private _labels: Label[]
  private readonly _setLabels: (labels: Label[]) => void
  private _curSvgRole: SvgRole = SvgRole.LabelBody
  private _selectedLabels: { label: Label; coordinate: Coordinate }[] = []
  private _resizerCursor = ""
  private _selectedLabel: {
    label: Label
    coordinate: Coordinate
    width: number
    height: number
    rotateCoordinate: Coordinate
    qp0Coordinate: Coordinate
    ppCoordinate: Coordinate
  } | null = null
  readonly MIN_ZOOM = 0.1
  readonly MAX_ZOOM = 2
  private readonly _setZoom: (zoom: number) => void
  private readonly _setContextMenuState: (ctxMenuState: ContextMenuState) => void
  private _copiedLabels: Label[] = []

  constructor(
    svg: SVGSVGElement,
    labels: Label[],
    setLabels: (labels: Label[]) => void,
    setZoom: (zoom: number) => void,
    setContextMenuState: (ctxMenuState: ContextMenuState) => void,
  ) {
    this._svg = svg
    this._svg.addEventListener("mousedown", this.onSvgMouseDown)
    this._svg.addEventListener("mousemove", this.onSvgMouseMove)
    this._svg.addEventListener("mouseup", this.onSvgMouseUp)
    this._svg.addEventListener("mousewheel", this.onSvgMouseWheel)

    this._labels = labels
    this.appendLabels(labels)
    this._setLabels = setLabels
    this._setZoom = setZoom
    this._setContextMenuState = setContextMenuState
  }

  onDocumentKeyDown = (evt: KeyboardEvent) => {
    const { code } = evt
    if (code === "Space") {
      this._isPushingSpacebar = true
    }
    if (code === "F2") {
      this.editLabels()
    }
    if (code === "Delete" || code === "Backspace") {
      this.deleteLabels()
    }
    if (evt.ctrlKey && code === "KeyX") {
      this.cutLabels()
    }
    if (evt.ctrlKey && code === "KeyC") {
      this.copyLabels()
    }
    if (evt.ctrlKey && code === "KeyV") {
      this.pasteLabels()
    }
  }

  onDocumentKeyUp = (evt: KeyboardEvent) => {
    const { code } = evt
    if (code === "Space") {
      this._isPushingSpacebar = false
    }
  }

  onEditMenuClick = () => {
    this.editLabels()
  }

  editLabels = () => {
    this._labels.filter((label) => label.selected).forEach((label) => label.createInputBox())
  }

  onCutMenuClick = () => {
    this.cutLabels()
  }

  cutLabels = () => {
    this.copyLabels()
    this.deleteLabels()
  }

  onCopyMenuClick = () => {
    this.copyLabels()
  }

  onPasteMenuClick = () => {
    this.pasteLabelsOnMousePosition()
  }

  pasteLabels = () => {
    const COPIED_LABEL_POSITION_DISTANCE = 10
    this._copiedLabels = this._copiedLabels.map((label) => {
      const _label = new Label().copyLabel(label)
      _label.x = _label.x + COPIED_LABEL_POSITION_DISTANCE
      _label.y = _label.y + COPIED_LABEL_POSITION_DISTANCE
      _label.setAttributes()
      _label.setCursor(this.getLabelCursorStyle())
      return _label
    })
    this.appendCopiedLabels(this._copiedLabels)
    this._setLabels(this._labels.concat(this._copiedLabels))
  }

  pasteLabelsOnMousePosition = () => {
    const newLabels = this._copiedLabels.map((label) => {
      const _label = new Label().copyLabel(label)
      _label.x = this._copiedLabels[0].x - _label.x + this._menuCoordinate.x
      _label.y = this._copiedLabels[0].y - _label.y + this._menuCoordinate.y
      _label.setAttributes()
      _label.setCursor(this.getLabelCursorStyle())
      return _label
    })
    this.appendCopiedLabels(newLabels)
    this._setLabels(this._labels.concat(newLabels))
  }

  getLabelCursorStyle = () => (this._mode === Mode.Selection ? "move" : "default")

  onDeleteMenuClick = () => {
    this.deleteLabels()
  }

  appendCopiedLabels = (labels: Label[]) => {
    labels.forEach((label) => this._svg.appendChild(label.g))
  }

  copyLabels = () => {
    this._copiedLabels = this._labels.filter((label) => label.selected)
  }

  deleteLabels = () => {
    this._setLabels(
      this._labels.filter((label) => {
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
    this._labels.forEach((label) => {
      label.setCursor(this.getLabelCursorStyle())
    })
  }

  set zoom(zoom: number) {
    this.setZoomLabels(this._zoom, zoom)
    this._zoom = zoom
  }

  private appendLabels = (labels: Label[]) => {
    labels.forEach((label) => {
      this._svg.appendChild(label.g)
    })
  }

  set labels(labels: Label[]) {
    this._labels = labels
  }

  onSvgMouseDown = (evt: MouseEvent) => {
    if (this._isPushingSpacebar) {
      this._isDragging = true
      // initImgForDrag(evt)
    } else if (this._mode === Mode.Creation) {
      const LEFT_BUTTON = 0
      if (evt.button !== LEFT_BUTTON) return
      this._isDrawing = true
      this._startCoordinate.x = evt.offsetX
      this._startCoordinate.y = evt.offsetY
      const label = new Label(this._startCoordinate, this._zoom)
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
          const newLabels = this._labels.map((label) => {
            if (label.id === id) label.selected = !label.selected
            return label
          })
          this._setLabels(newLabels)
          this._selectedLabels = newLabels
            .filter((label) => label.selected)
            .map((label) => ({
              label,
              coordinate: { x: label.x, y: label.y },
            }))
          this._isDragging = true
          this._startCoordinate.x = evt.offsetX
          this._startCoordinate.y = evt.offsetY
        }
      } else {
        if (role === SvgRole.Svg) {
          this._setLabels(
            this._labels.map((label) => {
              label.selected = false
              return label
            }),
          )
        } else if (role === SvgRole.LabelBody) {
          if (!id) return
          const newLabels = this._labels.map((label) => {
            label.selected = label.id === id
            return label
          })
          this._setLabels(newLabels)
          this._selectedLabels = newLabels
            .filter((label) => label.selected)
            .map((label) => ({
              label,
              coordinate: { x: label.x, y: label.y },
            }))
          this._isDragging = true
          this._startCoordinate.x = evt.offsetX
          this._startCoordinate.y = evt.offsetY
        } else if (role === SvgRole.Rotator) {
          const found = this._labels.find((label) => label.id === id)
          if (!found) return
          this._curLabel = found
          this._isDragging = true
        } else if (role === SvgRole.Resizer) {
          const found = this._labels.find((label) => label.id === id)
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
            coordinate: { x, y },
            width,
            height,
            rotateCoordinate: { x: rotateX, y: rotateY },
            qp0Coordinate: { x: qp0_x, y: qp0_y },
            ppCoordinate: { x: pp_x, y: pp_y },
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
        this.dragLabels(evt)
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
        this._curLabel.createInputBox()
        this._setLabels(this._labels.concat(this._curLabel))
      } else {
        this._svg.removeChild(this._curLabel.g)
      }
      this._curLabel = null
    } else if (this._mode === Mode.Selection) {
      if (this._isDragging) {
        this._setLabels([...this._labels])
      }

      const target = evt.target as SVGElement
      const { role } = target.dataset

      const MOUSE_RIGHT_BUTTON = 2
      if (this._mode === Mode.Selection && evt.button === MOUSE_RIGHT_BUTTON) {
        this._menuCoordinate.x = evt.offsetX
        this._menuCoordinate.y = evt.offsetY
        if (role === SvgRole.LabelBody) {
          this._setContextMenuState({
            edit: { visible: true, disabled: false },
            cut: { visible: true, disabled: false },
            copy: { visible: true, disabled: false },
            paste: { visible: true, disabled: this._copiedLabels.length === 0 },
            delete: { visible: true, disabled: false },
          })
        } else {
          this._setContextMenuState({
            edit: { visible: false, disabled: true },
            cut: { visible: false, disabled: true },
            copy: { visible: false, disabled: true },
            paste: { visible: true, disabled: this._copiedLabels.length === 0 },
            delete: { visible: false, disabled: true },
          })
        }
      }
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

  setZoomLabels = (preZoom: number, newZoom: number) => {
    this._labels.forEach((label) => {
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
    const x = this._startCoordinate.x < endX ? this._startCoordinate.x : endX
    const y = this._startCoordinate.y < endY ? this._startCoordinate.y : endY
    const width = Math.abs(this._startCoordinate.x - endX) / this._zoom
    const height = Math.abs(this._startCoordinate.y - endY) / this._zoom
    this._curLabel.x = x
    this._curLabel.y = y
    this._curLabel.width = width
    this._curLabel.height = height
    this._curLabel.setAttributes()
  }

  dragLabels = (evt: MouseEvent) => {
    const endX = evt.offsetX
    const endY = evt.offsetY
    const deltaX = endX - this._startCoordinate.x
    const deltaY = endY - this._startCoordinate.y
    this._selectedLabels.forEach((selectedLabel) => {
      selectedLabel.label.x = selectedLabel.coordinate.x + deltaX
      selectedLabel.label.y = selectedLabel.coordinate.y + deltaY
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
      qp_x = this._selectedLabel.qp0Coordinate.x
      qp_y = this._selectedLabel.qp0Coordinate.y + (endY - this._selectedLabel.qp0Coordinate.y)
    } else if (this._resizerCursor === _HANDLER_CURSOR_LIST[3] || this._resizerCursor === _HANDLER_CURSOR_LIST[7]) {
      qp_x = this._selectedLabel.qp0Coordinate.x + (endX - this._selectedLabel.qp0Coordinate.x)
      qp_y = this._selectedLabel.qp0Coordinate.y
    } else {
      qp_x = this._selectedLabel.qp0Coordinate.x + (endX - this._selectedLabel.qp0Coordinate.x)
      qp_y = this._selectedLabel.qp0Coordinate.y + (endY - this._selectedLabel.qp0Coordinate.y)
    }
    const cp_x = (qp_x + this._selectedLabel.ppCoordinate.x) * 0.5
    const cp_y = (qp_y + this._selectedLabel.ppCoordinate.y) * 0.5

    const mtheta = (-1 * Math.PI * this._selectedLabel.label.degree) / 180
    const cos_mt = Math.cos(mtheta)
    const sin_mt = Math.sin(mtheta)

    const q_x = (qp_x - cp_x) * cos_mt - (qp_y - cp_y) * sin_mt + cp_x
    const q_y = (qp_x - cp_x) * sin_mt + (qp_y - cp_y) * cos_mt + cp_y
    const p_x =
      (this._selectedLabel.ppCoordinate.x - cp_x) * cos_mt - (this._selectedLabel.ppCoordinate.y - cp_y) * sin_mt + cp_x
    const p_y =
      (this._selectedLabel.ppCoordinate.x - cp_x) * sin_mt + (this._selectedLabel.ppCoordinate.y - cp_y) * cos_mt + cp_y

    if (this._resizerCursor === _HANDLER_CURSOR_LIST[1] || this._resizerCursor === _HANDLER_CURSOR_LIST[5]) {
      w = this._selectedLabel.width
      h = p_y - q_y
      x = this._selectedLabel.coordinate.x
      y = q_y
    } else if (this._resizerCursor === _HANDLER_CURSOR_LIST[3] || this._resizerCursor === _HANDLER_CURSOR_LIST[7]) {
      w = p_x - q_x
      h = this._selectedLabel.height
      x = q_x
      y = this._selectedLabel.coordinate.y
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
    this._selectedLabel.label.setAttributes()
    this._selectedLabel.label.moveHandlers()
  }
}
