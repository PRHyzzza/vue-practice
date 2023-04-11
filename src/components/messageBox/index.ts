import { h, render } from 'vue'
import useRandom from '../../hooks/useRandom'
import MessageBox from './MessageBox.vue'

/**
 * 消息框选项
 * @param text 消息文本
 * @param title 消息标题
 * @param showConfirm 是否显示确认按钮
 * @param showClose 是否显示关闭按钮
 * @param closeText 关闭按钮文本
 * @param confirmText 确认按钮文本
 * @param color 消息框颜色
 * @param showConfirmCallback 是否显示确认回调
 * @param showCloseCallback 是否显示关闭回调
 */
interface Props {
  text?: string
  title?: string
  showConfirm?: boolean
  showClose?: boolean
  closeText?: string
  confirmText?: string
  color?: string
  showConfirmCallback?: boolean
  showCloseCallback?: boolean
}

export default (options: Props) => {
  // 生成唯一ID
  const { result } = useRandom(6)
  // 创建新的div元素
  const node = document.createElement('div')
  node.id = `messageBox-${result.value}`
  document.body.appendChild(node)
  // 销毁div元素
  function close() {
    render(null, node)
    node.remove()
  }
  // 返回Promise对象
  return new Promise((resolve, reject) => {
    // 创建回调函数
    const confirmCallback = (showConfirmCallback: boolean) => {
      close()
      if (showConfirmCallback)
        resolve('confirm')
    }
    const closeCallback = (showCloseCallback: boolean) => {
      close()
      if (showCloseCallback)
        reject(new Error('close'))
    }

    // 渲染MessageBox组件
    const vNode = h(MessageBox, {
      confirmCallback,
      closeCallback,
      ...options,
    })
    render(vNode, node)
  })
}
