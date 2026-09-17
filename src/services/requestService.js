import apiClient from '@/plugins/axios'

/**
 * Servicio encargado de la comunicación HTTP REST con el backend Express
 */
export const requestService = {
  /**
   * Obtiene la lista de solicitudes con filtros opcionales
   */
  async getRequests(params = {}) {
    const response = await apiClient.get('/solicitudes', { params })
    return response.data
  },

  /**
   * Obtiene el detalle de una solicitud específica por su ID
   */
  async getRequestById(id) {
    const response = await apiClient.get(`/solicitudes/${id}`)
    return response.data
  },

  /**
   * Crea una nueva solicitud en el backend
   * @param {Object} data { titulo, descripcion, categoria, prioridad }
   */
  async createRequest(data) {
    const response = await apiClient.post('/solicitudes', data)
    return response.data
  },

  /**
   * Obtiene estadísticas e indicadores para el Dashboard
   * El backend expone /api/solicitudes/stats (con fallback a /api/estadisticas)
   */
  async getDashboardStats() {
    try {
      const response = await apiClient.get('/solicitudes/stats')
      return response.data
    } catch (err) {
      try {
        const fallback = await apiClient.get('/estadisticas')
        return fallback.data
      } catch {
        throw err
      }
    }
  },

  /**
   * Obtiene el estado de los servicios (MongoDB, Redis, Worker, Backend) para el Monitor
   */
  async getSystemStatus() {
    const response = await apiClient.get('/monitor')
    return response.data
  }
}

export default requestService
