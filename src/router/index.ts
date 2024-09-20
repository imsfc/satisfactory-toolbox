import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layouts/Layout'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/',
          component: () => import('@/views/HomeView'),
        },
      ],
    },
  ],
})

export default router
