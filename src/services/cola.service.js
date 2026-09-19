// src/services/cola.service.js
import { redis, crearConexionRedis } from '../config/redis.js';

const COLA_KEY = 'taskflow:cola:solicitudes';

// Conexión dedicada SOLO para brpop (que bloquea)
const redisBloqueante = crearConexionRedis();

export const encolarSolicitud = async (solicitudId) => {
    try {
        await redis.lpush(COLA_KEY, solicitudId.toString());
        return true;
    } catch (error) {
        console.error('❌ No se pudo encolar:', error.message);
        return false;
    }
};

export const obtenerSolicitudDeCola = async () => {
    // Usa la conexión dedicada; no bloquea al resto de la app
    return await redisBloqueante.brpop(COLA_KEY, 0);
};

export const tamanioCola = async () => {
    return await redis.llen(COLA_KEY);
};