import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/beachviews/Home.vue'

Vue.use(VueRouter)
//PENDIENTE PROTEGER RUTAS
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    name: 'Buscador',
    component: () => import('../views/beachviews/Advancedsearch.vue')
  },
  {
    path: '/beach/:id',
    name: 'Playa',
    component: () => import('../views/beachviews/Beach.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/usersviews/Login.vue')
  },
  {
    path: '/Register',
    name: 'Registro',
    component: () => import('../views/usersviews/Register.vue')
  },
  {
    path: '/user',
    name: 'Usuario',
    component: () => import('../views/usersviews/User.vue')
  },


  {
    path: '*',
    name: 'Error',
    component: () => import('../views/Error.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
