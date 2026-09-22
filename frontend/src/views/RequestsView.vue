<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRequestStore } from '@/store/requestStore'
import StatusBadge from '@/components/StatusBadge.vue'
import PriorityBadge from '@/components/PriorityBadge.vue'
import CacheBadge from '@/components/CacheBadge.vue'
import RequestCard from '@/components/RequestCard.vue'
import { formatDate } from '@/utils/formatDate'
import { CATEGORIES } from '@/utils/statusConfig'
import {
  Search,
  ArrowRight,
  PlusCircle,
  Inbox,
  RefreshCw,
  LayoutGrid,
  List
} from 'lucide-vue-next'

const router = useRouter()
const store = useRequestStore()

const searchQuery = ref('')
const selectedStatus = ref('')
const selectedCategory = ref('')
const viewMode = ref('table') // 'table' | 'cards'

onMounted(async () => {
  await store.fetchRequests()
})

const reload = async () => {
  await store.fetchRequests()
}

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EN COLA', label: 'En cola' },
  { value: 'PROCESANDO', label: 'Procesando' },
  { value: 'RESPONDIDA', label: 'Respondida' },
  { value: 'ERROR', label: 'Error' }
]

const filteredRequests = computed(() => {
  return store.requests.filter(item => {
    const q = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !q ||
      (item.titulo && item.titulo.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q)) ||
      (item._id && item._id.toLowerCase().includes(q)) ||
      (item.descripcion && item.descripcion.toLowerCase().includes(q))

    const matchesStatus = !selectedStatus.value || (item.estado || '').toUpperCase() === selectedStatus.value
    const matchesCategory = !selectedCategory.value || item.categoria === selectedCategory.value

    return matchesSearch && matchesStatus && matchesCategory
  })
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header y Acciones -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div class="flex flex-wrap items-center gap-2.5">
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Mis Solicitudes</h2>
          <!-- Indicador real de Caché pedagógico del Taller (HU-08) -->
          <CacheBadge :source="store.lastRequestsSource || 'mongo'" />
        </div>
        <p class="text-sm text-slate-500 mt-0.5">
          Historial completo de solicitudes registradas y estado de procesamiento asíncrono.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <!-- Switch de vista: Tabla / Tarjetas -->
        <div class="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            @click="viewMode = 'table'"
            :class="[
              'p-1.5 rounded-md text-xs font-medium transition-colors',
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            ]"
            title="Vista de Tabla"
          >
            <List class="w-4 h-4" />
          </button>
          <button
            @click="viewMode = 'cards'"
            :class="[
              'p-1.5 rounded-md text-xs font-medium transition-colors',
              viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            ]"
            title="Vista de Tarjetas"
          >
            <LayoutGrid class="w-4 h-4" />
          </button>
        </div>

        <button
          @click="reload"
          :disabled="store.loading"
          class="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          title="Consultar nuevamente (Demostración de CACHE HIT)"
        >
          <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': store.loading }" />
          <span>Actualizar</span>
        </button>

        <button
          @click="router.push('/solicitudes/nueva')"
          class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm transition-all"
        >
          <PlusCircle class="w-4 h-4" />
          <span>Nueva Solicitud</span>
        </button>
      </div>
    </div>

    <!-- Barra de Filtros y Búsqueda -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <!-- Buscador de texto -->
        <div class="sm:col-span-6 relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar por ID, asunto o contenido..."
            class="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
        </div>

        <!-- Filtro por Estado -->
        <div class="sm:col-span-3">
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- Filtro por Categoría -->
        <div class="sm:col-span-3">
          <select
            v-model="selectedCategory"
            class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          >
            <option value="">Todas las categorías</option>
            <option v-for="cat in CATEGORIES" :key="cat.id" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Conteo de resultados -->
      <div class="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span>Mostrando <strong>{{ filteredRequests.length }}</strong> de <strong>{{ store.requests.length }}</strong> solicitudes</span>
        <button
          v-if="searchQuery || selectedStatus || selectedCategory"
          @click="searchQuery = ''; selectedStatus = ''; selectedCategory = ''"
          class="text-indigo-600 hover:underline font-medium"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- VISTA EN TARJETAS (O móvil) -->
    <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RequestCard
        v-for="req in filteredRequests"
        :key="req.id || req._id"
        :request="req"
      />
    </div>

    <!-- VISTA EN TABLA (Default desktop) -->
    <div v-else class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
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
              v-for="req in filteredRequests"
              :key="req.id || req._id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="px-5 py-4 font-mono text-xs font-bold text-slate-800">
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
                  <span>Ver detalle</span>
                  <ArrowRight class="w-3 h-3" />
                </button>
              </td>
            </tr>

            <!-- Estado Vacío -->
            <tr v-if="filteredRequests.length === 0">
              <td colspan="7" class="px-6 py-16 text-center text-slate-400">
                <Inbox class="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p class="font-medium text-slate-700 text-base">No se encontraron solicitudes</p>
                <p class="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {{ searchQuery || selectedStatus || selectedCategory
                    ? 'No hay solicitudes que coincidan con los filtros seleccionados.'
                    : 'Aún no has registrado ninguna solicitud en el sistema.' }}
                </p>
                <button
                  v-if="!searchQuery && !selectedStatus && !selectedCategory"
                  @click="router.push('/solicitudes/nueva')"
                  class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700"
                >
                  Registrar mi primera solicitud
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
