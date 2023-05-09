import { OPEN_AI_CHAT_MODELS } from "@/constants"
import { getUserConfig, setUserConfig } from "@/utils/user-config"
import { dialog } from "@tauri-apps/api"
import { useMount, useSetState } from "ahooks"
import classNames from "classnames"
import { useNavigate } from "react-router-dom"
import style from "./index.module.css"

export default function More() {
  const navigate = useNavigate()
  const [state, setState] = useSetState({
    key: "",
    host: "https://api.openai.com",
    model: "",
    temperature: 1,
    maxMsgCount: 5,
    sysPersonality: "",
  })

  useMount(async () => {
    const config = await getUserConfig()
    setState({
      key: config.openAi.key,
      host: config.openAi.apiHost,
      model: config.openAi.chatModel,
      temperature: config.temperature,
      maxMsgCount: config.maxContextMessageCount,
      sysPersonality: config.systemPersonality,
    })
  })

  async function save() {
    await setUserConfig({
      openAi: {
        key: state.key,
        apiHost: state.host,
        chatModel: state.model,
      },
      temperature: state.temperature,
      maxContextMessageCount: state.maxMsgCount,
      systemPersonality: state.sysPersonality,
    })
    await dialog.message("✅ 配置已保存", { title: "" })
    navigate("/")
  }

  return (
    <div className={style.more}>
      <form>
        <div className={style.formItem}>
          <label>OpenAI Key</label>
          <input
            placeholder="sk-"
            value={state.key}
            onChange={(e) => {
              setState({ key: e.target.value })
            }}
          />
        </div>
        <div className={style.formItem}>
          <label>OpenAI API Host</label>
          <input
            type="url"
            value={state.host}
            onChange={(e) => {
              setState({ host: e.target.value })
            }}
          />
        </div>
        <div className={classNames(style.formItem, style.select)}>
          <label>OpenAI Chat Model</label>
          <select
            value={state.model}
            onChange={(e) => {
              setState({ model: e.target.value })
            }}
          >
            {OPEN_AI_CHAT_MODELS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className={style.formItem}>
          <label>对话风格</label>
          <input
            type="range"
            step="0.1"
            max={1.9}
            min={0.1}
            value={state.temperature}
            onChange={(e) => {
              setState({ temperature: Number(e.target.value) || 1 })
            }}
          />
          <div className="flex justify-between">
            <span>精准</span>
            <span>平衡</span>
            <span>创造</span>
          </div>
        </div>
        <div className={style.formItem}>
          <label>OpenAI Chat 上下文消息数量</label>
          <input
            type="number"
            step={1}
            max={20}
            min={1}
            value={state.maxMsgCount}
            onChange={(e) => {
              setState({ maxMsgCount: Number(e.target.value) || 1 })
            }}
            onBlur={() => {
              let maxMsgCount = state.maxMsgCount
              if (maxMsgCount < 1) {
                maxMsgCount = 1
              } else if (maxMsgCount > 1) {
                maxMsgCount = 20
              }
              setState({ maxMsgCount })
            }}
          />
        </div>
        <div className={style.formItem}>
          <label>人格指定</label>
          <textarea
            placeholder="例如：你是郭德纲，和我对话要用郭德纲的语气风格"
            value={state.sysPersonality}
            onChange={(e) => setState({ sysPersonality: e.target.value })}
          />
        </div>
        <button onClick={save} type="button">
          保存
        </button>
      </form>
    </div>
  )
}
