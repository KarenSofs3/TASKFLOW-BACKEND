# TASKFLOW

Monorepo del taller Docker Compose — Vue 3 + Express + MongoDB + Redis + Worker.

```
/
├── docker-compose.yml   ← único compose, levanta los 5 servicios
├── backend/             ← API REST + Worker (ver backend/README.md)
└── frontend/            ← Vue 3 (ver frontend/README.md)
```

## Levantar todo el sistema

```bash
docker compose up --build -d
```

Esto construye e inicia:

| Servicio | Puerto host | Descripción |
|---|---|---|
| frontend | 5173 | Vue 3 servido por Nginx |
| backend | 3000 | API REST + Socket.IO |
| worker | — | Procesador asíncrono |
| mongoserver | 27018 → 27017 | MongoDB con volumen persistente |
| redisserver | 6379 | Caché + cola |

Para detener/reiniciar un servicio puntual (por ejemplo, para demostrar la HU-04):

```bash
docker compose stop worker
docker compose start worker
docker compose restart mongoserver
```

Para el detalle de cada parte, revisa `backend/README.md` y `frontend/README.md`.