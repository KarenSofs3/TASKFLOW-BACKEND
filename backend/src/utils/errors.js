// src/utils/errors.js

export class AppError extends Error {
    constructor(message, status = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.status = status;
        this.code = code;
        this.isOperational = true; // error esperado, no crash
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message = 'Datos inválidos') {
        super(message, 400, 'VALIDATION_ERROR');
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404, 'NOT_FOUND');
    }
}

export class ProcessingError extends AppError {
    constructor(message = 'Error durante el procesamiento') {
        super(message, 500, 'PROCESSING_ERROR');
    }
}