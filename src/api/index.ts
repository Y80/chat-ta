import { Role } from '@/constants/enum'
import { eventBus } from '@/utils/event-bus'
import { getUserConfig } from '@/utils/user-config'

type ApiResult =
  | { response: Response; error?: undefined }
  | { response?: Response; error: { message: string; type?: string } }

export async function openAiChat(params: {
  messages: { role: Role; content: string }[]
}): Promise<ApiResult> {
  const config = await getUserConfig()
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', 'Bearer ' + config.openAi.key)
  const messages = config.systemPersonality
    ? [{ role: Role.SYSTEM, content: config.systemPersonality }, ...params.messages]
    : params.messages
  const body = {
    model: config.openAi.chatModel,
    messages,
    stream: true,
    temperature: config.temperature,
  }

  const abortController = new AbortController()
  const unlisten = eventBus.once(eventBus.Name.STOP_AI_RESPOND, () => abortController.abort())
  try {
    const rsp = await fetch(config.openAi.apiHost + '/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: abortController.signal,
    })
    if (rsp.status !== 200) {
      return { error: (await rsp.json()).error || { message: '未知错误' } }
    } else {
      return { response: rsp }
    }
  } catch (error: any) {
    return { error: error || { message: '程序异常' } }
  } finally {
    unlisten()
  }
}
