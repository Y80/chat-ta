import { OPEN_AI_CHAT_MODELS } from '@/constants'
import { UserConfig } from '@/types'
import { getUserConfig, setUserConfig } from '@/utils/user-config'
import { dialog } from '@tauri-apps/api'
import { useMount } from 'ahooks'
import { Button, Form, Input, InputNumber, Select, Slider } from 'antd'
import { useNavigate } from 'react-router-dom'
import style from './index.module.css'

export default function More() {
  const navigate = useNavigate()
  const [form] = Form.useForm<UserConfig>()

  useMount(async () => {
    const config = await getUserConfig()
    form.setFieldsValue(config)
  })

  async function save() {
    const value = form.getFieldsValue()
    await setUserConfig(value)
    await dialog.message('✅ 配置已保存', { title: '' })
    navigate('/')
  }

  return (
    <div className={style.more}>
      <Form className={style.form} form={form}>
        <Form.Item label="OpenAI Key" name={['openAi', 'key']}>
          <Input placeholder="sk-" />
        </Form.Item>
        <Form.Item label="OpenAI API Host" name={['openAi', 'apiHost']}>
          <Input />
        </Form.Item>
        <Form.Item label="OpenAI Chat Model" name={['openAi', 'chatModel']}>
          <Select options={OPEN_AI_CHAT_MODELS.map((item) => ({ label: item, value: item }))} />
        </Form.Item>
        <Form.Item
          label="对话风格"
          name="temperature"
          extra={
            <div className="flex justify-between">
              <span>精准</span>
              <span>平衡</span>
              <span>创造</span>
            </div>
          }
        >
          <Slider max={2} min={0} step={0.1} />
        </Form.Item>
        <Form.Item label="OpenAI Chat 上下文消息数量" name="maxContextMessageCount">
          <InputNumber className="!w-full" max={20} min={1} precision={0} />
        </Form.Item>
        <Form.Item label="人格指定" name="systemPersonality">
          <Input.TextArea
            placeholder="例如：你是郭德纲，和我对话要用郭德纲的语气风格"
            className="!resize-none"
            rows={3}
          />
        </Form.Item>
        <Button onClick={save} block type="primary" size="large" shape="round" className="mt-8">
          保存
        </Button>
      </Form>
    </div>
  )
}
