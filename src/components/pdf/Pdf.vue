<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import * as pdf from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

const props = withDefaults(defineProps<Props>(), {
  src: ''
})

pdf.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdf.version}/pdf.worker.js`

interface Props {
  src: string
}

const url = ref<string>()
const pdfData = ref({
  pdfPages: 0,
  pdfScale: 1.0
})

let pdfDoc: PDFDocumentProxy
const canvasRef = ref<HTMLCanvasElement[]>([])
const pdfBoxRef = ref<HTMLDivElement>()
const index = ref<number>(1)

onMounted(async () => {
  const blob = await fetch(props.src).then(res => res.blob())
  url.value = URL.createObjectURL(blob)
  loadFile(props.src)
})

function loadFile(url: string) {
  const loadingTask = pdf.getDocument({
    url,
    useWorkerFetch: false,
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdf.version}/cmaps/`,
    withCredentials: true
  })

  loadingTask.promise.then((pdf) => {
    pdfDoc = pdf
    pdfData.value.pdfPages = pdf.numPages
    nextTick(() => renderPage(index.value))
  })
}

async function renderPage(num: number) {
  if (num > pdfData.value.pdfPages) {
    index.value--
    return
  }

  if (num < 1) {
    index.value++
    return
  }

  const page = await pdfDoc?.getPage(num)
  if (!page)
    return

  const canvas = canvasRef.value?.[index.value - 1]
  if (!canvas)
    return

  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  const ratio = 1
  const viewport = page.getViewport({ scale: pdfData.value.pdfScale })
  canvas.width = viewport.width * ratio
  canvas.height = viewport.height * ratio
  canvas.style.width = `${viewport.width}px`
  canvas.style.height = `${viewport.height}px`
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)

  const renderContext = {
    canvasContext: ctx,
    viewport
  }

  page.render(renderContext)
}
</script>

<template>
  <div ref="pdfBoxRef">
    <canvas
      v-for="item in pdfData.pdfPages"
      v-show="item === index"
      :id="`pdfCanvas${item}`"
      ref="canvasRef"
      :key="item"
    />
  </div>
  <button @click="index++; renderPage(index)">
    下一页
  </button>
  <button @click="index--; renderPage(index)">
    上一页
  </button>
</template>
