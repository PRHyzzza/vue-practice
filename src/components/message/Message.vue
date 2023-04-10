<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { closeInstance, getColorByStatus, getHeight, getImageByStatus, messageType, setInstance } from './instance';
import useRandom from '../../hooks/useRandom';

interface Props {
  duration?: number
  message?: string
  type?: messageType
  zIndex?: number
}
// - duration：消息显示的时间（以毫秒为单位）。默认值为3000。
// - message：要显示的消息文本。默认为空字符串。
// - type：消息类型。默认为“info”。
// - zIndex：消息的z-index值。默认为9000。
const props = withDefaults(defineProps<Props>(), {
  duration: 3000,
  message: '',
  type: 'info',
  zIndex: 9000
})

const { result } = useRandom(6)
const show = ref<boolean>(false) // 是否显示通知
const messageRef = ref<HTMLDivElement>() // 通知的 HTMLDivElement 引用
const color = computed(() => getColorByStatus(props.type!)) // 根据 type prop 返回颜色
const img = computed(() => getImageByStatus(props.type!)) // 根据 type prop 返回图像
const top = computed(() => getHeight(result.value)) // 根据 id 值返回通知的高度

onMounted(() => {
  startTimer() // 启动计时器
  setInstance(result.value, messageRef.value) // 设置实例
  show.value = true // 显示通知
})

const { start, stop } = useTimeoutFn(() => {
  close()
  stop()
}, props.duration!)

// 开始计时器
function startTimer() {
  // 如果持续时间为 0，则返回
  if (props.duration === 0) return
  start()
}

// 停止计时器
function clearTimer() {
  stop()
}

// 关闭弹窗
function close() {
  // 将 show 值设置为 false
  show.value = false
  // 关闭实例
  closeInstance(result.value)
}

// 将 close 函数暴露出去
defineExpose({
  close
})
</script>

<template>
  <transition name="message">
    <div v-show="show" class="message" ref="messageRef" @mouseenter="clearTimer" @mouseleave="startTimer">
      <img :src="img">
      <span v-if="props.message" v-html="props.message" class="message-text"></span>
    </div>
  </transition>
</template>

<style scoped>
.message {
  position: absolute;
  top: v-bind(top);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: v-bind(color);
  z-index: v-bind(zIndex);
  transition: all 0.4s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
  border-radius: 4px;
  font-weight: 400;
  padding: 4px 16px;
  height: 32px;
}

.message-text {
  color: #fff;
  line-height: 16px;
  margin-left: 4px;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
</style>
