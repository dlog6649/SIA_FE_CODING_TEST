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

export const generateUUID = () => {
  let dt = new Date().getTime()
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
  })
}
