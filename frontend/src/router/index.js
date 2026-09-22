import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '@/views/DashboardView.vue'
import RequestsView from '@/views/RequestsView.vue'
import NewRequestView from '@/views/NewRequestView.vue'
import RequestDetailView from '@/views/RequestDetailView.vue'
import MonitorView from '@/views/MonitorView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard — TASKFLOW' }
  },
  {
    path: '/solicitudes',
    name: 'solicitudes',
    component: RequestsView,
    meta: { title: 'Mis Solicitudes — TASKFLOW' }
  },
  {
    path: '/solicitudes/nueva',
    name: 'nueva-solicitud',
    component: NewRequestView,
    meta: { title: 'Nueva Solicitud — TASKFLOW' }
  },
  {
    path: '/solicitudes/:id',
    name: 'detalle-solicitud',
    component: RequestDetailView,
    meta: { title: 'Detalle de Solicitud — TASKFLOW' }
  },
  {
    path: '/monitor',
    name: 'monitor',
    component: MonitorView,
    meta: { title: 'Monitor de Servicios — TASKFLOW' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
