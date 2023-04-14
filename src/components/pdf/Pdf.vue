<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import type { mode } from '../../hooks/usePdfViewer'
import usePdfViewer from '../../hooks/usePdfViewer'
import useScrollbar from '../../hooks/useScrollbar'

interface Props {
  src: string
  blob?: boolean
  width?: string | number
  height?: string | number
  maxZoom?: number
  showTools?: boolean
  mode?: mode
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  blob: false,
  width: '596',
  height: '842',
  maxZoom: 2,
  showTools: true,
  mode: 'full'
})

// 定义一个ref，用于存储canvas元素
const canvasRef = ref<HTMLCanvasElement[]>([])

// 定义一个ref，用于存储PDF容器元素
const pdfRef = ref<HTMLElement>()

// 使用useScrollbar hook获取滚动条宽度
const { scrollbarWidth } = useScrollbar(pdfRef)

// 使用useScroll hook获取arrivedState
const { arrivedState } = useScroll(pdfRef)

// 使用usePdfViewer hook获取pdfData、index、next、shrink、enlarge和download函数
const { pdfData, index, next, shrink, enlarge, download } = usePdfViewer(canvasRef, { ...props })

// 定义一个计算属性，用于设置PDF容器元素的宽度样式
const widthStyle = computed(() => {
  return `${parseInt(props.width as string) + scrollbarWidth.value}px`
})

// 定义一个计算属性，用于设置PDF容器元素的高度样式
const heightStyle = computed(() => {
  return `${parseInt(props.height as string)}px`
})

// 监听arrivedState.bottom属性的变化，如果为true则调用next函数
watch(() => arrivedState.bottom, () => {
  if (arrivedState.bottom)
    next()
})
</script>

<template>
  <div ref="pdfRef" class="pdf-box">
    <canvas
      v-for="item in pdfData.pdfPages"
      v-show="item <= index"
      :id="`pdfCanvas${item}`"
      ref="canvasRef"
      :key="item"
    />
  </div>
  <div v-if="showTools" class="pdf-tools">
    <div class="pdf-btn" @click="shrink">
      <img src="./img/ZoomOut.svg">
    </div>
    <div class="pdf-btn" @click="enlarge">
      <img src="./img/ZoomIn.svg">
    </div>
    <button @click="download()">
      下载
    </button>
  </div>
</template>

<style scoped>
.pdf-box {
  width: v-bind(widthStyle);
  height: v-bind(heightStyle);
  overflow-y: scroll;
  overflow-x: auto;
}

.pdf-tools {
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.pdf-btn {
  cursor: pointer;
  width: 24px;
  height: 24px;
  border: none;
  background-color: transparent;
  padding: 4px;
  border-radius: 4px;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.3);
}

.pdf-btn:hover {
  background-color: #f0f0f0;
}

.pdf-btn img {
  width: 100%;
  height: 100%;
}
</style>
