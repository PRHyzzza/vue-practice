import { h, render } from "vue"
import useRandom from "../../hooks/useRandom"
import MessageBox from "./MessageBox.vue"

interface Props {
 text?: string
 title?: string
 showConfirm?: boolean
 showClose?: boolean
 closeText?: string
 confirmText?: string
 color?: string
 showConfirmCallback?: boolean
 showCloseCallback?: boolean,
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
   if (showConfirmCallback) resolve("confirm")
  }
  const closeCallback = (showCloseCallback: boolean) => {
   close()
   if (showCloseCallback) reject("close")
  }

  // 渲染MessageBox组件
  const vNode = h(MessageBox, {
   confirmCallback,
   closeCallback,
   ...options
  })
  render(vNode, node)
 })
}
