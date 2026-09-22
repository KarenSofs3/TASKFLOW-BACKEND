import { defineStore } from 'pinia'
import requestService from '@/services/requestService'
import { REQUEST_STATUS } from '@/utils/statusConfig'

export const useRequestStore = defineStore('request', {
  state: () => ({
    requests: [],
    currentRequest: null,
    stats: {
      total: 0,
      pendientes: 0,
      enCola: 0,
      procesando: 0,
      respondidas: 0,
      errores: 0
    },
    services: {
      backend: { name: 'Backend API (Express)', status: 'disponible', latency: '4ms' },
      mongodb: { name: 'Base de Datos (MongoDB)', status: 'disponible', latency: '12ms' },
      redis: { name: 'Caché & Cola (Redis)', status: 'disponible', latency: '2ms' },
      worker: { name: 'Procesador Asíncrono (Worker)', status: 'disponible', activeTasks: 0 },
      frontend: { name: 'Cliente Web (Vue 3)', status: 'disponible' }
    },
    loading: false,
    error: null,
    socketConnected: false,
    isUsingFallbackData: false,
    lastRequestsSource: null, // 'cache' | 'mongo'
    lastStatsSource: null     // 'cache' | 'mongo'
  }),

  getters: {
    recentRequests: (state) => {
      return [...state.requests].sort((a, b) => new Date(b.fechaCreacion || 0) - new Date(a.fechaCreacion || 0)).slice(0, 5)
    },
    getRequestByIdGetter: (state) => (id) => {
      return state.requests.find(r => (r.id === id || r._id === id))
    }
  },

  actions: {
    // Recalcular estadísticas locales
    computeLocalStats() {
      const stats = {
        total: this.requests.length,
        pendientes: 0,
        enCola: 0,
        procesando: 0,
        respondidas: 0,
        errores: 0
      }

      this.requests.forEach(r => {
        const estado = (r.estado || '').toUpperCase()
        if (estado === REQUEST_STATUS.PENDIENTE) stats.pendientes++
        else if (estado === REQUEST_STATUS.EN_COLA) stats.enCola++
        else if (estado === REQUEST_STATUS.PROCESANDO) stats.procesando++
        else if (estado === REQUEST_STATUS.RESPONDIDA) stats.respondidas++
        else if (estado === REQUEST_STATUS.ERROR) stats.errores++
      })

      this.stats = stats
    },

    // Cargar todas las solicitudes
    async fetchRequests(filters = {}) {
      this.loading = true
      this.error = null
      try {
        const res = await requestService.getRequests(filters)
        // El backend retorna { ok: true, source: 'cache'|'mongo', data: [...] } o array directo
        this.requests = Array.isArray(res) ? res : (res.data || res.solicitudes || [])
        this.lastRequestsSource = res.source || 'mongo'
        this.computeLocalStats()
        this.isUsingFallbackData = false
      } catch (err) {
        console.warn('No se pudo conectar al backend aún. Activando modo demostración temporal para pruebas de interfaz.')
        this.isUsingFallbackData = true
        this.lastRequestsSource = 'mock'
        if (this.requests.length === 0) {
          this.initMockData()
        }
      } finally {
        this.loading = false
      }
    },

    // Cargar detalle de una solicitud
    async fetchRequestById(id) {
      this.loading = true
      this.error = null
      try {
        const res = await requestService.getRequestById(id)
        this.currentRequest = res.data || res.solicitud || res
        return this.currentRequest
      } catch (err) {
        // Buscar en el estado local si el backend no responde
        const local = this.requests.find(r => r.id === id || r._id === id)
        if (local) {
          this.currentRequest = local
          return local
        }
        this.error = 'No se encontró la solicitud solicitada'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Crear solicitud
    async createRequest(formData) {
      this.loading = true
      this.error = null
      try {
        const res = await requestService.createRequest(formData)
        const nuevaSolicitud = res.data || res.solicitud || res
        this.requests.unshift(nuevaSolicitud)
        this.computeLocalStats()
        return nuevaSolicitud
      } catch (err) {
        // Si el backend no está disponible, simular registro para validar el frontend
        if (this.isUsingFallbackData) {
          const nuevaSimulada = {
            id: `REQ-${Date.now().toString().slice(-4)}`,
            titulo: formData.titulo,
            descripcion: formData.descripcion,
            categoria: formData.categoria,
            prioridad: formData.prioridad,
            estado: REQUEST_STATUS.PENDIENTE,
            fechaCreacion: new Date().toISOString(),
            respuesta: null
          }
          this.requests.unshift(nuevaSimulada)
          this.computeLocalStats()
          return nuevaSimulada
        }
        this.error = err.response?.data?.mensaje || 'Error al registrar solicitud'
        throw err
      } finally {
        this.loading = false
      }
    },

    // Cargar métricas del Dashboard
    async fetchDashboardStats() {
      try {
        const res = await requestService.getDashboardStats()
        const statsData = res.data || res
        if (statsData && typeof statsData === 'object') {
          this.stats = { ...this.stats, ...statsData }
        }
        if (res.source) {
          this.lastStatsSource = res.source
        }
      } catch (err) {
        this.computeLocalStats()
      }
    },

    // Cargar estado del sistema (Monitor)
    async fetchSystemStatus() {
      try {
        const res = await requestService.getSystemStatus()
        const data = res.data || res
        if (data?.servicios) {
          const s = data.servicios
          this.services = {
            backend: {
              name: 'Backend API (Express)',
              status: (s.backend?.status === 'ok' || s.backend?.status === 'disponible') ? 'disponible' : 'down',
              latency: s.backend?.latency || '4ms'
            },
            mongodb: {
              name: 'Base de Datos (MongoDB)',
              status: (s.mongodb?.status === 'ok' || s.mongodb?.status === 'disponible') ? 'disponible' : 'down',
              latency: s.mongodb?.latency || '12ms'
            },
            redis: {
              name: 'Caché & Cola (Redis)',
              status: (s.redis?.status === 'ok' || s.redis?.status === 'disponible') ? 'disponible' : 'down',
              latency: s.redis?.latency || '2ms'
            },
            worker: {
              name: 'Procesador Asíncrono (Worker)',
              status: (s.worker?.status === 'ok' || s.worker?.status === 'disponible') ? 'disponible' : 'down',
              activeTasks: s.worker?.activeTasks || 0
            },
            frontend: {
              name: 'Cliente Web (Vue 3)',
              status: 'disponible'
            }
          }
        }
        if (data?.contadores) {
          this.stats = { ...this.stats, ...data.contadores }
        }
      } catch (err) {
        // Mantener valores por defecto si no responde
      }
    },

    // ==========================================
    // MANEJADORES DE EVENTOS EN TIEMPO REAL (Socket.IO)
    // ==========================================
    handleSocketRequestCreated(solicitud) {
      if (!solicitud) return
      const targetId = solicitud._id || solicitud.id
      const index = this.requests.findIndex(r => (r._id && r._id === targetId) || (r.id && r.id === targetId))
      if (index === -1) {
        this.requests.unshift(solicitud)
      } else {
        this.requests[index] = { ...this.requests[index], ...solicitud }
      }
      this.computeLocalStats()
    },

    handleSocketRequestStatusChange({ id, estado, respuesta, mensajeError, fechaProcesamiento, ...rest }) {
      const targetId = id || rest._id
      if (!targetId) return

      const item = this.requests.find(r => (r._id && r._id === targetId) || (r.id && r.id === targetId))
      if (item) {
        if (estado) item.estado = estado
        if (respuesta) item.respuesta = respuesta
        if (mensajeError) item.mensajeError = mensajeError
        if (fechaProcesamiento) item.fechaProcesamiento = fechaProcesamiento
        Object.assign(item, rest)
      }

      if (this.currentRequest) {
        const currId = this.currentRequest._id || this.currentRequest.id
        if (currId === targetId) {
          if (estado) this.currentRequest.estado = estado
          if (respuesta) this.currentRequest.respuesta = respuesta
          if (mensajeError) this.currentRequest.mensajeError = mensajeError
          if (fechaProcesamiento) this.currentRequest.fechaProcesamiento = fechaProcesamiento
          Object.assign(this.currentRequest, rest)
        }
      }

      this.computeLocalStats()
    },

    handleSocketMonitorUpdate(data) {
      if (data?.stats || data?.contadores) {
        this.stats = { ...this.stats, ...(data.stats || data.contadores) }
      }
      if (data?.services || data?.servicios) {
        const s = data.services || data.servicios
        this.services = {
          ...this.services,
          backend: s.backend ? { ...this.services.backend, status: s.backend.status === 'ok' ? 'disponible' : s.backend.status } : this.services.backend,
          mongodb: s.mongodb ? { ...this.services.mongodb, status: s.mongodb.status === 'ok' ? 'disponible' : s.mongodb.status } : this.services.mongodb,
          redis: s.redis ? { ...this.services.redis, status: s.redis.status === 'ok' ? 'disponible' : s.redis.status } : this.services.redis,
          worker: s.worker ? { ...this.services.worker, status: s.worker.status === 'ok' ? 'disponible' : s.worker.status } : this.services.worker
        }
      }
    },

    // Datos de demostración iniciales para que la interfaz nunca se vea vacía mientras tu compañero sube el backend
    initMockData() {
      this.requests = [
        {
          id: 'REQ-1001',
          titulo: 'Solicitud de certificado de estudio',
          descripcion: 'Requiero constancia de matrícula para trámites de EPS.',
          categoria: 'Documento',
          prioridad: 'Alta',
          estado: REQUEST_STATUS.RESPONDIDA,
          fechaCreacion: new Date(Date.now() - 3600000 * 5).toISOString(),
          fechaProcesamiento: new Date(Date.now() - 3600000 * 4).toISOString(),
          respuesta: 'Su certificado ha sido emitido con radicado CERT-2026-981. Puede descargarlo desde el portal institucional.'
        },
        {
          id: 'REQ-1002',
          titulo: 'No puedo acceder al portal educativo',
          descripcion: 'El sistema indica contraseña inválida tras el cambio de periodo.',
          categoria: 'Soporte',
          prioridad: 'Media',
          estado: REQUEST_STATUS.PROCESANDO,
          fechaCreacion: new Date(Date.now() - 3600000 * 2).toISOString(),
          fechaProcesamiento: null,
          respuesta: null
        },
        {
          id: 'REQ-1003',
          titulo: 'Horario de atención biblioteca virtual',
          descripcion: 'Deseo conocer la disponibilidad del catálogo y asesorías.',
          categoria: 'Información',
          prioridad: 'Baja',
          estado: REQUEST_STATUS.EN_COLA,
          fechaCreacion: new Date(Date.now() - 1800000).toISOString(),
          fechaProcesamiento: null,
          respuesta: null
        },
        {
          id: 'REQ-1004',
          titulo: 'Actualización de número telefónico',
          descripcion: 'Cambié de operador y necesito registrar mi nuevo móvil.',
          categoria: 'Actualización',
          prioridad: 'Baja',
          estado: REQUEST_STATUS.PENDIENTE,
          fechaCreacion: new Date(Date.now() - 600000).toISOString(),
          fechaProcesamiento: null,
          respuesta: null
        }
      ]
      this.computeLocalStats()
    }
  }
})
