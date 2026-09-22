// src/controllers/solicitud.controller.js
import {
    crearSolicitud,
    obtenerSolicitudes,
    obtenerSolicitudPorId,
    obtenerEstadisticas,
} from '../services/solicitud.service.js';
import { publicarEvento } from '../socket/eventBus.js';
import { NotFoundError } from '../utils/errors.js';

// ============================================
// POST /api/solicitudes
// ============================================
export const postSolicitud = async (req, res, next) => {
    try {
        const solicitud = await crearSolicitud(req.body);

        // Publicar eventos vía Redis Pub/Sub
        await publicarEvento('solicitud-creada', solicitud);
        await publicarEvento('solicitud-encolada', solicitud);
        await publicarEvento('cola-actualizada', {});

        res.status(201).json({ ok: true, data: solicitud });
    } catch (error) {
        console.log(error) 
        next(error);
    }
};

// ============================================
// GET /api/solicitudes
// ============================================
export const getSolicitudes = async (req, res, next) => {
    try {
        const resultado = await obtenerSolicitudes();
        res.json({ ok: true, source: resultado.source, data: resultado.data });
    } catch (error) {
        next(error);
    }
};

// ============================================
// GET /api/solicitudes/:id
// ============================================
export const getSolicitudById = async (req, res, next) => {
    try {
        const solicitud = await obtenerSolicitudPorId(req.params.id);
        if (!solicitud) {
            throw new NotFoundError('Solicitud no encontrada');
        }
        res.json({ ok: true, source: 'mongo', data: solicitud });
    } catch (error) {
        next(error);
    }
};

// ============================================
// GET /api/solicitudes/stats
// ============================================
export const getStats = async (req, res, next) => {
    try {
        const resultado = await obtenerEstadisticas();
        res.json({ ok: true, source: resultado.source, data: resultado.data });
    } catch (error) {
        next(error);
    }
};