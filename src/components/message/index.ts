import { RendererElement, RendererNode, VNode, h, render } from 'vue'
import Message from './Message.vue'
import { useTimeoutFn } from '@vueuse/core'

function createMessage(vnode: VNode<RendererNode, RendererElement, { [key: string]: any }> | null, duration: number = 3000) {
    const node = document.createElement('div')
    node.id = "message"
    document.body.appendChild(node)
    render(vnode, node)
    const { start, stop } = useTimeoutFn(() => {
        node.remove()
        stop()
    }, duration + 100)
    start()
}

const message = {
    success: (text?: string, duration?: number) => {
        const vnode = h(Message, { type: 'success', message: text, duration })
        createMessage(vnode, duration)
    },
    error: (text?: string, duration?: number) => {
        const vnode = h(Message, { type: 'error', message: text, duration })
        createMessage(vnode, duration)
    },
    warn: (text?: string, duration?: number) => {
        const vnode = h(Message, { type: 'warn', message: text, duration })
        createMessage(vnode, duration)
    },
    info: (text?: string, duration?: number) => {
        const vnode = h(Message, { type: 'info', message: text, duration })
        createMessage(vnode, duration)
    }
}

export default message