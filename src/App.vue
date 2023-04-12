<script setup lang="ts">
import { message, messageBox } from './components'
import Pdf from './components/pdf/Pdf.vue'

function cs() {
  messageBox({ text: '测试' }).then(() => {
    message.success('测试1', 3000)
  })
}
</script>

<template>
  <button v-focus @click="cs">
    测试
  </button>
  <Pdf src="/123.pdf" />
</template>

<style scoped>
</style>
