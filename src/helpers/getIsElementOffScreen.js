export const getIsElementOffScreen = (ref) => {
  const el = ref && ref.$el ? ref.$el : ref

  if (!el) return

  const rect = el.getBoundingClientRect()
  const topMargin = 60 - el.clientHeight // offset for header
  const bottomOffset = window.innerHeight - rect.top

  // if rect.height > 0 element visible
  return rect.height && (rect.top < topMargin || bottomOffset < 0)
}
