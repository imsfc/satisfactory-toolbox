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

if (import.meta.env.DEV) {
  router.addRoute({
    path: '/dev',
    component: Layout,
    children: [
      {
        path: 'items',
        component: () => import('@/views/dev/ItemsView'),
      },
      {
        path: 'buildings',
        component: () => import('@/views/dev/BuildingsView'),
      },
    ],
  })
}

export default router
