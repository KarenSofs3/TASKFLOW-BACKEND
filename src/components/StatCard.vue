<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'indigo' // indigo, amber, blue, purple, emerald, rose
  }
})

const colorClasses = {
  indigo: {
    border: 'border-indigo-500',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600'
  },
  amber: {
    border: 'border-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-600'
  },
  blue: {
    border: 'border-blue-500',
    bg: 'bg-blue-50',
    text: 'text-blue-600'
  },
  purple: {
    border: 'border-purple-500',
    bg: 'bg-purple-50',
    text: 'text-purple-600'
  },
  emerald: {
    border: 'border-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600'
  },
  rose: {
    border: 'border-rose-500',
    bg: 'bg-rose-50',
    text: 'text-rose-600'
  }
}
</script>

<template>
  <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
    <div :class="['absolute top-0 left-0 bottom-0 w-1.5', colorClasses[color]?.border || 'border-slate-400']" />
    <div class="flex items-center justify-between">
      <div>
        <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider">{{ title }}</p>
        <p class="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{{ value }}</p>
        <p v-if="description" class="text-xs text-slate-400 mt-1">{{ description }}</p>
      </div>
      <div :class="['w-11 h-11 rounded-xl flex items-center justify-center', colorClasses[color]?.bg || 'bg-slate-100']">
        <slot name="icon">
          <span :class="['text-lg font-bold', colorClasses[color]?.text || 'text-slate-600']">#</span>
        </slot>
      </div>
    </div>
  </div>
</template>
