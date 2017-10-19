import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'file-manager',
      component: require('@/components/FileManager')
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
