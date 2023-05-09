import ICON_BACK from '@/assets/images/arrow-back.svg'
import ICON_CLEAR from '@/assets/images/clear.svg'
import ICON_MORE from '@/assets/images/more.svg'
import MaskIcon from '@/components/MaskIcon'
import { eventBus } from '@/utils/event-bus'
import { getMessages, setMessages } from '@/utils/messages'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import style from './index.module.css'

export default function Header() {
  const [hasMessages, setHasMessages] = useState(!!getMessages().length)
  const navigate = useNavigate()
  const location = useLocation()
  const headerRef = useRef<HTMLDivElement>(null)

  eventBus.useListen(eventBus.Name.CHANGE_MESSAGES, (list) => setHasMessages(!!list?.length))

  const showBack = location.pathname !== '/'

  return (
    <header data-tauri-drag-region ref={headerRef} className={style.header}>
      <span className={style.macTitleDotRegion} />
      <span className={style.title}>Chat Ta</span>
      <div className={classNames('flex', !showBack && 'invisible')} onClick={() => navigate('/')}>
        <MaskIcon src={ICON_BACK} />
      </div>
      <div className={classNames(style.iconBox, showBack && 'invisible')}>
        {hasMessages && (
          <button title="清空聊天记录" onClick={() => setMessages([])}>
            <MaskIcon src={ICON_CLEAR} />
          </button>
        )}
        <Link to="/more" title="更多">
          <MaskIcon src={ICON_MORE} />
        </Link>
      </div>
    </header>
  )
}
