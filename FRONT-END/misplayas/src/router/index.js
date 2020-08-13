import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { isLoggedIn } from '../api/utils.js'
import { checkIsAdmin } from '../api/utils.js'

Vue.use(VueRouter)
//PENDIENTE PROTEGER RUTAS
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      allowAnon: true
    }
  },
  {
    path: '/search',
    name: 'Buscador',
    component: () => import('../views/beachviews/Advancedsearch.vue'),
    meta: {
      allowAnon: true
    }
  },

  {
    path: '/lista Playas',
    name: 'Listbeaches',
    component: () => import('../views/beachviews/Listbeaches.vue'),
    meta: {
      allowAnon: false,
      onlyAdmin: true
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdmin()) {
        next({
          path: '/',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/lista Usuarios',
    name: 'Listusers',
    component: () => import('../views/usersviews/Listusers.vue'),
    beforeEnter: (to, from, next) => {
      if (to.meta.onlyAdmin === true && !checkIsAdmin()) {
        next({
          path: '/',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }
  },
  {
    path: '/playa/:id',
    name: 'Playa',
    component: () => import('../views/beachviews/Beach.vue'),
    meta: {
      allowAnon: true
    }
  },

  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      allowAnon: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/usersviews/Login.vue'),
    meta: {
      allowAnon: true
    }
  },
  {
    path: '/Register',
    name: 'Registro',
    component: () => import('../views/usersviews/Register.vue'),
    meta: {
      allowAnon: true
    },

  },
  {
    path: '/user',
    name: 'Usuario',
    component: () => import('../views/usersviews/User.vue'),
    meta: {
      allowAnon: false
    }
  },
  {
    path: '/uploads',
    name: 'Uploads',
    component: () => import('../views/beachviews/Uploadphoto.vue'),
    meta: {
      allowAnon: false
    }
  },


  {
    path: '*',
    name: 'Error',
    component: () => import('../views/Error.vue'),
    meta: {
      allowAnon: true
    }

  }
]

const router = new VueRouter({
  routes
})

//FUNCIÓN QUE PERMITE SABER SI EL USUARIO ESTÁ LOGADO ANTES DE HACER NADA
//PARA SABER A DÓNDE DEJARLO PASAR Y A DÓNDE NO

router.beforeEach((to, from, next) => {
  if (!to.meta.allowAnon && !isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
