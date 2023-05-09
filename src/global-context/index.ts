import { Role } from '@/constants/enum'
import { IMessage } from '@/types'
import { createContext, useContext } from 'react'

export interface GlobalContextValue {}

const globalContext = createContext<GlobalContextValue | null>(null)

export function useGlobalContext() {
  const ctx = useContext(globalContext)
  if (!ctx) {
    throw new Error('Error: global-context')
  }
  return ctx
}

export const GlobalContextProvider = globalContext.Provider

export function mockMessageList() {
  const list: IMessage[] = []
  for (let i = 0; i < 8; i++) {
    list.push({
      id: i.toString(),
      role: [Role.SYSTEM, Role.USER][i % 2],
      content: 'make 🔥 default 一个前端构建工具 😊():'.repeat(i + 1),
    })
  }

  return list
}
