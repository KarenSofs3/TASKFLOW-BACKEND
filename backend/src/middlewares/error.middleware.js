// src/middlewares/error.middleware.js
import { AppError } from '../utils/errors.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
    console.error('❌ Error capturado:', {
        message: err.message,
        code: err.code,
        status: err.status,
        path: req.originalUrl,
        method: req.method,
    });

    let status = 500;
    let code = 'INTERNAL_ERROR';
    let mensaje = 'Ocurrió un error inesperado. Intente nuevamente.';

    if (err instanceof AppError) {
        status = err.status;
        code = err.code;
        mensaje = err.message;
    } else if (err.name === 'ValidationError') {
        status = 400;
        code = 'VALIDATION_ERROR';
        mensaje = 'Los datos enviados no son válidos';
    } else if (err.name === 'CastError') {
        status = 400;
        code = 'INVALID_ID';
        mensaje = 'El identificador proporcionado no es válido';
    }

    res.status(status).json({
        ok: false,
        mensaje,
        message: mensaje,
        code,
        error: {
            code,
            message: mensaje,
        },
    });
};