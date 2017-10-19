import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/es'
import 'element-ui/lib/theme-default/index.css'

import axios from 'axios'

import App from './App'
import router from './router'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(ElementUI, { locale })

var EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')
