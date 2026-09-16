// src/services/monitor.service.js
import mongoose from 'mongoose';
import { redis } from '../config/redis.js';
import { Solicitud } from '../models/Solicitud.js';
import { tamanioCola } from './cola.service.js';

const HEARTBEAT_KEY = 'taskflow:worker:heartbeat';

export const obtenerEstadoMonitor = async () => {
    // Backend: si esta función se ejecuta, está vivo
    const backend = { status: 'ok' };

    // MongoDB
    const mongoOk = mongoose.connection.readyState === 1;
    const mongodb = {
        status: mongoOk ? 'ok' : 'down',
        readyState: mongoose.connection.readyState,
    };

    // Redis
    let redisOk = false;
    try {
        const pong = await redis.ping();
        redisOk = pong === 'PONG';
    } catch (error) {
        redisOk = false;
    }
    const redisStatus = { status: redisOk ? 'ok' : 'down' };

    // Worker (vía heartbeat)
    let workerOk = false;
    try {
        const hb = await redis.get(HEARTBEAT_KEY);
        workerOk = !!hb;
    } catch (error) {
        workerOk = false;
    }
    const worker = { status: workerOk ? 'ok' : 'down' };

    // Contadores
    const total = await Solicitud.countDocuments();
    const pendientes = await Solicitud.countDocuments({ estado: 'PENDIENTE' });
    const procesando = await Solicitud.countDocuments({ estado: 'PROCESANDO' });
    const respondidas = await Solicitud.countDocuments({ estado: 'RESPONDIDA' });
    const errores = await Solicitud.countDocuments({ estado: 'ERROR' });
    const enColaRedis = await tamanioCola();

    return {
        servicios: { backend, mongodb, redis: redisStatus, worker },
        contadores: {
            total,
            pendientes,
            enCola: enColaRedis,
            procesando,
            respondidas,
            errores,
        },
        timestamp: new Date().toISOString(),
    };
};