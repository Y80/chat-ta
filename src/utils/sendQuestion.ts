import { openAiChat } from '@/api'
import { Role } from '@/constants/enum'
import { addMessage, getMessages, setMessages } from '@/utils/messages'
import { getUserConfig } from '@/utils/user-config'
import { eventBus } from './event-bus'

async function makeMessages(question: string) {
  const { maxContextMessageCount } = await getUserConfig()
  addMessage({ role: Role.USER, content: question })
  addMessage({ role: Role.ASSISTANT, content: '' })
  // 取最后面 x 个记录
  const messages = [...getMessages()]
  messages.pop()
  const start = messages.length - maxContextMessageCount
  return messages.slice(Math.max(0, start)).map((msg) => ({ role: msg.role, content: msg.content }))
}

export async function sendQuestion(question: string) {
  // 发布：AI 开始响应
  eventBus.emit(eventBus.Name.CHANGE_AI_RESPOND_STATE, true)

  const rst = await openAiChat({ messages: await makeMessages(question) })

  if (rst.error) {
    const messages = getMessages()
    messages.at(-1)!.content = rst.error.message
    messages.at(-1)!.isError = true
    setMessages([...messages])
    // 发布：AI 结束响应
    eventBus.emit(eventBus.Name.CHANGE_AI_RESPOND_STATE, false)
    return
  }

  function getRenderer() {
    const INTERVAL_TIME = 50
    let cachedContent = ''
    let curContent = ''
    let timer = 0
    // 是否手动结束渲染
    let isStopRender = false
    // 订阅：手动中止 AI 响应，结束打字机渲染
    const unlisten = eventBus.once(eventBus.Name.STOP_AI_RESPOND, () => {
      isStopRender = true
    })

    // 这个函数会在 resolveStream() 中多次调用
    return function renderer(content: string) {
      cachedContent = content
      if (timer) return
      timer = window.setInterval(() => {
        // 是否已经将当前 cachedContent 内容全部渲染完成
        let isRenderedAllCachedContent = curContent.length === cachedContent.length
        // 手动停止或者已经渲染完成全部内容
        if (isStopRender || (isRenderedAllCachedContent && isResolveFinished)) {
          window.clearInterval(timer)
          eventBus.emit(eventBus.Name.CHANGE_AI_RESPOND_STATE, false)
          unlisten()
        }
        const char = cachedContent[curContent.length]
        if (char === undefined) return
        curContent += char
        const messages = getMessages()
        messages.at(-1)!.content = curContent
        setMessages([...messages])
      }, INTERVAL_TIME)
    }
  }

  // 标识 steam 是否已经解析完成
  let isResolveFinished = false
  await resolveStream({
    body: rst.response.body!,
    renderer: getRenderer(),
  })
  isResolveFinished = true
}

interface ResolveStreamParams {
  // 例如 (await fetch()).body
  body: ReadableStream<Uint8Array>
  // 渲染函数，这个函数会被多次执行，content 是从起始到当前 stream 解析出的长字符串
  renderer(content: string): void
}

async function resolveStream(params: ResolveStreamParams) {
  const { body, renderer } = params
  const reader = body.getReader()
  const decoder = new TextDecoder('UTF-8')

  // text/event-stream 的响应可能会持续一段时间，我们允许用户手动取消
  // 如果用户手动取消了，便不再读取流，可以让响应立即结束
  const unlisten = eventBus.once(eventBus.Name.STOP_AI_RESPOND, () => {
    reader.cancel()
    reader.releaseLock()
  })

  let content = ''
  async function readChunk() {
    let value: Uint8Array | undefined
    try {
      value = (await reader.read()).value
    } catch (error) {
      return
    }
    const decodedStr = decoder.decode(value)
    const strObjects = decodedStr.replaceAll('data: ', '').split('\n').filter(Boolean)
    for (const strObj of strObjects) {
      if (strObj.includes('[DONE]')) return
      const obj = JSON.parse(strObj)
      const newContent = obj?.choices?.[0]?.delta?.content
      if (!newContent) continue
      content += newContent
      renderer(content)
    }
    // 这里一定要用 await，以保证拼接字符的正确顺序
    await readChunk()
  }
  await readChunk()
  unlisten()
}
