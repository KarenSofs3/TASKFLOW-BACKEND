// src/controllers/monitor.controller.js
import { obtenerEstadoMonitor } from '../services/monitor.service.js';

export const getEstadoMonitor = async (req, res, next) => {
    try {
        const estado = await obtenerEstadoMonitor();
        res.json({ ok: true, data: estado });
    } catch (error) {
        next(error);
    }
};