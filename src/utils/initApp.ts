import { event } from '@tauri-apps/api'
import { appWindow } from '@tauri-apps/api/window'
import hljs from 'highlight.js'
import { marked } from 'marked'
import { onWindowClose } from './event'
import { eventBus } from './event-bus'
import { exists, readTextFile, writeTextFile } from './file'
import { setMessages } from './messages'
import { sendQuestion } from './sendQuestion'
import { DEFAULT_USER_CONFIG } from './user-config'

export default async function initApp() {
  initMarked()

  if (!(await exists('config.json'))) {
    await writeTextFile({
      path: 'config.json',
      contents: JSON.stringify(DEFAULT_USER_CONFIG),
    })
    console.log('已写入默认配置文件')
  }
}

function initMarked() {
  marked.use({
    mangle: false,
    headerIds: false,
    silent: true,
  })
  // marked.use(
  //   markedHighlight({
  //     langPrefix: 'hljs language-',
  //     highlight(code: string, lang: string) {
  //       const language = hljs.getLanguage(lang) ? lang : 'plaintext'
  //       const value = hljs.highlight(code, { language }).value
  //       return value
  //     },
  //   })
  // )

  const renderer = new marked.Renderer()
  renderer.code = (code, lang) => {
    if (!lang) {
      lang = 'text'
    }
    if (!hljs.getLanguage(lang)) {
      lang = 'text'
    }
    return `<pre><code class="hljs language-${lang}">${
      hljs.highlight(code, { language: lang }).value
    }</code></pre>`
  }
  marked.setOptions({ renderer })
}

appWindow.listen(event.TauriEvent.WINDOW_CLOSE_REQUESTED, onWindowClose)

appWindow.onResized(async () => {
  const isFullScreen = await appWindow.isFullscreen()
  isFullScreen
    ? document.body.classList.add('full-screen')
    : document.body.classList.remove('full-screen')
})

readTextFile('message-list.json')
  .then((text) => setMessages(JSON.parse(text)))
  .catch(() => setMessages([]))

eventBus.on(eventBus.Name.SEND_QUESTION, sendQuestion)

// appWindow.setDecorations(true)
