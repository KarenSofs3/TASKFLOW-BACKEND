import dotenv from 'dotenv';
dotenv.config();

export const env = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    CACHE_TTL: parseInt(process.env.CACHE_TTL || '60', 10),
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};