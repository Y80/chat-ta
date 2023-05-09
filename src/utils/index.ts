import throttle from 'lodash-es/throttle'
import { nanoid } from 'nanoid'

let needInstantScroll = false
function _scrollToBottom(props: { behavior: 'smooth' | 'instant' | 'manual-smooth' }) {
  function cb() {
    const scrollY = window.scrollY
    const distance = document.body.scrollHeight - window.innerHeight
    if (distance <= scrollY || needInstantScroll) {
      return
    }
    window.scrollTo({ top: scrollY + 1 })
    requestAnimationFrame(cb)
  }
  if (props.behavior === 'manual-smooth') {
    requestAnimationFrame(cb)
  } else {
    needInstantScroll = true
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    setTimeout(() => {
      needInstantScroll = false
    }, 0)
  }
}
export const scrollToBottom = throttle(_scrollToBottom, 300, {
  leading: true,
  trailing: true,
})

export function makeId() {
  return nanoid()
}
