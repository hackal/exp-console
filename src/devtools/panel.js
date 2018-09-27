import Vue from 'vue'
import root from './root.vue'
import Bus from '../helpers/bus.js'
import VueRouter from 'vue-router'
import Events from './events.vue'
import Settings from './settings.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
const routes = [
  { path: '/events', component: Events },
  { path: '/settings', component: Settings }
]
const router = new VueRouter({ routes })
const tabId = chrome.devtools.inspectedWindow.tabId
const bus = new Bus()
bus.connect(tabId)

Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$tabId', { value: tabId })
Object.defineProperty(Vue.prototype, '$bus', { value: bus })

/* eslint-disable no-new */
new Vue({
  el: '#root',
  render: h => h(root),
  router
})
