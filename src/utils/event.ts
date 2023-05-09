import { dialog, invoke } from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'
import { writeTextFile } from './file'
import { getMessages } from './messages'

export const beforeWindowCloseTasks: (() => any)[] = [
  async () => {
    await writeTextFile({
      path: 'message-list.json',
      contents: JSON.stringify(getMessages()),
    })
  },
]

export async function onWindowClose() {
  const tasks: Promise<any>[] = []
  for (const task of beforeWindowCloseTasks) {
    tasks.push(Promise.resolve().then(task))
  }
  try {
    await Promise.all(tasks)
  } catch (error: any) {
    console.log({ error })
    await dialog.message('程序退出异常', { type: 'error' })
  }
  await appWindow.close()
}

invoke
