// src/socket/eventBus.js
import Redis from 'ioredis';
import { env } from '../config/env.js';

const CANAL = 'taskflow:eventos';

// Publicador (lo usa el backend y el worker)
export const publisher = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
});

// Suscriptor (solo lo usa el backend para reenviar a Socket.IO)
export const subscriber = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
});

export const publicarEvento = async (evento, payload) => {
    await publisher.publish(CANAL, JSON.stringify({ evento, payload }));
};

export const suscribirEventos = (callback) => {
    subscriber.subscribe(CANAL, (err) => {
        if (err) console.error('❌ Error suscribiendo a Redis:', err.message);
        else console.log(`📡 Suscrito al canal ${CANAL}`);
    });

    subscriber.on('message', (canal, mensaje) => {
        if (canal !== CANAL) return;
        try {
            const { evento, payload } = JSON.parse(mensaje);
            callback(evento, payload);
        } catch (error) {
            console.error('❌ Error parseando evento:', error.message);
        }
    });
};

export { CANAL };