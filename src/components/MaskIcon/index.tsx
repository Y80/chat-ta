import classNames from 'classnames'
import style from './index.module.css'

/**
 * 遮罩图标，通过 CSS 传入背景色，生成实际的图标颜色
 * @param src 带有透明色的图标资源路径
 */
export default function MaskIcon(props: { src: string; className?: string }) {
  return (
    <span
      className={classNames(
        style.icon,
        'inline-block cursor-pointer bg-gray-600 hover:opacity-80',
        props.className
      )}
      style={{ '--url': `url(${props.src})` } as any}
    />
  )
}
