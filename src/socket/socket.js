// src/socket/socket.js
import { Server } from 'socket.io';
import { env } from '../config/env.js';
import { suscribirEventos } from './eventBus.js';

export let io = null;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: { origin: env.CORS_ORIGIN, methods: ['GET', 'POST'] },
    });

    io.on('connection', (socket) => {
        console.log('🔌 Cliente conectado:', socket.id);
        socket.on('disconnect', () => console.log('❌ Cliente desconectado:', socket.id));
    });

    // 🔥 Reenviar eventos de Redis a todos los clientes Socket.IO
    suscribirEventos((evento, payload) => {
        console.log(`📤 Reenviando evento: ${evento}`);
        io.emit(evento, payload);
    });

    return io;
};