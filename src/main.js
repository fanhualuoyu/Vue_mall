import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from 'components/common/toast'

//提示信息
Vue.config.productionTip = false

//注册$bus
Vue.prototype.$bus = new Vue()

//安装toast插件
Vue.use(toast)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
