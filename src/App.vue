<script setup lang="ts">
import { message, messageBox } from './components'

function cs() {
 messageBox({ text: "测试" }).then(() => {
  message.success('测试1', 3000)
 })
}
</script>

<template>
 <button @click="cs">测试</button>
</template>

<style scoped>
</style>
