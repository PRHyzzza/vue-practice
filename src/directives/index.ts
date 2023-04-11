import type { App } from 'vue'

const focus = {
  mounted: (el: HTMLElement) => el.focus(),
}

export default {
  install(app: App<Element>) {
    app.directive('focus', focus)
  },
}
