// src/routes/monitor.routes.js
import { Router } from 'express';
import { getEstadoMonitor } from '../controllers/monitor.controller.js';

const router = Router();

// El frontend consume /api/monitor
router.get('/', getEstadoMonitor);

// Alias retrocompatible
router.get('/estado', getEstadoMonitor);

export default router;