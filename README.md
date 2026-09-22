# TASKFLOW Backend

## Descripción
API REST + Worker para gestión de solicitudes asíncronas.

## Tecnologías
- Node.js + Express
- MongoDB + Mongoose
- Redis (caché + cola)
- Socket.IO (tiempo real)
- Docker + Docker Compose

## Arquitectura
[Diagrama simple]

## Instalación
### Con Docker (recomendado)
docker compose up -d

### Desarrollo local
npm install
npm run dev

## Endpoints
| Método | Endpoint | Descripción |
| GET | /api/solicitudes | Listar |
| GET | /api/solicitudes/:id | Detalle |
| POST | /api/solicitudes | Crear |
| GET | /api/solicitudes/stats | Estadísticas |
| GET | /api/monitor | Estado servicios |

## Eventos Socket.IO
- solicitud-creada
- solicitud-encolada
- solicitud-procesando
- solicitud-respondida
- solicitud-error

## Estados
PENDIENTE, EN COLA, PROCESANDO, RESPONDIDA, ERROR

## Categorías
Información, Soporte, Documento, Consulta, Actualización

## Pruebas
Ver [docs/PRUEBAS.md](docs/PRUEBAS.md)

## Autores
- [Tu nombre]
- [Nombre del compañero del frontend]