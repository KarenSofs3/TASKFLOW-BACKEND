// src/config/redis.js
import Redis from 'ioredis';
import { env } from './env.js';

export const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    maxRetriesPerRequest: null,
});

redis.on('connect', () => console.log('✅ Redis conectado'));
redis.on('error', (err) => console.error('❌ Error Redis:', err.message));

// 🔥 Nueva función: crear conexiones dedicadas (para brpop, pub/sub, etc.)
export const crearConexionRedis = () => {
    const conn = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        maxRetriesPerRequest: null,
    });
    conn.on('error', (err) => console.error('❌ Error Redis (dedicada):', err.message));
    return conn;
};