<script setup>
import { onMounted } from 'vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useSocket } from '@/composables/useSocket'
import { useRequestStore } from '@/store/requestStore'

const { setupSocketListeners } = useSocket()
const store = useRequestStore()

onMounted(() => {
  // Inicializar listeners de Socket.IO para comunicación en tiempo real
  setupSocketListeners()

  // Carga inicial de datos
  store.fetchRequests()
  store.fetchDashboardStats()
})
</script>

<template>
  <MainLayout>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </MainLayout>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
