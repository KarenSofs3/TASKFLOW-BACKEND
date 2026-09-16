// src/routes/monitor.routes.js
import { Router } from 'express';
import { getEstadoMonitor } from '../controllers/monitor.controller.js';

const router = Router();

router.get('/estado', getEstadoMonitor);

export default router;