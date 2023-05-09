import { DEFAULT_OPEN_AI_CHAT_MODEL } from '@/constants'
import { UserConfig } from '@/types'
import { readTextFile, writeTextFile } from './file'

const CONFIG_FILE_NAME = 'config.json'

// 保存一个 JS 变量，以便前端获取配置时，不用每次都 readTextFile
let userConfig: UserConfig | null = null

export async function getUserConfig() {
  if (userConfig) {
    return userConfig
  }
  const config = await readTextFile(CONFIG_FILE_NAME)
  try {
    userConfig = JSON.parse(config)
  } catch (error) {
    userConfig = DEFAULT_USER_CONFIG
  }

  return userConfig!
}

export async function setUserConfig(config: UserConfig) {
  await writeTextFile({
    path: CONFIG_FILE_NAME,
    contents: JSON.stringify(config),
  })
  userConfig = config
}

export const DEFAULT_USER_CONFIG: UserConfig = {
  openAi: {
    key: '',
    apiHost: 'https://api.openai.com',
    chatModel: DEFAULT_OPEN_AI_CHAT_MODEL,
  },
  temperature: 1,
  maxContextMessageCount: 5,
  systemPersonality: '',
}
