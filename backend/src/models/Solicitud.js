import mongoose from 'mongoose';

const SolicitudSchema = new mongoose.Schema(
    {
        titulo: { type: String, required: true, trim: true },
        descripcion: { type: String, required: true, trim: true },
        categoria: {
            type: String,
            required: true,
            enum: ['Información', 'Soporte', 'Documento', 'Consulta', 'Actualización'],
        },
        prioridad: {
            type: String,
            required: true,
            enum: ['Baja', 'Media', 'Alta'],
            default: 'Media',
        },
        estado: {
            type: String,
            enum: ['PENDIENTE', 'EN COLA', 'PROCESANDO', 'RESPONDIDA', 'ERROR'],
            default: 'PENDIENTE',
        },
        respuesta: { type: String, default: null },
        fechaCreacion: { type: Date, default: Date.now },
        fechaProcesamiento: { type: Date, default: null },
        mensajeError: { type: String, default: null },
    },
    { timestamps: true }
);

export const Solicitud = mongoose.model('Solicitud', SolicitudSchema);