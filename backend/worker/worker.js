// worker/worker.js
import { connectMongo } from '../src/config/db.js';
import { redis } from '../src/config/redis.js';
import { Solicitud } from '../src/models/Solicitud.js';
import { obtenerSolicitudDeCola } from '../src/services/cola.service.js';
import { generarRespuesta } from '../src/services/respuesta.service.js';
import { invalidarCache } from '../src/services/cache.service.js';
import { publicarEvento } from '../src/socket/eventBus.js';

const CACHE_KEY_LISTADO = 'taskflow:cache:solicitudes';
const CACHE_KEY_STATS = 'taskflow:cache:stats';

// ====== HEARTBEAT ======
const HEARTBEAT_KEY = 'taskflow:worker:heartbeat';
const HEARTBEAT_INTERVAL = 5000; // 5 segundos
const HEARTBEAT_TTL = 10;        // 10 segundos

const enviarHeartbeat = async () => {
    try {
        await redis.set(HEARTBEAT_KEY, Date.now().toString(), 'EX', HEARTBEAT_TTL);
        console.log('💓 Heartbeat enviado:', new Date().toISOString());
    } catch (error) {
        console.error('❌ Error enviando heartbeat:', error.message);
    }
};

const iniciarHeartbeat = () => {
    enviarHeartbeat();
    setInterval(enviarHeartbeat, HEARTBEAT_INTERVAL);
};
// ========================

const procesarSolicitud = async (solicitudId) => {
    const solicitud = await Solicitud.findById(solicitudId);
    if (!solicitud) return;

    try {
        solicitud.estado = 'PROCESANDO';
        await solicitud.save();
        await publicarEvento('solicitud-procesando', solicitud);

        await new Promise((r) => setTimeout(r, 2000));

        // 🔥 SIMULACIÓN DE ERROR CONTROLADO (para pruebas de HU-11)
        const textoCompleto = `${solicitud.titulo} ${solicitud.descripcion}`.toLowerCase();
        if (textoCompleto.includes('error')) {
            throw new Error('Fallo simulado en el procesamiento (palabra clave detectada)');
        }

        const respuesta = generarRespuesta(solicitud.categoria);

        solicitud.respuesta = respuesta;
        solicitud.estado = 'RESPONDIDA';
        solicitud.fechaProcesamiento = new Date();
        await solicitud.save();

        await invalidarCache(CACHE_KEY_LISTADO);
        await invalidarCache(CACHE_KEY_STATS);

        await publicarEvento('solicitud-respondida', solicitud);
        await publicarEvento('cola-actualizada', {});

        console.log(`✅ Solicitud ${solicitudId} procesada`);
    } catch (error) {
        // 🔥 Manejo controlado: la solicitud pasa a ERROR, el worker NO se cae
        console.error(`❌ Error procesando ${solicitudId}:`, error.message);

        solicitud.estado = 'ERROR';
        solicitud.mensajeError = error.message;
        await solicitud.save();

        await invalidarCache(CACHE_KEY_LISTADO);
        await invalidarCache(CACHE_KEY_STATS);

        await publicarEvento('solicitud-error', solicitud);
        await publicarEvento('cola-actualizada', {});
    }
};

const iniciarWorker = async () => {
    await connectMongo();
    console.log('👷 Worker TASKFLOW iniciado');

    iniciarHeartbeat(); // 🔥 CRÍTICO: arranca el heartbeat

    while (true) {
        try {
            const resultado = await obtenerSolicitudDeCola();
            if (resultado) {
                const [, solicitudId] = resultado;
                await procesarSolicitud(solicitudId);
            }
        } catch (error) {
            console.error('❌ Error en worker:', error.message);
        }
    }
};

iniciarWorker();