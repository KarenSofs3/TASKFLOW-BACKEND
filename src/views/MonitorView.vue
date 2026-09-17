<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRequestStore } from '@/store/requestStore'
import {
  Server,
  Database,
  Layers,
  Cpu,
  Globe,
  CheckCircle2,
  XCircle,
  Activity,
  RefreshCw,
  Clock,
  Zap
} from 'lucide-vue-next'

const store = useRequestStore()
let pollInterval = null

onMounted(async () => {
  await store.fetchSystemStatus()
  await store.fetchDashboardStats()

  // Polling automático cada 5s para detectar latidos del Worker en Redis
  pollInterval = setInterval(async () => {
    await store.fetchSystemStatus()
    await store.fetchDashboardStats()
  }, 5000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

const reload = async () => {
  await store.fetchSystemStatus()
  await store.fetchDashboardStats()
}

// Simulador didáctico para el Reto de Presentación SENA
const toggleWorkerStatus = () => {
  const current = store.services.worker.status
  store.services.worker.status = current === 'disponible' ? 'detenido' : 'disponible'
}
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Monitor del Sistema</h2>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Docker Compose Health
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-0.5">
          Estado en tiempo real de los servicios distribuidos y métricas de la cola.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="toggleWorkerStatus"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300"
          title="Permite simular la prueba de Worker apagado del taller"
        >
          <span>Simular Worker: {{ store.services.worker.status === 'disponible' ? 'Apagar' : 'Encender' }}</span>
        </button>

        <button
          @click="reload"
          class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': store.loading }" />
          <span>Refrescar</span>
        </button>
      </div>
    </div>

    <!-- TARJETAS DE LOS 5 SERVICIOS -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <!-- 1. Backend Express -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Server class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Backend API</h4>
              <p class="text-xs text-slate-500">Node.js + Express + Socket.IO</p>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1',
              store.services.backend.status === 'disponible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            ]"
          >
            <CheckCircle2 v-if="store.services.backend.status === 'disponible'" class="w-3 h-3 text-emerald-500" />
            <XCircle v-else class="w-3 h-3 text-rose-500" />
            {{ store.services.backend.status === 'disponible' ? 'Disponible' : 'Sin conexión' }}
          </span>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <span>Puerto anfitrión: <strong>:3000</strong></span>
          <span>Latencia: <strong>{{ store.services.backend.latency || '5ms' }}</strong></span>
        </div>
      </div>

      <!-- 2. MongoDB -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
              <Database class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">MongoDB</h4>
              <p class="text-xs text-slate-500">Persistencia con Volumen Docker</p>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1',
              store.services.mongodb.status === 'disponible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            ]"
          >
            <CheckCircle2 class="w-3 h-3 text-emerald-500" />
            {{ store.services.mongodb.status === 'disponible' ? 'Disponible' : 'Error DB' }}
          </span>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <span>Puerto interno: <strong>:27017</strong></span>
          <span>Volumen: <strong>mongo_data</strong></span>
        </div>
      </div>

      <!-- 3. Redis -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Zap class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Redis Server</h4>
              <p class="text-xs text-slate-500">Caché & Cola de Tareas</p>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1',
              store.services.redis.status === 'disponible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
            ]"
          >
            <CheckCircle2 class="w-3 h-3 text-emerald-500" />
            {{ store.services.redis.status === 'disponible' ? 'Disponible' : 'Sin conexión' }}
          </span>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <span>Puerto interno: <strong>:6379</strong></span>
          <span>Cola: <strong>taskflow_queue</strong></span>
        </div>
      </div>

      <!-- 4. Worker Node.js -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center font-bold',
                store.services.worker.status === 'disponible' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
              ]"
            >
              <Cpu class="w-5 h-5" :class="{ 'animate-spin': store.services.worker.status === 'disponible' }" />
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Worker Node.js</h4>
              <p class="text-xs text-slate-500">Procesador Asíncrono de Reglas</p>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1',
              store.services.worker.status === 'disponible'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            ]"
          >
            <span v-if="store.services.worker.status === 'disponible'" class="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
            <span v-else class="w-2 h-2 rounded-full bg-rose-600" />
            {{ store.services.worker.status === 'disponible' ? 'Consumiendo Cola' : 'Detenido' }}
          </span>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <span>Contenedor: <strong>taskflow_worker</strong></span>
          <span>Reglas activas: <strong>5 categorías</strong></span>
        </div>
      </div>

      <!-- 5. Frontend Vue 3 -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Globe class="w-5 h-5" />
            </div>
            <div>
              <h4 class="font-bold text-slate-900 text-sm">Frontend Vue 3</h4>
              <p class="text-xs text-slate-500">Single Page Application (Vite)</p>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 class="w-3 h-3 text-emerald-500" />
            Disponible
          </span>
        </div>
        <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500">
          <span>Puerto: <strong>:5173</strong></span>
          <span>Socket: <strong>{{ store.socketConnected ? 'Conectado' : 'Conectando...' }}</strong></span>
        </div>
      </div>
    </div>

    <!-- PANEL RESUMEN DE LA COLA EN TIEMPO REAL -->
    <div class="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <Activity class="w-5 h-5 text-indigo-400" />
            Estado de la Cola de Procesamiento (Redis Queue)
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            Monitoreo en vivo de los trabajos pendientes y despachados.
          </p>
        </div>
        <div class="text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300">
          Cola activa: <strong class="text-white">cola_solicitudes</strong>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 text-center">
        <div>
          <p class="text-3xl font-black text-blue-400 font-mono">{{ store.stats.enCola }}</p>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">En Cola de Espera</p>
        </div>
        <div>
          <p class="text-3xl font-black text-purple-400 font-mono">{{ store.stats.procesando }}</p>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">En Procesamiento</p>
        </div>
        <div>
          <p class="text-3xl font-black text-emerald-400 font-mono">{{ store.stats.respondidas }}</p>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Finalizadas / Respondidas</p>
        </div>
        <div>
          <p class="text-3xl font-black text-rose-400 font-mono">{{ store.stats.errores }}</p>
          <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Errores</p>
        </div>
      </div>
    </div>
  </div>
</template>
