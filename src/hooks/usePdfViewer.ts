import type { Ref } from 'vue'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import * as pdf from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import useDownFile from './useDownFile'

pdf.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdf.version}/pdf.worker.js`

interface Props {
  src: string
  blob?: boolean
  width?: number
  height?: number
  maxZoom?: number
}

export default (canvasRef: Ref<HTMLCanvasElement[]>, options: Props) => {
  let pdfDoc: PDFDocumentProxy
  const pdfData = ref({
    pdfPages: 0,
    pdfScale: 1,
  })
  const url = ref<string>() // PDF文件的URL
  const index = ref(1)

  async function init() {
    if (options.blob) {
      const blob = await fetch(options.src).then(res => res.blob()) // 获取Blob
      url.value = URL.createObjectURL(blob) // 设置URL为Blob的object URL
    }
    else {
      url.value = options.src
    }
  }

  const renderPage = async (pageNum: number) => {
    const page = await pdfDoc?.getPage(pageNum) // 获取页面
    if (!page)
      return

    const canvas = canvasRef.value?.[index.value - 1] // 获取画布
    if (!canvas)
      return

    const ctx = canvas.getContext('2d') // 获取画布上下文
    if (!ctx)
      return

    const ratio = 1 // 缩放比例
    const viewport = page.getViewport({ scale: pdfData.value.pdfScale }) // 获取视口
    canvas.width = viewport.width * ratio // 设置画布宽度
    canvas.height = viewport.height * ratio // 设置画布高度
    canvas.style.width = `${viewport.width}px` // 设置画布样式宽度
    canvas.style.height = `${viewport.height}px` // 设置画布样式高度
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0) // 设置画布变换矩阵

    const renderContext = {
      canvasContext: ctx,
      viewport
    }
    page.render(renderContext) // 渲染页面
  }

  function previous() {
    index.value = (index.value - 1 + pdfData.value.pdfPages) % pdfData.value.pdfPages || pdfData.value.pdfPages
    renderPage(index.value)
  }

  function next() {
    index.value = (index.value % pdfData.value.pdfPages) + 1
    renderPage(index.value)
  }

  function shrink() {
    pdfData.value.pdfScale = Math.max(pdfData.value.pdfScale - 0.1, 0.1)
    renderPage(index.value)
  }

  function enlarge() {
    pdfData.value.pdfScale = Math.min(pdfData.value.pdfScale + 0.1, options.maxZoom!)
    renderPage(index.value)
  }

  const loadPdf = async () => {
    const loadingTask = pdf.getDocument({
      url: options.src,
      useWorkerFetch: false,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdf.version}/cmaps/`,
      withCredentials: true
    })

    loadingTask.promise.then((pdf) => {
      pdfDoc = pdf // 设置pdfDoc为PDF文档对象
      pdfData.value.pdfPages = pdf.numPages // 设置页面数
      nextTick(() => renderPage(index.value)) // 渲染第一页
    }).catch((err) => {
      console.error(`pdf加载失败：${err}`)
    })
  }

  function download(fileName?: string) {
    const { downloadFile } = useDownFile(fileName)
    downloadFile(options.src)
  }

  onMounted(() => {
    init()
    loadPdf()
  })

  onUnmounted(() => {
    pdfDoc?.destroy()
  })

  return {
    pdfData,
    index,
    previous,
    next,
    shrink,
    enlarge,
    download
  }
}
