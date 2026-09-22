<script setup>
import { computed } from 'vue'
import { Zap, Database, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({
  source: {
    type: String,
    default: 'mongo' // 'cache' | 'mongo' | 'database' | 'mock'
  }
})

const isHit = computed(() => props.source === 'cache')
</script>

<template>
  <span
    v-if="isHit"
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs animate-pulse"
    title="Consulta atendida directamente desde Redis Caché sin consultar MongoDB"
  >
    <Zap class="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />
    <span>REDIS CACHE HIT</span>
  </span>

  <span
    v-else
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200"
    title="Consulta atendida desde MongoDB (almacenada temporalmente en Redis)"
  >
    <Database class="w-3.5 h-3.5 text-sky-600" />
    <span>CACHE MISS (MongoDB)</span>
  </span>
</template>
