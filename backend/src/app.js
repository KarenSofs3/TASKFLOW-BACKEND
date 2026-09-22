import express from 'express';
import cors from 'cors';
import solicitudRoutes from './routes/solicitud.routes.js';
import monitorRoutes from './routes/monitor.routes.js';   // 🔥 nuevo
import { errorHandler } from './middlewares/error.middleware.js';
import { env } from './config/env.js';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ ok: true, service: 'taskflow-backend' }));

app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/monitor', monitorRoutes);                   // 🔥 nuevo

app.use(errorHandler);

export default app;