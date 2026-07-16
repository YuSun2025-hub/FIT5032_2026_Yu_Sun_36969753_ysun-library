import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import { auth } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global Front Guard
router.beforeEach((to, from, next) => {
  // If the target route requires authentication and the user is not logged in
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // Redirect to the AccessDenied page and carry the original target path as a query parameter
    next({ path: '/access-denied', query: { redirect: to.fullPath }  })
  }
  // If the user is already logged in, prevent them from accessing the login page (to avoid re-login)
  else if (to.path === '/login' && auth.isAuthenticated) {
    next('/')
  }
  // If the user is not authenticated and the target route does not require authentication, allow navigation
  else {
    next()
  }
})

export default router