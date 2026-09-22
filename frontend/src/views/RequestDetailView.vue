<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRequestStore } from '@/store/requestStore'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import { formatDate } from '@/utils/formatDate'
import {
  ArrowLeft,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  Cpu,
  AlertOctagon,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useRequestStore()

const requestId = computed(() => route.params.id)
const solicitud = ref(null)
const isLoading = ref(true)

const loadData = async () => {
  isLoading.value = true
  try {
    solicitud.value = await store.fetchRequestById(requestId.value)
  } catch (err) {
    console.error('Error cargando solicitud:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header de navegación -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button
          @click="router.push('/solicitudes')"
          class="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          title="Volver a solicitudes"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <div class="flex items-center gap-2.5">
            <h2 class="text-2xl font-bold text-slate-900 tracking-tight">
              Solicitud #{{ solicitud?.id || solicitud?._id?.slice(-6) || requestId }}
            </h2>
            <StatusBadge v-if="solicitud" :status="solicitud.estado" />
          </div>
          <p class="text-xs text-slate-500 mt-0.5">Trazabilidad y resultado del procesamiento</p>
        </div>
      </div>

      <button
        @click="loadData"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
      >
        <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoading }" />
        <span>Refrescar</span>
      </button>
    </div>

    <!-- Spinner de carga -->
    <div v-if="isLoading && !solicitud" class="py-20 text-center text-slate-400">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3"></div>
      <p class="text-sm font-medium">Cargando detalles de la solicitud...</p>
    </div>

    <!-- Contenido principal -->
    <div v-else-if="solicitud" class="space-y-6">
      <!-- Tarjeta Principal de Información -->
      <div class="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <!-- Título y metadatos -->
        <div>
          <h3 class="text-xl font-bold text-slate-900 leading-snug">
            {{ solicitud.titulo }}
          </h3>
          <div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span class="flex items-center gap-1.5">
              <Tag class="w-3.5 h-3.5 text-slate-400" />
              Categoría: <strong class="text-slate-700 font-semibold">{{ solicitud.categoria }}</strong>
            </span>
            <span class="flex items-center gap-1.5">
              Prioridad: <PriorityBadge :priority="solicitud.prioridad" />
            </span>
            <span class="flex items-center gap-1.5">
              <Calendar class="w-3.5 h-3.5 text-slate-400" />
              Creado: <strong class="text-slate-700">{{ formatDate(solicitud.fechaCreacion) }}</strong>
            </span>
            <span v-if="solicitud.fechaProcesamiento" class="flex items-center gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500" />
              Procesado: <strong class="text-slate-700">{{ formatDate(solicitud.fechaProcesamiento) }}</strong>
            </span>
          </div>
        </div>

        <!-- Descripción -->
        <div class="border-t border-slate-100 pt-5">
          <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Detalle del Requerimiento
          </h4>
          <p class="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {{ solicitud.descripcion }}
          </p>
        </div>
      </div>

      <!-- PANEL DE RESPUESTA O ESTADO DEL PROCESAMIENTO -->
      <!-- CASO 1: RESPONDIDA -->
      <div
        v-if="(solicitud.estado || '').toUpperCase() === 'RESPONDIDA'"
        class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-6 sm:p-7 shadow-sm space-y-4"
      >
        <div class="flex items-center gap-2.5 text-emerald-800">
          <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Sparkles class="w-4 h-4" />
          </div>
          <div>
            <h4 class="font-bold text-base text-emerald-950">Respuesta Generada por el Sistema</h4>
            <p class="text-xs text-emerald-700">Regla automática aplicada según categoría: {{ solicitud.categoria }}</p>
          </div>
        </div>

        <div class="bg-white p-5 rounded-xl border border-emerald-200/80 text-slate-800 text-sm leading-relaxed shadow-xs">
          {{ solicitud.respuesta || 'Respuesta generada satisfactoriamente por el Worker de TASKFLOW.' }}
        </div>
      </div>

      <!-- CASO 2: EN COLA -->
      <div
        v-else-if="(solicitud.estado || '').toUpperCase() === 'EN COLA'"
        class="bg-blue-50/80 border border-blue-200 rounded-xl p-6 text-blue-900 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Layers class="w-5 h-5" />
        </div>
        <div>
          <h4 class="font-bold text-base text-blue-950">Solicitud en cola de procesamiento (Redis)</h4>
          <p class="text-sm text-blue-800 mt-1">
            Esta solicitud se encuentra almacenada de forma persistente y está en la fila de Redis esperando que el Worker la procese.
          </p>
          <p class="text-xs text-blue-700 mt-2 font-medium">
            💡 Cuando el Worker tome la solicitud, este panel se actualizará automáticamente en tiempo real sin recargar.
          </p>
        </div>
      </div>

      <!-- CASO 3: PROCESANDO -->
      <div
        v-else-if="(solicitud.estado || '').toUpperCase() === 'PROCESANDO'"
        class="bg-purple-50/80 border border-purple-200 rounded-xl p-6 text-purple-900 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Cpu class="w-5 h-5 animate-spin" />
        </div>
        <div>
          <h4 class="font-bold text-base text-purple-950">El Worker está procesando esta solicitud</h4>
          <p class="text-sm text-purple-800 mt-1">
            El servicio independiente Node.js Worker está aplicando las reglas de respuesta y actualizando la información en MongoDB.
          </p>
        </div>
      </div>

      <!-- CASO 4: ERROR -->
      <div
        v-else-if="(solicitud.estado || '').toUpperCase() === 'ERROR'"
        class="bg-rose-50 border border-rose-200 rounded-xl p-6 text-rose-900 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <AlertOctagon class="w-5 h-5" />
        </div>
        <div>
          <h4 class="font-bold text-base text-rose-950">Error en el procesamiento</h4>
          <p class="text-sm text-rose-800 mt-1">
            {{ solicitud.mensajeError || 'Ocurrió un error inesperado al procesar la solicitud en el Worker.' }}
          </p>
        </div>
      </div>

      <!-- CASO 5: PENDIENTE -->
      <div
        v-else
        class="bg-amber-50 border border-amber-200 rounded-xl p-6 text-amber-900 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <Clock class="w-5 h-5" />
        </div>
        <div>
          <h4 class="font-bold text-base text-amber-950">Estado Pendiente</h4>
          <p class="text-sm text-amber-800 mt-1">
            La solicitud fue registrada en la base de datos pero aún no ingresa a la cola de Redis.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
