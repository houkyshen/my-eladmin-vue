import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "@/views/Login";
import {getToken} from "@/utils/auth";

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

//假如用户A没有登录，访问了Login页面
router.beforeEach((to, from, next) => {
  if (getToken() !== 'undefined'){//已登录
    if (to.name === 'Login') next('/dashboard') // 如果访问的是登陆页面，直接跳转到主页
    else next() //想去哪里就去哪里
  }else if (to.path !== '/')
    //没有登录
    next({path:'/'}) //如果不是登陆页面，重定向到登陆页面
  else next() //如果是登陆页面，就直接放行
})

export default router
