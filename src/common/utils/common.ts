const tagNm = {
  LINE: "line",
  CIRCLE: "circle",
  RECT: "rect",
  TEXT: "text",
  FOREIGNOBJECT: "foreignObject",
  IMAGE: "image",
  G: "g",
  SPAN: "SPAN",
}

export const parseTransform = (obj: any) => {
  let transform = ""
  let x = 0
  let y = 0
  let scale = 0
  let deg = 0
  let rotX = 0
  let rotY = 0
  let w = 0
  let h = 0
  if (obj.tagName === tagNm.IMAGE) {
    transform = obj.getAttribute("transform").split(" ")
    x = parseFloat(transform[0].substring(10))
    y = parseFloat(transform[1].split(")")[0])
    scale = parseFloat(transform[2].substring(6).split(")")[0])
  } else if (obj.tagName === tagNm.G) {
    transform = obj.getAttribute("transform").split(" ")
    x = parseFloat(transform[0].substring(10))
    y = parseFloat(transform[1].split(")")[0])
    scale = parseFloat(transform[2].substring(6).split(")")[0])
    deg = parseInt(transform[3].substring(7))
    rotX = parseFloat(transform[4])
    rotY = parseFloat(transform[5].split(")")[0])
    w = parseFloat(obj.firstChild.getAttribute("width"))
    h = parseFloat(obj.firstChild.getAttribute("height"))
  }
  return { x, y, deg, rotX, rotY, w, h, scale }
}

export const parseTransformG = (transform: string) => {
  console.log(transform)
  const attributeList = transform.split(" ")
  console.log(attributeList)
  // const x = parseFloat(attributeList[0].substring(10))
  // const y = parseFloat(attributeList[1].split(")")[0])
  // const scale = parseFloat(attributeList[2].substring(6).split(")")[0])
  // const deg = parseInt(attributeList[3].substring(7))
  // const rotX = parseFloat(attributeList[4])
  // const rotY = parseFloat(attributeList[5].split(")")[0])
  // return { x, y, deg, rotX, rotY }
  return { x: 123, y: 123 }
}

export function throttle(func: any, wait: number, options: any) {
  let context: any
  let args: IArguments | null
  let result: any
  let timeout: NodeJS.Timeout | null = null
  let previous = 0
  if (!options) {
    options = {}
  }
  const later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) {
      context = args = null
    }
  }

  return function (this: any) {
    const now = Date.now()
    if (!previous && options.leading === false) {
      previous = now
    }
    const remaining = wait - (now - previous)
    context = this // if delete 'this' parameter then error occur
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) {
        context = args = null
      }
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

export const pauseEvent = (evt: any) => {
  if (evt.stopPropagation) {
    evt.stopPropagation()
  }
  if (evt.preventDefault) {
    evt.preventDefault()
  }
  evt.cancelBubble = true
  evt.returnValue = false
  return false
}

export const getLabelState = (label: SVGGElement) => {
  const id = Number(label.dataset.id)
  const name = label.dataset.name
  const tf = parseTransform(label)
  const data = { x: tf.x, y: tf.y, w: tf.w, h: tf.h, deg: tf.deg }

  const theta = (Math.PI / 180) * tf.deg
  const cos_t = Math.cos(theta)
  const sin_t = Math.sin(theta)

  const c_x = tf.x + tf.rotX
  const c_y = tf.y + tf.rotY

  const nw_x = tf.x
  const nw_y = tf.y
  const ne_x = tf.x + tf.w
  const ne_y = tf.y
  const se_x = tf.x + tf.w
  const se_y = tf.y + tf.h
  const sw_x = tf.x
  const sw_y = tf.y + tf.h

  let nw_xp = (nw_x - c_x) * cos_t - (nw_y - c_y) * sin_t + c_x
  let nw_yp = (nw_x - c_x) * sin_t + (nw_y - c_y) * cos_t + c_y
  let ne_xp = (ne_x - c_x) * cos_t - (ne_y - c_y) * sin_t + c_x
  let ne_yp = (ne_x - c_x) * sin_t + (ne_y - c_y) * cos_t + c_y
  let se_xp = (se_x - c_x) * cos_t - (se_y - c_y) * sin_t + c_x
  let se_yp = (se_x - c_x) * sin_t + (se_y - c_y) * cos_t + c_y
  let sw_xp = (sw_x - c_x) * cos_t - (sw_y - c_y) * sin_t + c_x
  let sw_yp = (sw_x - c_x) * sin_t + (sw_y - c_y) * cos_t + c_y

  nw_xp = parseFloat(nw_xp.toFixed(2))
  nw_yp = parseFloat(nw_yp.toFixed(2))
  ne_xp = parseFloat(ne_xp.toFixed(2))
  ne_yp = parseFloat(ne_yp.toFixed(2))
  se_xp = parseFloat(se_xp.toFixed(2))
  se_yp = parseFloat(se_yp.toFixed(2))
  sw_xp = parseFloat(sw_xp.toFixed(2))
  sw_yp = parseFloat(sw_yp.toFixed(2))

  // coordinates
  // 0 1
  // 3 2
  const coordinates = []
  coordinates.push({ x: nw_xp, y: nw_yp })
  coordinates.push({ x: ne_xp, y: ne_yp })
  coordinates.push({ x: se_xp, y: se_yp })
  coordinates.push({ x: sw_xp, y: sw_yp })

  return { id: id, name: name, coordinates: coordinates, data: data }
}

export const generateUUID = () => {
  let dt = new Date().getTime()
  const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
