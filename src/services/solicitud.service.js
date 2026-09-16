import { Solicitud } from '../models/Solicitud.js';
import { encolarSolicitud } from './cola.service.js';
import { getCache, setCache, invalidarCache } from './cache.service.js';

const CACHE_KEY_LISTADO = 'taskflow:cache:solicitudes';
const CACHE_KEY_STATS = 'taskflow:cache:stats';

export const crearSolicitud = async (data) => {
    const solicitud = await Solicitud.create({
        ...data,
        estado: 'PENDIENTE',
    });

    // Enviar a la cola
    await encolarSolicitud(solicitud._id);
    solicitud.estado = 'EN COLA';
    await solicitud.save();

    // Invalidar caché
    await invalidarCache(CACHE_KEY_LISTADO);
    await invalidarCache(CACHE_KEY_STATS);

    return solicitud;
};

export const obtenerSolicitudes = async () => {
    const cache = await getCache(CACHE_KEY_LISTADO);
    if (cache) {
        console.log('🟢 CACHE HIT - listado');
        return { source: 'cache', data: cache };
    }

    console.log('🔴 CACHE MISS - consultando MongoDB');
    const solicitudes = await Solicitud.find().sort({ fechaCreacion: -1 });
    await setCache(CACHE_KEY_LISTADO, solicitudes);
    return { source: 'mongo', data: solicitudes };
};

export const obtenerSolicitudPorId = async (id) => {
    return await Solicitud.findById(id);
};

export const obtenerEstadisticas = async () => {
    const cache = await getCache(CACHE_KEY_STATS);
    if (cache) {
        console.log('🟢 CACHE HIT - stats');
        return { source: 'cache', data: cache };
    }

    console.log('🔴 CACHE MISS - stats');
    const stats = {
        total: await Solicitud.countDocuments(),
        pendientes: await Solicitud.countDocuments({ estado: 'PENDIENTE' }),
        enCola: await Solicitud.countDocuments({ estado: 'EN COLA' }),
        procesando: await Solicitud.countDocuments({ estado: 'PROCESANDO' }),
        respondidas: await Solicitud.countDocuments({ estado: 'RESPONDIDA' }),
        errores: await Solicitud.countDocuments({ estado: 'ERROR' }),
    };
    await setCache(CACHE_KEY_STATS, stats);
    return { source: 'mongo', data: stats };
};