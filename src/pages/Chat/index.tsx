import MessageList from '@/components/MessageList'
import UserInput from '@/components/UserInput'
import style from './index.module.css'

export default function Chat() {
  return (
    <div className={style.chat}>
      <MessageList />
      <UserInput />
    </div>
  )
}
