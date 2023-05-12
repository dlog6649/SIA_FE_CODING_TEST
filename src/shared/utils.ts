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

export const cn = (...classNames: (string | number | boolean | undefined | null)[]): string => {
  return classNames
    .filter((it) => typeof it === "string" || typeof it === "number")
    .join(" ")
    .trim()
}
