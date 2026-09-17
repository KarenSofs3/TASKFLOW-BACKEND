<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRequestStore } from '@/store/requestStore'
import StatCard from '@/components/StatCard.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import { formatDate } from '@/utils/formatDate'
import {
  Inbox,
  Clock,
  Layers,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlusCircle,
  RefreshCw
} from 'lucide-vue-next'

const router = useRouter()
const store = useRequestStore()

onMounted(async () => {
  await store.fetchRequests()
  await store.fetchDashboardStats()
})

const reload = async () => {
  await store.fetchRequests()
  await store.fetchDashboardStats()
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header de bienvenida y recarga -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Dashboard General</h2>
        <p class="text-sm text-slate-500 mt-1">
          Monitor de flujo de solicitudes y métricas de procesamiento asíncrono.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="reload"
          :disabled="store.loading"
          class="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Actualizar datos"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': store.loading }" />
          <span>Actualizar</span>
        </button>
        <button
          @click="router.push('/solicitudes/nueva')"
          class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Registrar Solicitud</span>
        </button>
      </div>
    </div>

    <!-- TARJETAS DE MÉTRICAS (StatCards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <!-- Total -->
      <StatCard
        title="Total"
        :value="store.stats.total"
        color="indigo"
        description="Registradas en sistema"
      >
        <template #icon>
          <Inbox class="w-5 h-5 text-indigo-600" />
        </template>
      </StatCard>

      <!-- Pendientes -->
      <StatCard
        title="Pendientes"
        :value="store.stats.pendientes"
        color="amber"
        description="Por enviar a cola"
      >
        <template #icon>
          <Clock class="w-5 h-5 text-amber-600" />
        </template>
      </StatCard>

      <!-- En Cola (Redis) -->
      <StatCard
        title="En Cola"
        :value="store.stats.enCola"
        color="blue"
        description="En espera en Redis"
      >
        <template #icon>
          <Layers class="w-5 h-5 text-blue-600" />
        </template>
      </StatCard>

      <!-- Procesando (Worker) -->
      <StatCard
        title="Procesando"
        :value="store.stats.procesando"
        color="purple"
        description="Tomadas por Worker"
      >
        <template #icon>
          <Cpu class="w-5 h-5 text-purple-600 animate-pulse" />
        </template>
      </StatCard>

      <!-- Respondidas -->
      <StatCard
        title="Respondidas"
        :value="store.stats.respondidas"
        color="emerald"
        description="Con respuesta lista"
      >
        <template #icon>
          <CheckCircle2 class="w-5 h-5 text-emerald-600" />
        </template>
      </StatCard>

      <!-- Errores -->
      <StatCard
        title="Errores"
        :value="store.stats.errores"
        color="rose"
        description="Fallos controlados"
      >
        <template #icon>
          <AlertTriangle class="w-5 h-5 text-rose-600" />
        </template>
      </StatCard>
    </div>

    <!-- TABLA DE SOLICITUDES RECIENTES -->
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="p-5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 class="text-base font-bold text-slate-900">Solicitudes Recientes</h3>
          <p class="text-xs text-slate-500 mt-0.5">Últimas actividades registradas en el flujo</p>
        </div>
        <button
          @click="router.push('/solicitudes')"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <span>Ver todas ({{ store.requests.length }})</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Tabla -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              <th scope="col" class="px-5 py-3.5">ID</th>
              <th scope="col" class="px-5 py-3.5">Asunto / Título</th>
              <th scope="col" class="px-5 py-3.5">Categoría</th>
              <th scope="col" class="px-5 py-3.5">Prioridad</th>
              <th scope="col" class="px-5 py-3.5">Estado</th>
              <th scope="col" class="px-5 py-3.5">Fecha</th>
              <th scope="col" class="px-5 py-3.5 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="req in store.recentRequests"
              :key="req.id || req._id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="px-5 py-4 font-mono text-xs font-semibold text-slate-800">
                #{{ req.id || req._id?.slice(-6) }}
              </td>
              <td class="px-5 py-4 font-medium text-slate-900 max-w-xs truncate">
                {{ req.titulo }}
              </td>
              <td class="px-5 py-4">
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-medium">
                  {{ req.categoria }}
                </span>
              </td>
              <td class="px-5 py-4">
                <PriorityBadge :priority="req.prioridad" />
              </td>
              <td class="px-5 py-4">
                <StatusBadge :status="req.estado" />
              </td>
              <td class="px-5 py-4 text-xs text-slate-500">
                {{ formatDate(req.fechaCreacion) }}
              </td>
              <td class="px-5 py-4 text-right">
                <button
                  @click="router.push(`/solicitudes/${req.id || req._id}`)"
                  class="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Detalle
                  <ArrowRight class="w-3 h-3" />
                </button>
              </td>
            </tr>

            <tr v-if="store.requests.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-slate-400">
                <Inbox class="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p class="font-medium text-slate-600">No hay solicitudes registradas aún</p>
                <p class="text-xs text-slate-400 mt-1">Registra tu primera solicitud para iniciar el flujo de procesamiento asíncrono.</p>
                <button
                  @click="router.push('/solicitudes/nueva')"
                  class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                >
                  Crear primera solicitud
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
