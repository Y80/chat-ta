import ICON_STOP from '@/assets/images/stop-circle-rounded.svg'
import { eventBus } from '@/utils/event-bus'
import { useKeyPress, useMount, useSetState } from 'ahooks'
import { useRef } from 'react'
import MaskIcon from '../MaskIcon'
import style from './index.module.css'

const storage = {
  lastUserInput: '',
  curUserInput: '',
}

export default function UserInput() {
  const [state, setState] = useSetState({ input: '', showStopBtn: false })
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function handleUserInput(input = '') {
    setState({ input })
    storage.curUserInput = input
  }

  function send() {
    const content = state.input.replace(/(^\s*)|(\s*$)/g, '')
    if (!content) {
      return
    }
    storage.lastUserInput = content
    handleUserInput()
    eventBus.emit(eventBus.Name.SEND_QUESTION, content)
  }

  useKeyPress(
    'enter',
    (e) => {
      e.preventDefault()
      send()
    },
    { exactMatch: true }
  )

  useKeyPress(
    'uparrow',
    (e) => {
      const input = storage.lastUserInput
      if (!input) return
      setState((state) => {
        if (state.input) return state

        requestAnimationFrame(() => {
          inputRef.current!.selectionStart = input.length
        })
        return { ...state, input }
      })
    },
    { exactMatch: true }
  )

  useMount(() => {
    setState({ input: storage.curUserInput })
  })

  eventBus.useListen(eventBus.Name.CHANGE_AI_RESPOND_STATE, (v) => {
    setState({ showStopBtn: v })
  })

  function stop() {
    eventBus.emit(eventBus.Name.STOP_AI_RESPOND)
    setState({ showStopBtn: false })
  }

  return (
    <div className={style.userInput}>
      {state.showStopBtn ? (
        <div className={style.stopBtn} onClick={stop}>
          <MaskIcon src={ICON_STOP} />
          停止 AI 回复
        </div>
      ) : (
        <textarea
          placeholder="ask anything ..."
          value={state.input}
          ref={inputRef}
          onChange={(e) => handleUserInput(e.target.value)}
          spellCheck={false}
        />
      )}
    </div>
  )
}
