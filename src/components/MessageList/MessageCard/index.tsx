import AVATAR_BOT from '@/assets/images/bot.png'
import AVATAR_CAT from '@/assets/images/cat-1.png'
import { Role } from '@/constants/enum'
import { IMessage } from '@/types'
import classnames from 'classnames'
import { marked } from 'marked'
import { memo, useMemo, useRef } from 'react'
import style from './index.module.css'
import useAutoScroll from './useAutoScroll'

export default memo(_MessageCard)

function _MessageCard(props: IMessage) {
  const contentWrapRef = useRef<HTMLDivElement>(null)
  const rootDivRef = useRef<HTMLDivElement>(null)
  const isUser = props.role === Role.USER

  const contentNode = useMemo(() => {
    if (!isUser && !props.content) {
      return <Typing />
    }
    return (
      <div
        className={style.content}
        dangerouslySetInnerHTML={{ __html: marked.parse(props.content) }}
      />
    )
  }, [props.content])

  useAutoScroll({
    content: props.content,
    isError: !!props.isError,
    observedEleRef: contentWrapRef,
  })

  return (
    <div ref={rootDivRef} className={classnames(style.messageCard, isUser && 'flex-row-reverse')}>
      <img className={classnames(style.avatar)} src={isUser ? AVATAR_CAT : AVATAR_BOT} />
      <div
        ref={contentWrapRef}
        className={classnames(
          style.contentWrap,
          isUser && 'whitespace-pre-line bg-gray-900 text-white',
          props.isError && 'text-red-600'
        )}
      >
        {contentNode}
      </div>
    </div>
  )
}

function Typing() {
  return (
    <svg
      className="text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="24"
      viewBox="0 0 48 24"
    >
      <circle cx="36" cy="12" r="0" fill="currentColor">
        <animate
          attributeName="r"
          begin=".67"
          calcMode="spline"
          dur="1.5s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;4;0;0"
        />
      </circle>
      <circle cx="24" cy="12" r="0" fill="currentColor">
        <animate
          attributeName="r"
          begin=".33"
          calcMode="spline"
          dur="1.5s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;4;0;0"
        />
      </circle>
      <circle cx="12" cy="12" r="0" fill="currentColor">
        <animate
          attributeName="r"
          begin="0"
          calcMode="spline"
          dur="1.5s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;4;0;0"
        />
      </circle>
    </svg>
  )
}
