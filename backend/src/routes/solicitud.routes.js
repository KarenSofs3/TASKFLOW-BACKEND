import { Router } from 'express';
import {
    postSolicitud,
    getSolicitudes,
    getSolicitudById,
    getStats,
} from '../controllers/solicitud.controller.js';
import { validarSolicitud } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/', validarSolicitud, postSolicitud);
router.get('/', getSolicitudes);
router.get('/stats', getStats);
router.get('/:id', getSolicitudById);

export default router;