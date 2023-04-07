<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTimeoutFn } from '@vueuse/core'
import { closeInstance, generateRandomString, getColorByStatus, getHeight, getImageByStatus, messageType, setInstance } from '../instance';

interface Props {
 duration?: number
 message?: string
 type?: messageType
 zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
 duration: 30000,
 message: '121212',
 type: 'info',
 zIndex: 9000
})

const id = ref(generateRandomString(6))
const show = ref<boolean>(false)
const messageRef = ref<HTMLDivElement>()
const color = computed(() => getColorByStatus(props.type!))
const img = computed(() => getImageByStatus(props.type!))
const top = computed(() => getHeight(id.value))

onMounted(() => {
 startTimer()
 setInstance(id.value, messageRef.value)
 show.value = true
})

const { start, stop } = useTimeoutFn(() => {
 close()
 stop()
}, props.duration!)

function startTimer() {
 if (props.duration === 0) return
 start()
}

function clearTimer() {
 stop()
}

function close() {
 show.value = false
 closeInstance(id.value)
}

defineExpose({
 close
})
</script>

<template>
 <teleport to="body">
  <transition name="message">
   <div v-show="show" class="message" ref="messageRef" @mouseenter="clearTimer" @mouseleave="startTimer">
    <img :src="img">
    <span v-html="props.message" class="message-text"></span>
   </div>
  </transition>
 </teleport>
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
 box-shadow: 0 4px 12px rgba(0, 0, 0, .15);
 transition: top .4s ease;
 border-radius: 4px;
 font-weight: 400;
 padding: 4px 16px;
 height: 32px;
}

.message-text {
 color: #fff;
 line-height: 16px;
}
</style>
