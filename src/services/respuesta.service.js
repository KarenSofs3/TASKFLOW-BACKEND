const REGLAS = {
    'Información': 'El horario de atención es de lunes a viernes de 8:00 a.m. a 5:00 p.m.',
    'Soporte': 'Por favor verifique sus credenciales. Si el problema persiste, contacte a soporte@taskflow.com.',
    'Documento': 'Para solicitar un certificado, diríjase a la sección de documentos y complete el formulario.',
    'Consulta': 'Su trámite se encuentra en proceso. Recibirá una notificación cuando esté listo.',
    'Actualización': 'Para actualizar sus datos, ingrese al módulo de perfil y edite la información requerida.',
};

const RESPUESTA_GENERICA = 'Su solicitud ha sido recibida. Un asesor se comunicará con usted pronto.';

export const generarRespuesta = (categoria) => {
    return REGLAS[categoria] || RESPUESTA_GENERICA;
};