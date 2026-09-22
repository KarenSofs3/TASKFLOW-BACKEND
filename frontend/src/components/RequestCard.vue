<script setup>
import { useRouter } from 'vue-router'
import StatusBadge from './StatusBadge.vue'
import PriorityBadge from './PriorityBadge.vue'
import { formatDate } from '@/utils/formatDate'
import { ArrowRight, Clock, Tag } from 'lucide-vue-next'

const props = defineProps({
  request: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const viewDetail = () => {
  const id = props.request.id || props.request._id
  router.push(`/solicitudes/${id}`)
}
</script>

<template>
  <div
    class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between group"
  >
    <div>
      <div class="flex items-center justify-between gap-2 mb-3">
        <span class="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          #{{ request.id || request._id?.slice(-6) }}
        </span>
        <StatusBadge :status="request.estado" />
      </div>

      <h3 class="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-indigo-600 transition-colors">
        {{ request.titulo }}
      </h3>

      <p class="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
        {{ request.descripcion }}
      </p>
    </div>

    <div class="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
      <div class="flex items-center justify-between text-xs text-slate-500">
        <span class="flex items-center gap-1">
          <Tag class="w-3.5 h-3.5 text-slate-400" />
          {{ request.categoria }}
        </span>
        <PriorityBadge :priority="request.prioridad" />
      </div>

      <div class="flex items-center justify-between text-xs text-slate-400">
        <span class="flex items-center gap-1">
          <Clock class="w-3.5 h-3.5" />
          {{ formatDate(request.fechaCreacion) }}
        </span>

        <button
          @click="viewDetail"
          class="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          <span>Ver detalle</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
