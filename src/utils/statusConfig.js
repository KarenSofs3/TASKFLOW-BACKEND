/**
 * Configuraciones y constantes para el sistema TASKFLOW
 */

export const REQUEST_STATUS = {
  PENDIENTE: 'PENDIENTE',
  EN_COLA: 'EN COLA',
  PROCESANDO: 'PROCESANDO',
  RESPONDIDA: 'RESPONDIDA',
  ERROR: 'ERROR'
}

export const STATUS_CONFIG = {
  [REQUEST_STATUS.PENDIENTE]: {
    label: 'Pendiente',
    badgeClass: 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20',
    dotClass: 'bg-amber-500',
    description: 'Solicitud creada, en espera de envío a cola'
  },
  [REQUEST_STATUS.EN_COLA]: {
    label: 'En cola',
    badgeClass: 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20',
    dotClass: 'bg-blue-500',
    description: 'En cola Redis esperando ser atendida por el Worker'
  },
  [REQUEST_STATUS.PROCESANDO]: {
    label: 'Procesando',
    badgeClass: 'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20',
    dotClass: 'bg-purple-500 animate-pulse',
    description: 'El Worker está procesando la solicitud y generando la respuesta'
  },
  [REQUEST_STATUS.RESPONDIDA]: {
    label: 'Respondida',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20',
    dotClass: 'bg-emerald-500',
    description: 'Procesada con éxito y con respuesta generada'
  },
  [REQUEST_STATUS.ERROR]: {
    label: 'Error',
    badgeClass: 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20',
    dotClass: 'bg-rose-500',
    description: 'Ocurrió un error durante el procesamiento'
  }
}

export const CATEGORIES = [
  { id: 'Información', name: 'Información', description: 'Consultas sobre horarios, políticas o información general' },
  { id: 'Soporte', name: 'Soporte Técnico', description: 'Problemas de acceso, fallos del sistema o soporte técnico' },
  { id: 'Documento', name: 'Documento / Certificado', description: 'Solicitud de certificados, constancias o trámites' },
  { id: 'Consulta', name: 'Consulta de Trámite', description: 'Estado de un proceso o seguimiento de radicados' },
  { id: 'Actualización', name: 'Actualización de Datos', description: 'Modificación de correo, teléfono o dirección' }
]

export const PRIORITIES = [
  { id: 'Baja', name: 'Baja', badgeClass: 'bg-slate-100 text-slate-700' },
  { id: 'Media', name: 'Media', badgeClass: 'bg-sky-100 text-sky-800' },
  { id: 'Alta', name: 'Alta', badgeClass: 'bg-orange-100 text-orange-800' }
]
