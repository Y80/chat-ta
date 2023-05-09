import { scrollToBottom } from '@/utils'
import { useMount } from 'ahooks'
import { RefObject, useEffect, useRef } from 'react'

interface Params {
  content: string
  isError: boolean
  observedEleRef: RefObject<HTMLElement>
}

export default function useAutoScroll({ content, isError, observedEleRef }: Params) {
  const dataRef = useRef({
    prevHeight: 0,
    hasScrolled: false,
  })

  useMount(() => {
    // 第一次就有内容，即初始化加载对话记录，或 role = USER  的场景，直接滚到底部
    if (content && !dataRef.current.hasScrolled) {
      scrollToBottom({ behavior: 'smooth' })
      dataRef.current.hasScrolled = true
    }
  })

  useEffect(() => {
    // 第一次就有内容，即初始化加载对话记录，或 role = USER  的场景，直接滚到底部
    if (isError && !dataRef.current.hasScrolled) {
      scrollToBottom({ behavior: 'smooth' })
      dataRef.current.hasScrolled = true
    }
  }, [isError])

  useEffect(() => {
    const ele = observedEleRef.current
    if (dataRef.current.hasScrolled || !ele) return

    const isHeightChanged = ele.clientHeight && dataRef.current.prevHeight !== ele.clientHeight
    if (isHeightChanged) {
      dataRef.current.prevHeight = ele.clientHeight
      scrollToBottom({ behavior: 'manual-smooth' })
    }
  }, [content])
}
