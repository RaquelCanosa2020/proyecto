import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { isLoggedIn } from '../api/utils.js'
import { checkIsAdmin } from '../api/utils.js'

Vue.use(VueRouter)

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
    path: '/beach/:id',
    name: 'Playa',
    component: () => import('../views/beachviews/Onebeachview.vue'),
    meta: {
      allowAnon: true
    }
  },

  {
    path: '/reservation',
    name: 'Reserva',
    component: () => import('../views/beachviews/Reservationview.vue'),
    meta: {
      allowAnon: false
    },

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
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      allowAnon: true
    }
  },
  {
    path: '/privacy',
    name: 'Privacidad',
    component: () => import('../views/Privacy.vue'),
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
    },


  },
  {
    path: '/Register',
    name: 'Registro',
    component: () => import('../views/usersviews/Register.vue'),
    meta: {
      allowAnon: true
    },
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) {
        next({
          path: '/user',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }

  },
  {
    path: '/validate',
    name: 'Validate',
    component: () => import('../views/usersviews/Validate.vue'),
    meta: {
      allowAnon: true
    },
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) {
        next({
          path: '/user',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }

  },
  {
    path: '/resetpassword',
    name: 'Reset',
    component: () => import('../views/usersviews/Reset.vue'),
    meta: {
      allowAnon: true
    },
    beforeEnter: (to, from, next) => {
      if (isLoggedIn()) {
        next({
          path: '/user',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    }

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
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
