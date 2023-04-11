<script setup lang="ts">
import { getDocument } from 'pdfjs-dist'
import {
  DefaultAnnotationLayerFactory,
  DefaultTextLayerFactory,
  EventBus,
  PDFFindController,
  PDFLinkService,
  PDFPageView
} from 'pdfjs-dist/web/pdf_viewer.js'
import { onMounted, ref } from 'vue'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import type { PDFPageViewOptions } from 'pdfjs-dist/types/web/pdf_page_view'

interface Props {
  src: string
}

const props = withDefaults(defineProps<Props>(), {
  src: ''
})

const pdfDocument = ref<PDFDocumentProxy>()
const pdfContent = ref<HTMLDivElement>()
const pdfPages = ref<PDFPageView[]>([])

onMounted(async () => {
  await loadFile()
  await drawPdf(1)
})

async function loadFile() {
  pdfDocument.value = await getDocument(props.src).promise
}

async function drawPdf(pageNum: number) {
  if (pageNum > pdfDocument.value!.numPages)
    return
  const page = await pdfDocument.value?.getPage(pageNum)
  const pdfPageView = new PDFPageView({
    container: pdfContent.value!,
    id: pageNum,
    scale: 1,
    defaultViewport: page!.getViewport({ scale: 1 }),
    eventBus: new EventBus(),
    annotationLayerFactory: new DefaultAnnotationLayerFactory(),
    textLayerFactory: new DefaultTextLayerFactory(),
    linkService: new PDFLinkService(),
    findController: new PDFFindController({ eventBus: new EventBus(), linkService: new PDFLinkService() })
  } as PDFPageViewOptions)
  pdfPageView.setPdfPage(page)
  pdfPages.value.push(pdfPageView)
  pdfPageView.draw()
}
</script>

<template>
  <div>
    <div ref="pdfContent" />
  </div>
</template>
