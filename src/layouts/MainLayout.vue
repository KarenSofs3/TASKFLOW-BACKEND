<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRequestStore } from '@/store/requestStore'
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  Activity,
  Menu,
  X,
  Radio,
  ExternalLink,
  Layers
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const store = useRequestStore()

const mobileMenuOpen = ref(false)

const navigation = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Nueva Solicitud', path: '/solicitudes/nueva', icon: PlusCircle },
  { name: 'Mis Solicitudes', path: '/solicitudes', icon: ListTodo },
  { name: 'Monitor del Sistema', path: '/monitor', icon: Activity }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/' || route.path === '/dashboard'
  return route.path.startsWith(path)
}

const navigateTo = (path) => {
  mobileMenuOpen.value = false
  router.push(path)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
    <!-- SIDEBAR DESKTOP -->
    <aside class="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-slate-900 text-slate-100 z-30 shadow-xl">
      <!-- Logo Brand -->
      <div class="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div class="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/30">
          <Layers class="w-5 h-5" />
        </div>
        <div>
          <span class="text-lg font-bold tracking-tight text-white">TASKFLOW</span>
          <span class="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">SENA ADSO • Full Stack</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <button
          v-for="item in navigation"
          :key="item.name"
          @click="navigateTo(item.path)"
          :class="[
            'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left',
            isActive(item.path)
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/50'
              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 shrink-0" />
          <span>{{ item.name }}</span>
        </button>
      </nav>

      <!-- Connection Status Footer -->
      <div class="p-4 border-t border-slate-800 bg-slate-950/50">
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400 flex items-center gap-1.5">
            <Radio class="w-3.5 h-3.5" :class="store.socketConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'" />
            Socket.IO
          </span>
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-[11px] font-semibold',
              store.socketConnected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
            ]"
          >
            {{ store.socketConnected ? 'En vivo' : 'Desconectado' }}
          </span>
        </div>
      </div>
    </aside>

    <!-- MOBILE DRAWER -->
    <div
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-50 md:hidden bg-slate-900/80 backdrop-blur-sm"
      @click="mobileMenuOpen = false"
    >
      <div
        class="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-slate-900 text-white p-5 flex flex-col shadow-2xl"
        @click.stop
      >
        <div class="flex items-center justify-between pb-4 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">
              <Layers class="w-4 h-4" />
            </div>
            <span class="font-bold text-lg">TASKFLOW</span>
          </div>
          <button @click="mobileMenuOpen = false" class="text-slate-400 hover:text-white">
            <X class="w-6 h-6" />
          </button>
        </div>

        <nav class="mt-6 space-y-2 flex-1">
          <button
            v-for="item in navigation"
            :key="item.name"
            @click="navigateTo(item.path)"
            :class="[
              'w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all text-left',
              isActive(item.path)
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-800'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span>{{ item.name }}</span>
          </button>
        </nav>

        <div class="pt-4 border-t border-slate-800 text-xs text-slate-400">
          Taller Docker Compose — Vue 3 + Express
        </div>
      </div>
    </div>

    <!-- MAIN WRAPPER -->
    <div class="flex-1 flex flex-col md:pl-64 min-w-0">
      <!-- TOP NAVBAR -->
      <header class="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="mobileMenuOpen = true"
            class="md:hidden text-slate-600 hover:text-slate-900 p-2 -ml-2 rounded-lg hover:bg-slate-100"
          >
            <Menu class="w-6 h-6" />
          </button>
          <div>
            <h1 class="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Sistema TASKFLOW
            </h1>
            <p class="text-xs text-slate-500 hidden sm:block">
              Cola Redis & Procesamiento Asíncrono
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="router.push('/solicitudes/nueva')"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all shadow-indigo-600/30 active:scale-95"
          >
            <PlusCircle class="w-4 h-4" />
            <span>Nueva Solicitud</span>
          </button>
        </div>
      </header>

      <!-- BANNER: datos de demostración (backend no disponible) -->
      <div
        v-if="store.isUsingFallbackData"
        class="w-full bg-amber-500 text-amber-950 text-xs sm:text-sm font-semibold text-center py-2 px-4 flex items-center justify-center gap-2"
      >
        <span>⚠️ Sin conexión con el backend — estás viendo datos de demostración (no reales)</span>
      </div>

      <!-- PAGE CONTENT -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <slot />
      </main>

      <!-- FOOTER -->
      <footer class="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        TASKFLOW &copy; 2026 — Tecnólogo en Análisis y Desarrollo de Software (ADSO) • SENA
      </footer>
    </div>
  </div>
</template>