import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

// Instancia única de Socket.IO
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  transports: ['websocket', 'polling']
})

// Logs informativos de conexión
socket.on('connect', () => {
  console.log('🟢 [Socket.IO] Conectado al servidor con ID:', socket.id)
})

socket.on('disconnect', (reason) => {
  console.warn('🔴 [Socket.IO] Desconectado del servidor:', reason)
})

socket.on('connect_error', (error) => {
  console.error('⚠️ [Socket.IO] Error de conexión:', error.message)
})

export default socket
