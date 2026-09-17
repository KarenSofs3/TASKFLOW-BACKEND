<script setup>
import { computed } from 'vue'

const props = defineProps({
  priority: {
    type: String,
    default: 'Media'
  }
})

const badgeConfig = computed(() => {
  const p = (props.priority || '').toLowerCase()
  if (p === 'alta') {
    return {
      label: 'Alta',
      classes: 'bg-rose-50 text-rose-700 border-rose-200'
    }
  }
  if (p === 'media') {
    return {
      label: 'Media',
      classes: 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }
  return {
    label: 'Baja',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
      badgeConfig.classes
    ]"
  >
    {{ badgeConfig.label }}
  </span>
</template>
