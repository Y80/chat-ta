import { Role } from '@/constants/enum'
import { IMessage } from '@/types'
import { makeId } from '.'
import { eventBus } from './event-bus'
import { event } from '@tauri-apps/api'

let messages: IMessage[] = []

export function setMessages(list: IMessage[]) {
  if (list === messages) return
  messages = list
  eventBus.emit(eventBus.Name.CHANGE_MESSAGES, list)
}

export function getMessages() {
  return messages
}

export function addMessage(msg: Partial<IMessage>) {
  setMessages(
    messages.concat({
      ...msg,
      id: msg.id || makeId(),
      role: msg.role || Role.USER,
      content: msg.content || '',
    })
  )
}

event.TauriEvent
