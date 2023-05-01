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
