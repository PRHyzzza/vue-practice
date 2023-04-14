import type { Ref } from 'vue'
import { onMounted, ref } from 'vue'

export default (box: Ref<HTMLElement | undefined>) => {
  const scrollbarWidth = ref(0)

  onMounted(() => {
    scrollbarWidth.value = box.value!.offsetWidth - box.value!.clientWidth
  })

  return {
    scrollbarWidth
  }
}
