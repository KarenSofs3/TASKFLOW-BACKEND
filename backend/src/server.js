import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectMongo } from './config/db.js';
import { initSocket } from './socket/socket.js';

const start = async () => {
    await connectMongo();

    const server = http.createServer(app);
    initSocket(server);

    server.listen(env.PORT, () => {
        console.log(`🚀 Backend TASKFLOW en puerto ${env.PORT}`);
    });
};

start();