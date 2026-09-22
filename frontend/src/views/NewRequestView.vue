<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRequestStore } from '@/store/requestStore'
import RequestForm from '@/components/RequestForm.vue'
import { CheckCircle, ArrowLeft, Layers } from 'lucide-vue-next'

const router = useRouter()
const store = useRequestStore()

const isSubmitting = ref(false)
const successMessage = ref('')
const createdRequestId = ref(null)
const formRef = ref(null)

const handleFormSubmit = async (formData) => {
  isSubmitting.value = true
  successMessage.value = ''

  try {
    const res = await store.createRequest(formData)
    createdRequestId.value = res.id || res._id || 'nueva'
    successMessage.value = '¡Solicitud registrada correctamente! Ha sido almacenada en MongoDB y enviada a la cola Redis.'

    if (formRef.value) {
      formRef.value.resetForm()
    }
  } catch (err) {
    console.error('Error al registrar solicitud:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button
        @click="router.back()"
        class="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
        title="Regresar"
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Nueva Solicitud</h2>
        <p class="text-sm text-slate-500">
          Registra una petición para ser encolada en Redis y procesada asíncronamente por el Worker.
        </p>
      </div>
    </div>

    <!-- Alerta de Éxito -->
    <div
      v-if="successMessage"
      class="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-emerald-800"
    >
      <div class="flex items-start gap-3">
        <CheckCircle class="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <p class="font-semibold text-sm">{{ successMessage }}</p>
          <p class="text-xs text-emerald-700 mt-1">
            Puedes consultar su avance en tiempo real a través de Socket.IO.
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="router.push(`/solicitudes/${createdRequestId}`)"
          class="text-xs font-semibold px-3.5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-xs"
        >
          Ver Detalle de Solicitud
        </button>
      </div>
    </div>

    <!-- Tarjeta del Formulario -->
    <div class="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <RequestForm
        ref="formRef"
        :loading="isSubmitting"
        @submit="handleFormSubmit"
        @cancel="router.push('/solicitudes')"
      />
    </div>
  </div>
</template>
