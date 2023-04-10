<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { ref, onMounted } from 'vue'

interface Props {
 text?: string
 title?: string
 confirmCallback: (showConfirmCallback: boolean) => void
 closeCallback: (showCloseCallback: boolean) => void
 showConfirm?: boolean
 showClose?: boolean
 closeText?: string
 confirmText?: string
 color?: string
 showConfirmCallback?: boolean
 showCloseCallback?: boolean,
}

const props = withDefaults(defineProps<Props>(), {
 title: "提示",
 text: "",
 showClose: true,
 showConfirm: true,
 closeText: '取消',
 confirmText: '确定',
 color: '#93c5fd',
 showConfirmCallback: true,
 showCloseCallback: false
})

const show = ref(false)

onMounted(() => {
 show.value = true
})

const clickBtn = (type: 'close' | 'confirm') => {
 show.value = false
 const { start, stop } = useTimeoutFn(() => {
  if (type === 'close') {
   props.closeCallback(props.showCloseCallback)
  } else {
   props.confirmCallback(props.showConfirmCallback)
  }
  stop()
 }, 100)
 start()
}
</script>

<template>
 <Transition name="message-box">
  <div v-show="show" class="message-box-mask">
   <div class="message-box-container">
    <div class="message-box-header">
     <div v-html="title"></div>
    </div>
    <div class="message-box-body">
     <div v-html="text"></div>
    </div>
    <div class="message-box-footer">
     <div class="message-box-button close" @click="clickBtn('close')" v-if="showClose" v-text="closeText"></div>
     <div class="message-box-button confirm" @click="clickBtn('confirm')" v-if="showConfirm" v-text="confirmText"></div>
    </div>
   </div>
  </div>
 </Transition>
</template>

<style scoped>
.message-box-mask {
 position: fixed;
 z-index: 9998;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-color: rgba(0, 0, 0, 0.5);
 display: flex;
}

.message-box-container {
 min-width: 400px;
 max-width: 500px;
 margin: auto;
 background-color: #fff;
 border-radius: 5px;
 box-shadow: 0 0 20px rgba(#000, 0.1);
}

.message-box-header {
 padding: 15px 15px 10px;
 font-size: 18px;
 font-weight: bolder;
}

.message-box-body {
 padding: 12px 15px;
 font-size: 14px;
}

.message-box-footer {
 display: flex;
 flex-direction: row;
 justify-content: end;
 padding: 10px 15px 15px;
}

.message-box-button {
 display: inline-block;
 height: 30px;
 line-height: 30px;
 padding: 0 15px;
 cursor: pointer;
 border-radius: 3px;
 user-select: none;
 text-align: center;
 font-size: 14px;
}

.message-box-button:hover {
 opacity: 0.8;
 filter: alpha(opacity=80);
}

.message-box-footer .confirm {
 background: v-bind(color);
 color: #fff;
}

.message-box-footer .close {
 margin-right: 12px;
 background: #f3f3f3;
 color: #333;
}

.message-box-enter-active {
 transition: all .4s ease-out;
}

.message-box-leave-active {
 transition: all .4s ease;
}

.message-box-enter-from,
.message-box-leave-to {
 transform: translateY(-20px);
 opacity: 0;
}
</style>
