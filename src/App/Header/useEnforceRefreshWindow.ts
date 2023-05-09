import { RefObject, useEffect } from 'react'

// fix: 磨砂背景在移动窗口时不能实时生效
export default function useEnforceRefreshWindow(elRef: RefObject<HTMLDivElement>) {
  useEffect(() => {
    const ele = elRef.current!
    let isClicked = false
    function handleMouseDown() {
      isClicked = true
    }
    function handleMouseUp() {
      isClicked = false
    }
    function handleMouseMove() {
      if (!isClicked) return
      const style = document.body.style
      style.opacity = '0'
      requestAnimationFrame(() => {
        if (style.opacity !== '1') {
          style.opacity = '1'
        }
      })
    }
    ele.addEventListener('mousedown', handleMouseDown)
    ele.addEventListener('mouseup', handleMouseUp)
    ele.addEventListener('mousemove', handleMouseMove)

    return () => {
      ele.removeEventListener('mousedown', handleMouseDown)
      ele.removeEventListener('mouseup', handleMouseUp)
      ele.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
}
