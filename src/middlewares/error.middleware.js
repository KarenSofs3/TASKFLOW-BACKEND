// src/middlewares/error.middleware.js
import { AppError } from '../utils/errors.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
    // Loguear siempre en el servidor
    console.error('❌ Error capturado:', {
        message: err.message,
        code: err.code,
        status: err.status,
        path: req.originalUrl,
        method: req.method,
    });

    // Errores operacionales (esperados) → mensaje controlado
    if (err instanceof AppError) {
        return res.status(err.status).json({
            ok: false,
            error: {
                code: err.code,
                message: err.message,
            },
        });
    }

    // Errores de validación de Mongoose
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            ok: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Los datos enviados no son válidos',
                details: Object.keys(err.errors).map((k) => err.errors[k].message),
            },
        });
    }

    // Errores de ID inválido en MongoDB
    if (err.name === 'CastError') {
        return res.status(400).json({
            ok: false,
            error: {
                code: 'INVALID_ID',
                message: 'El identificador proporcionado no es válido',
            },
        });
    }

    // Error inesperado → no exponer detalles técnicos
    return res.status(500).json({
        ok: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: 'Ocurrió un error inesperado. Intente nuevamente.',
            ...(env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
};