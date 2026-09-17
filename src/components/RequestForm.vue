<script setup>
import { reactive, ref } from 'vue'
import { CATEGORIES, PRIORITIES } from '@/utils/statusConfig'
import { Send, XCircle, AlertCircle, HelpCircle, Sparkles, Bug } from 'lucide-vue-next'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  titulo: '',
  categoria: 'Información',
  prioridad: 'Media',
  descripcion: ''
})

const errors = reactive({
  titulo: '',
  descripcion: ''
})

const validateForm = () => {
  let isValid = true
  errors.titulo = ''
  errors.descripcion = ''

  if (!form.titulo.trim()) {
    errors.titulo = 'El título o asunto de la solicitud es obligatorio.'
    isValid = false
  } else if (form.titulo.trim().length < 5) {
    errors.titulo = 'El título debe tener al menos 5 caracteres.'
    isValid = false
  }

  if (!form.descripcion.trim()) {
    errors.descripcion = 'La descripción es obligatoria para procesar la solicitud.'
    isValid = false
  } else if (form.descripcion.trim().length < 10) {
    errors.descripcion = 'La descripción debe tener al menos 10 caracteres.'
    isValid = false
  }

  return isValid
}

const handleSubmit = () => {
  if (!validateForm()) return
  emit('submit', {
    titulo: form.titulo.trim(),
    categoria: form.categoria,
    prioridad: form.prioridad,
    descripcion: form.descripcion.trim()
  })
}

const resetForm = () => {
  form.titulo = ''
  form.descripcion = ''
  form.categoria = 'Información'
  form.prioridad = 'Media'
  errors.titulo = ''
  errors.descripcion = ''
}

defineExpose({ resetForm })

// Presets rápidos para facilitar la demostración al docente
const applyPreset = (categoryName) => {
  const samples = {
    'Información': {
      titulo: 'Consulta de horarios y requisitos de matrícula',
      descripcion: 'Deseo conocer las fechas límite y la documentación necesaria para la inscripción del siguiente trimestre.'
    },
    'Soporte': {
      titulo: 'Fallo al ingresar a la plataforma de formación',
      descripcion: 'El sistema rechaza las credenciales corporativas y muestra error de sesión expirada.'
    },
    'Documento': {
      titulo: 'Solicitud de certificado de calificaciones académicas',
      descripcion: 'Requiero con urgencia el certificado de notas del periodo actual con firma digital para trámite de beca.'
    },
    'Consulta': {
      titulo: 'Consulta del estado del radicado RAD-4921',
      descripcion: 'Solicito información sobre la etapa en la que se encuentra la convalidación de mis documentos.'
    },
    'Actualización': {
      titulo: 'Actualización de dirección de residencia y correo electrónico',
      descripcion: 'Cambié de domicilio a la ciudad de Medellín y requiero actualizar mi información de contacto principal.'
    }
  }

  const sample = samples[categoryName]
  if (sample) {
    form.categoria = categoryName
    form.titulo = sample.titulo
    form.descripcion = sample.descripcion
  }
}

// Preset de error para HU-11
const applyErrorPreset = () => {
  form.categoria = 'Soporte'
  form.prioridad = 'Alta'
  form.titulo = 'Simulación de error en procesamiento controlado'
  form.descripcion = 'Esta solicitud incluye la palabra clave error para provocar un fallo simulado en el Worker (HU-11) y comprobar el estado ERROR sin que el servicio se detenga.'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Presets rápidos para la presentación didáctica SENA -->
    <div class="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
      <div class="flex items-center justify-between gap-2 mb-2.5">
        <span class="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
          <Sparkles class="w-3.5 h-3.5 text-indigo-600" />
          Rellenar con un clic (Demostración de 5 Reglas del Worker):
        </span>
        <button
          type="button"
          @click="applyErrorPreset"
          class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 px-2 py-0.5 rounded transition-colors"
          title="Rellena con la palabra 'error' para probar HU-11"
        >
          <Bug class="w-3 h-3 text-rose-600" />
          <span>Probar Fallo Controlado (HU-11)</span>
        </button>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="cat in CATEGORIES"
          :key="cat.id"
          type="button"
          @click="applyPreset(cat.name)"
          class="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Categoría -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
          Categoría de la Solicitud <span class="text-rose-500">*</span>
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <label
            v-for="cat in CATEGORIES"
            :key="cat.id"
            :class="[
              'flex items-start p-3 rounded-xl border cursor-pointer transition-all text-left',
              form.categoria === cat.name
                ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            ]"
          >
            <input
              type="radio"
              name="categoria"
              :value="cat.name"
              v-model="form.categoria"
              class="mt-0.5 text-indigo-600 focus:ring-indigo-500 shrink-0"
            />
            <div class="ml-2.5">
              <span class="block text-xs font-bold text-slate-900">{{ cat.name }}</span>
              <span class="block text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                {{ cat.description }}
              </span>
            </div>
          </label>
        </div>
      </div>

      <!-- Prioridad -->
      <div>
        <label class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
          Nivel de Prioridad <span class="text-rose-500">*</span>
        </label>
        <div class="flex flex-wrap gap-3">
          <label
            v-for="p in PRIORITIES"
            :key="p.id"
            :class="[
              'px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-all flex items-center gap-2',
              form.prioridad === p.name
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            ]"
          >
            <input
              type="radio"
              name="prioridad"
              :value="p.name"
              v-model="form.prioridad"
              class="sr-only"
            />
            <span>{{ p.name }}</span>
          </label>
        </div>
      </div>

      <!-- Título -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label for="titulo" class="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Asunto o Título de la Solicitud <span class="text-rose-500">*</span>
          </label>
          <span class="text-[11px] text-slate-400 font-mono">{{ form.titulo.length }}/120</span>
        </div>
        <input
          id="titulo"
          v-model="form.titulo"
          type="text"
          maxlength="120"
          placeholder="Ej: Solicitud de constancia académica para EPS"
          :class="[
            'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-hidden',
            errors.titulo
              ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          ]"
        />
        <p v-if="errors.titulo" class="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
          <AlertCircle class="w-3.5 h-3.5" />
          {{ errors.titulo }}
        </p>
      </div>

      <!-- Descripción -->
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <label for="descripcion" class="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Descripción Detallada <span class="text-rose-500">*</span>
          </label>
          <span class="text-[11px] text-slate-400 font-mono">{{ form.descripcion.length }}/1000</span>
        </div>
        <textarea
          id="descripcion"
          v-model="form.descripcion"
          rows="4"
          maxlength="1000"
          placeholder="Describe claramente los requerimientos, número de identificación o contexto necesario para procesar la solicitud..."
          :class="[
            'w-full px-3.5 py-2.5 rounded-lg border text-sm transition-all focus:outline-hidden',
            errors.descripcion
              ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
          ]"
        ></textarea>
        <p v-if="errors.descripcion" class="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
          <AlertCircle class="w-3.5 h-3.5" />
          {{ errors.descripcion }}
        </p>
      </div>

      <!-- Botones de Acción -->
      <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <button
          type="button"
          @click="emit('cancel')"
          class="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Cancelar
        </button>

        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-600/30 transition-all disabled:opacity-50 active:scale-95"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <Send v-else class="w-4 h-4" />
          <span>{{ loading ? 'Enviando a cola...' : 'Enviar Solicitud' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
