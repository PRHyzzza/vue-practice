<script setup lang="ts">
import { ref } from 'vue'
import usePdfViewer from '../../hooks/usePdfViewer'

interface Props {
  src: string
  blob?: boolean
  width?: number
  height?: number
  maxZoom?: number
}

// 设置默认属性值
const props = withDefaults(defineProps<Props>(), {
  src: '',
  blob: false,
  width: 400,
  height: 600,
  maxZoom: 2
})

const canvasRef = ref<HTMLCanvasElement[]>([])

const { pdfData, index, previous, next, shrink, enlarge, download } = usePdfViewer(canvasRef, { ...props })
</script>

<template>
  <div v-loading>
    <canvas
      v-for="item in pdfData.pdfPages"
      v-show="item === index"
      :id="`pdfCanvas${item}`"
      ref="canvasRef"
      :key="item"
    />
  </div>
  <button @click="next">
    下一页
  </button>
  <button @click="previous">
    上一页
  </button>
  <button @click="shrink">
    缩小
  </button>
  <button @click="enlarge">
    放大
  </button>
  <button @click="download()">
    下载
  </button>
</template>
