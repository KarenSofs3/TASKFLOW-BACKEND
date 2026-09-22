import axios from 'axios'

// Configuración base de Axios conectada a la API de Express
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 segundos de timeout
})

// Interceptor de respuesta para manejo centralizado de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.mensaje || error.message || 'Error de conexión con el servidor'
    console.error('[API Error]:', message)
    return Promise.reject(error)
  }
)

export default apiClient
