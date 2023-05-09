import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import Logger from './Logger'

function getComponentsDir() {
  return path.resolve(new URL(import.meta.url).pathname, '../../', componentsDirPath)
}

function createComponent(originalName: string) {
  let name = originalName.trim()
  if (!/^[a-zA-Z]/.test(name)) {
    Logger.log('🙅 组件名称必须以字母开始', Logger.style.RED)
    return
  }

  const dir = getComponentsDir()
  !existsSync(dir) && mkdirSync(dir)
  const rootClassName = name[0].toLowerCase() + name.slice(1)
  const cssFile = {
    path: path.join(dir, 'index.module.css'),
    content: `.${rootClassName} {
  /* root style */
}`,
  }
  writeFileSync(cssFile.path, cssFile.content)
  Logger.log(`✅ 已创建 ${cssFile.path}`, Logger.style.GREEN)
  const tsxFile = {
    path: path.join(dir, 'index.tsx'),
    content: `import style from './index.module.css'

export default function ${name[0].toUpperCase() + name.slice(1)}() {
  // ...
  return <div className={style.${rootClassName}}> element </div>
}`,
  }
  writeFileSync(tsxFile.path, tsxFile.content)
  Logger.log(`✅ 已创建 ${tsxFile.path}`, Logger.style.GREEN)
}

let step = 1
let componentsDirPath = 'src/components'
Logger.log(`📦 请输入组件所在目录，如 src/pages/User：`, Logger.style.BLUE)
process.stdin.on('data', function (data) {
  if (step === 1) {
    step++
    componentsDirPath = data.toString().trim() || componentsDirPath
    Logger.log('📦 请输入组件名称：', Logger.style.BLUE)
  } else {
    createComponent(data.toString())
    process.exit()
  }
})
