// src/services/cache.service.js
import { redis } from '../config/redis.js';
import { env } from '../config/env.js';

export const getCache = async (key) => {
    try {
        const data = await redis.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.warn('⚠️ Redis caído, saltando caché:', error.message);
        return null; // ← simula CACHE MISS
    }
};

export const setCache = async (key, value) => {
    try {
        await redis.set(key, JSON.stringify(value), 'EX', env.CACHE_TTL);
    } catch (error) {
        console.warn('⚠️ No se pudo guardar en caché:', error.message);
    }
};

export const invalidarCache = async (key) => {
    try {
        await redis.del(key);
    } catch (error) {
        console.warn('⚠️ No se pudo invalidar caché:', error.message);
    }
};