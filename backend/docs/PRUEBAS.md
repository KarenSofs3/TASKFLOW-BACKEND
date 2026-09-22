# Pruebas — TASKFLOW Backend

Este documento resume las pruebas manuales del API. Las peticiones equivalentes en
formato `.http` (para el plugin REST Client de VS Code) están en [`pruebas.http`](./pruebas.http).

## 1. Health check

```
GET /health
```
Respuesta esperada: `{ "ok": true, "service": "taskflow-backend" }`

## 2. Monitor de servicios

```
GET /api/monitor
GET /api/monitor/estado   (alias)
```
Debe devolver el estado de `backend`, `mongodb`, `redis` y `worker`, además de los
contadores de solicitudes por estado.

## 3. Registrar solicitud (caso normal)

```
POST /api/solicitudes
Content-Type: application/json

{
  "titulo": "PruebaRegistro",
  "descripcion": "VerificarAlmacenamiento",
  "categoria": "Información",
  "prioridad": "Media"
}
```
Debe responder `201` y el estado inicial debe pasar a `EN COLA` tras encolar en Redis.

## 4. Listar solicitudes (CACHE MISS / CACHE HIT)

```
GET /api/solicitudes
```
- Primera llamada tras un cambio de datos → `source: "mongo"` (CACHE MISS).
- Llamadas siguientes dentro del TTL → `source: "cache"` (CACHE HIT).

## 5. Estadísticas del Dashboard

```
GET /api/solicitudes/stats
```

## 6. Consultar por ID

```
GET /api/solicitudes/:id
```

## 7. Validación fallida (400)

```
POST /api/solicitudes
Content-Type: application/json

{
  "titulo": "ab",
  "descripcion": "x",
  "categoria": "Fake",
  "prioridad": "Alta"
}
```
Debe responder `400` con `code: VALIDATION_ERROR`.

## 8. ID inválido (400) / ID inexistente (404)

```
GET /api/solicitudes/abc                              -> 400 INVALID_ID
GET /api/solicitudes/000000000000000000000000         -> 404 NOT_FOUND
```

## 9. Worker detenido y recuperación (HU-04)

1. `docker compose stop worker`
2. Registrar varias solicitudes → deben quedar en `EN COLA` indefinidamente.
3. `docker compose start worker`
4. Verificar que las solicitudes pendientes se procesan automáticamente en orden.

## 10. Error controlado (HU-11)

Registrar una solicitud cuyo título o descripción contenga la palabra `error`
(el Worker la detecta y simula un fallo). Debe pasar a estado `ERROR` con
`mensajeError` definido, sin detener el Worker ni afectar otras solicitudes.

## 11. Persistencia (HU-10)

1. Registrar una solicitud y confirmar que aparece en el listado.
2. `docker compose restart mongoserver` (o reiniciar todos los servicios).
3. Confirmar que la solicitud sigue existiendo gracias al volumen `mongo-data`.

---

## Evidencias

> Agregar aquí las capturas de pantalla de cada prueba ejecutada (carpeta
> `docs/evidencias/`, nombre corregido sin la doble "s"). La captura anterior
> (`01-registro.png`) no se subió correctamente — quedó en 0 bytes — y fue
> eliminada de este entregable.