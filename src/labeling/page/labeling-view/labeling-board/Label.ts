export class Label {
  private _x = "0"
  private _y = "0"
  private _width = "1px"
  private _height = "1px"
  private _rotation = "0"
  private _color = "black"

  constructor(x = "0", y = "0") {
    this._x = x
    this._y = y
  }

  get x() {
    return this._x
  }

  set x(x) {
    this._x = x
  }

  get y() {
    return this._y
  }

  set y(y) {
    this._y = y
  }

  get width() {
    return this._width
  }

  set width(w) {
    this._width = w
  }

  get height() {
    return this._height
  }

  set height(h) {
    this._height = h
  }

  get rotation() {
    return this._rotation
  }

  set rotation(r) {
    this._rotation = r
  }
}
