// src/middlewares/validate.middleware.js
import { ValidationError } from '../utils/errors.js';

const CATEGORIAS_VALIDAS = ['Información', 'Soporte', 'Documento', 'Consulta', 'Actualización'];
const PRIORIDADES_VALIDAS = ['Baja', 'Media', 'Alta'];

export const validarSolicitud = (req, res, next) => {
    const { titulo, descripcion, categoria, prioridad } = req.body;

    // Campos obligatorios
    if (!titulo || !descripcion || !categoria || !prioridad) {
        return next(new ValidationError('Todos los campos son obligatorios'));
    }

    // Tipos
    if (typeof titulo !== 'string' || typeof descripcion !== 'string') {
        return next(new ValidationError('Título y descripción deben ser texto'));
    }

    // Longitudes
    if (titulo.trim().length < 3) {
        return next(new ValidationError('El título debe tener al menos 3 caracteres'));
    }

    if (titulo.length > 120) {
        return next(new ValidationError('El título no puede superar 120 caracteres'));
    }

    if (descripcion.trim().length < 5) {
        return next(new ValidationError('La descripción debe tener al menos 5 caracteres'));
    }

    if (descripcion.length > 1000) {
        return next(new ValidationError('La descripción no puede superar 1000 caracteres'));
    }

    // Enums
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
        return next(
            new ValidationError(`Categoría inválida. Valores permitidos: ${CATEGORIAS_VALIDAS.join(', ')}`)
        );
    }

    if (!PRIORIDADES_VALIDAS.includes(prioridad)) {
        return next(
            new ValidationError(`Prioridad inválida. Valores permitidos: ${PRIORIDADES_VALIDAS.join(', ')}`)
        );
    }

    next();
};