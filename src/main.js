import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// global css
import './assets/styles/index.scss'
import request from "@/utils/request";
import '@/assets/icons/index'
import permission from "@/components/Permission";
import 'default-passive-events' //解决新版的Chrome浏览器警告

Vue.use(Element)
Vue.use(permission)
Vue.config.productionTip = false
Vue.prototype.$request = request //显式的绑定

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
