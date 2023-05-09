import { IMessage } from '@/types'
import { eventBus } from '@/utils/event-bus'
import { getMessages } from '@/utils/messages'
import cls from 'classnames'
import { useState } from 'react'
import MessageCard from './MessageCard'
import style from './index.module.css'

export default function MessageList() {
  const [list, setList] = useState<IMessage[]>(getMessages())

  eventBus.useListen(eventBus.Name.CHANGE_MESSAGES, setList)

  if (!list.length) {
    return (
      <div className={cls(style.messageList, '-mt-24 items-center justify-center')}>
        <span className={style.logo} />
        <span className="text-2xl font-bold text-gray-300">欢迎使用 Chat Ta</span>
      </div>
    )
  }

  return (
    <div className={style.messageList}>
      {list.map((msg) => (
        <MessageCard key={msg.id} {...msg} />
      ))}
    </div>
  )
}
