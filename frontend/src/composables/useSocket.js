import { onMounted, onUnmounted } from 'vue'
import socket from '@/plugins/socket'
import { useRequestStore } from '@/store/requestStore'

export function useSocket() {
  const store = useRequestStore()

  const setupSocketListeners = () => {
    socket.on('connect', () => {
      store.socketConnected = true
    })

    socket.on('disconnect', () => {
      store.socketConnected = false
    })

    // Escucha de eventos definidos en la arquitectura (Sección 21.3)
    socket.on('solicitud-creada', (data) => {
      console.log('⚡ [Socket] Evento solicitud-creada:', data)
      store.handleSocketRequestCreated(data)
      store.fetchDashboardStats()
    })

    socket.on('solicitud-encolada', (data) => {
      console.log('⚡ [Socket] Evento solicitud-encolada:', data)
      store.handleSocketRequestStatusChange({ ...data, id: data.id || data._id, estado: data.estado || 'EN COLA' })
      store.fetchDashboardStats()
    })

    socket.on('solicitud-procesando', (data) => {
      console.log('⚡ [Socket] Evento solicitud-procesando:', data)
      store.handleSocketRequestStatusChange({ ...data, id: data.id || data._id, estado: data.estado || 'PROCESANDO' })
      store.fetchDashboardStats()
    })

    socket.on('solicitud-respondida', (data) => {
      console.log('⚡ [Socket] Evento solicitud-respondida:', data)
      store.handleSocketRequestStatusChange({
        ...data,
        id: data.id || data._id,
        estado: 'RESPONDIDA',
        respuesta: data.respuesta,
        fechaProcesamiento: data.fechaProcesamiento || new Date().toISOString()
      })
      store.fetchDashboardStats()
    })

    socket.on('solicitud-error', (data) => {
      console.log('⚡ [Socket] Evento solicitud-error:', data)
      store.handleSocketRequestStatusChange({
        ...data,
        id: data.id || data._id,
        estado: 'ERROR',
        mensajeError: data.mensajeError || 'Error al procesar la solicitud'
      })
      store.fetchDashboardStats()
    })

    // Evento de actualización de cola emitido por backend y worker
    socket.on('cola-actualizada', (data) => {
      console.log('⚡ [Socket] Evento cola-actualizada:', data)
      store.fetchDashboardStats()
      store.fetchSystemStatus()
    })

    socket.on('monitor-actualizado', (data) => {
      console.log('⚡ [Socket] Evento monitor-actualizado:', data)
      store.handleSocketMonitorUpdate(data)
    })
  }

  return {
    socket,
    setupSocketListeners
  }
}

export default useSocket
