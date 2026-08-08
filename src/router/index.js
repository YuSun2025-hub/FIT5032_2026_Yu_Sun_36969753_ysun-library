import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AddBookView from '@/views/AddBookView.vue'
import WeatherView from '@/views/WeatherView.vue'
import CountBookAPIView from '@/views/CountBookAPI.vue' 
import GetAllBookAPIView from '@/views/GetAllBookAPI.vue'
import GetBookCountView from '@/views/GetBookCountView.vue'
import DrawCardView from '@/views/DrawCardView.vue'

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
  },
  {
    path:'/FireLogin',
    name:'FireLogin',
    component:FirebaseSigninView
  },
  {
    path:'/FireRegister',
    name:'FireRegister',
    component:FirebaseRegisterView
  },
  {
    path:'/addbook',
    name:'AddBook',
    component:AddBookView
  },
  {
    path:'/WeatherCheck',
    name:'WeatherCheck',
    component:WeatherView
  },
  {  
    path:'/CountBookAPI',
    name:'CountBookAPI',
    component:CountBookAPIView
  },
  {
    path:'/GetAllBookAPI',
    name:'GetAllBookAPI',
    component:GetAllBookAPIView
  },
  {
    path:'/GetBookCount',
    name:'GetBookCount',
    component:GetBookCountView
  },
  {
    path:'/DrawCard',
    name:'DrawCard',
    component:DrawCardView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router