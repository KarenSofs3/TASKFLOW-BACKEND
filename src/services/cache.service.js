import { redis } from '../config/redis.js';
import { env } from '../config/env.js';

export const getCache = async (key) => {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
};

export const setCache = async (key, value) => {
    await redis.set(key, JSON.stringify(value), 'EX', env.CACHE_TTL);
};

export const invalidarCache = async (key) => {
    await redis.del(key);
};