import { useEffect } from 'react'

export type Listener = (...args: any[]) => void

export enum EventBusName {
  CHANGE_MESSAGES = 'change-messages',
  SEND_QUESTION = 'send-question',
  CHANGE_AI_RESPOND_STATE = 'change-ai-respond-state',
  STOP_AI_RESPOND = 'stop-ai-respond',
}

class EventBus {
  map = new Map<EventBusName, Listener[]>()

  Name = EventBusName

  constructor() {}

  on(eventName: EventBusName, listener: Listener) {
    const listeners = this.map.get(eventName)
    if (listeners) {
      listeners.push(listener)
    } else {
      this.map.set(eventName, [listener])
    }
    return () => {
      this.off(eventName, listener)
    }
  }

  off(eventName: EventBusName, listener: Listener) {
    const listeners = this.map.get(eventName)
    if (!listeners) return

    const idx = listeners.findIndex((item) => item === listener)
    idx >= 0 && listeners.splice(idx, 1)
  }

  emit(eventName: EventBusName, payload?: any) {
    const listeners = this.map.get(eventName)
    if (!listeners) return

    let newListeners = [...listeners]
    for (const listener of newListeners) {
      listener(payload)
    }
  }

  once(eventName: EventBusName, listener: Listener) {
    const newListener: Listener = (...args: any) => {
      listener(...args)
      off()
    }
    const off = this.on(eventName, newListener)
    return off
  }

  useListen(eventName: EventBusName, listener: Listener) {
    const that = this
    useEffect(() => {
      const off = that.on(eventName, listener)
      return off
    }, [])
  }
}

export const eventBus = new EventBus()

// window.eventBus = eventBus
