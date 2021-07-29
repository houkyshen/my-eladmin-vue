import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'Login',
    component: Login
  },

  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Home')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
