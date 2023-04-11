import type { RendererElement, RendererNode, VNode } from 'vue'
import { h, render } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import useRandom from '../../hooks/useRandom'
import Message from './Message.vue'

function createMessage(vnode: VNode<RendererNode, RendererElement, { [key: string]: any }> | null, duration = 3000) {
  const { result } = useRandom(6)
  const node = document.createElement('div')
  node.id = `message-${result.value}`
  document.body.appendChild(node)
  render(vnode, node)
  const { start, stop } = useTimeoutFn(() => {
    node.remove()
    stop()
  }, duration + 100)
  start()
}

const message = {
  /**
     * 成功消息
     * @param {string} [text] 消息内容
     * @param {number} [duration] 消息显示时间
     */
  success: (text?: string, duration?: number) => {
    const vnode = h(Message, { type: 'success', message: text, duration })
    createMessage(vnode, duration)
  },
  /**
     * 错误消息
     * @param {string} [text] 消息内容
     * @param {number} [duration] 消息显示时间
     */
  error: (text?: string, duration?: number) => {
    const vnode = h(Message, { type: 'error', message: text, duration })
    createMessage(vnode, duration)
  },
  /**
     * 警告消息
     * @param {string} [text] 消息内容
     * @param {number} [duration] 消息显示时间
     */
  warn: (text?: string, duration?: number) => {
    const vnode = h(Message, { type: 'warn', message: text, duration })
    createMessage(vnode, duration)
  },
  /**
     * 信息消息
     * @param {string} [text] 消息内容
     * @param {number} [duration] 消息显示时间
     */
  info: (text?: string, duration?: number) => {
    const vnode = h(Message, { type: 'info', message: text, duration })
    createMessage(vnode, duration)
  }
}

export default message
