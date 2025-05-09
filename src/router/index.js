import { createRouter, createWebHistory } from 'vue-router'
import ScheduleView from '../views/Schedule.vue'
import LeaderboardView from '../views/Leaderboard.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  {
    path: '/',
    redirect: '/schedule'
  },
  {
    path: '/schedule',
    name: 'ScheduleView',
    component: ScheduleView
  },
  {
    path: '/leaderboard',
    name: 'LeaderboardView',
    component: LeaderboardView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 