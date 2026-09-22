<script setup>
import { computed } from 'vue'
import { STATUS_CONFIG, REQUEST_STATUS } from '@/utils/statusConfig'

const props = defineProps({
  status: {
    type: String,
    required: true,
    default: REQUEST_STATUS.PENDIENTE
  },
  showDot: {
    type: Boolean,
    default: true
  }
})

const config = computed(() => {
  const normalized = (props.status || '').toUpperCase()
  return STATUS_CONFIG[normalized] || {
    label: props.status || 'Desconocido',
    badgeClass: 'bg-slate-100 text-slate-700 ring-1 ring-slate-400/20',
    dotClass: 'bg-slate-400'
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors',
      config.badgeClass
    ]"
    :title="config.description"
  >
    <span
      v-if="showDot"
      :class="['w-1.5 h-1.5 rounded-full', config.dotClass]"
    />
    {{ config.label }}
  </span>
</template>
