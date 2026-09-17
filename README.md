# TASKFLOW — Frontend (Vue 3 + Tailwind CSS + Pinia + Socket.IO)

Sistema Full Stack para la gestión, encolamiento y procesamiento asíncrono de solicitudes.

**Programa de formación:** Tecnólogo en Análisis y Desarrollo de Software (ADSO) — SENA  
**Competencia:** Implementar la solución de software de acuerdo con los requisitos de operación y modelos de referencia  
**Actividad de Aprendizaje:** Configurar los servicios requeridos del software — Taller Docker Compose  

---

## 1. Descripción del Proyecto

**TASKFLOW** es una solución distribuida diseñada para desacoplar la atención directa de usuarios del procesamiento intensivo de sus solicitudes.

El frontend está desarrollado con **Vue 3** (Composition API) y ofrece una interfaz moderna, reactiva y responsive para:
- Registrar nuevas solicitudes categorizadas y priorizadas.
- Consultar el historial con soporte didáctico de **REDIS CACHE HIT / CACHE MISS**.
- Monitorear el estado de la cola en Redis y la salud de los 5 microservicios en tiempo real.
- Visualizar en directo la respuesta generada automáticamente por el Worker mediante **Socket.IO**.
- Simular pruebas de fallo controlado (HU-11) y desconexión/reconexión de Worker (HU-04, HU-09).

---

## 2. Tecnologías Utilizadas

- **Framework:** [Vue 3](https://vuejs.org/) (SFC + `<script setup>` Composition API)
- **Empaquetador y DevServer:** [Vite 6](https://vitejs.dev/)
- **Gestor de Estado Global:** [Pinia 2](https://pinia.vuejs.org/)
- **Enrutamiento:** [Vue Router 4](https://router.vuejs.org/) (Modo HTML5 History)
- **Estilos:** [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Comunicación HTTP:** [Axios](https://axios-http.com/)
- **Tiempo Real:** [Socket.IO Client](https://socket.io/)
- **Iconografía:** [Lucide Icons for Vue](https://lucide.dev/)
- **Contenedor:** Docker + Nginx Alpine (Multi-stage build)

---

## 3. Arquitectura del Frontend

Organización por capas conforme a la especificación del taller y buenas prácticas de ingeniería de software:

```text
src/
├── assets/            # Recursos visuales e imágenes estáticas
├── components/        # Componentes UI reutilizables
│   ├── CacheBadge.vue     # Indicador visual de REDIS CACHE HIT / MISS (HU-08)
│   ├── PriorityBadge.vue  # Etiqueta de prioridad (Baja, Media, Alta)
│   ├── RequestCard.vue    # Tarjeta de solicitud para vistas grid y móviles
│   ├── RequestForm.vue    # Formulario con validación y presets didácticos
│   ├── StatCard.vue       # Tarjeta de métrica numérica del Dashboard
│   └── StatusBadge.vue    # Etiqueta de estado con indicador LED pulsante
├── composables/       # Lógica reactiva reutilizable (Hooks)
│   └── useSocket.js       # Suscripción centralizada a eventos Socket.IO
├── layouts/           # Plantillas estructurales generales
│   └── MainLayout.vue     # Sidebar lateral, Topbar, drawer móvil y footer
├── plugins/           # Instancias y configuración de librerías externas
│   ├── axios.js           # Cliente HTTP con interceptores y timeout
│   └── socket.js          # Conexión Socket.IO con reconexión automática
├── router/            # Definición de rutas y metadatos de navegación
│   └── index.js           # /dashboard, /solicitudes, /solicitudes/nueva, /solicitudes/:id, /monitor
├── services/          # Conexión con la API REST de Express
│   └── requestService.js  # GET/POST /solicitudes, /stats, /monitor
├── store/             # Gestión del estado global
│   └── requestStore.js    # Pinia Store: solicitudes, filtros, métricas y normalización
├── styles/            # Estilos globales y utilidades CSS
│   └── main.css           # Directivas Tailwind y scrollbars personalizadas
├── utils/             # Funciones utilitarias y configuraciones
│   ├── formatDate.js      # Formateo amigable de fechas y horas
│   └── statusConfig.js    # Constantes de estados, colores, categorías y prioridades
├── views/             # Pantallas principales del sistema
│   ├── DashboardView.vue      # Resumen ejecutivo, tarjetas y solicitudes recientes
│   ├── RequestsView.vue       # Tabla/Tarjetas, buscador, filtros y CACHE HIT/MISS
│   ├── NewRequestView.vue     # Formulario de registro con presets de 1 clic
│   ├── RequestDetailView.vue  # Detalle de solicitud y panel de respuesta generada
│   └── MonitorView.vue        # Monitor de servicios (MongoDB, Redis, Express, Worker)
├── App.vue            # Componente raíz con transiciones de ruta
└── main.js            # Punto de entrada de la aplicación Vue
```

---

## 4. Pantallas Implementadas

1. **Dashboard General (`/dashboard`)**: Métricas en vivo (Total, Pendientes, En Cola, Procesando, Respondidas, Errores) y tabla de últimas solicitudes registradas.
2. **Mis Solicitudes (`/solicitudes`)**: Listado completo con buscador en tiempo real, filtro por categoría y estado, alternador de vista (Tabla o Tarjetas) y distintivo de **REDIS CACHE HIT / CACHE MISS**.
3. **Nueva Solicitud (`/solicitudes/nueva`)**: Formulario con validación visual en cliente, selectores estilizados y botones de autocompletado rápido para las 5 categorías evaluadas y simulación de error (HU-11).
4. **Detalle de Solicitud (`/solicitudes/:id`)**: Consulta de campos, trazabilidad cronológica y caja de respuesta automática generada por el Worker.
5. **Monitor de Servicios (`/monitor`)**: Monitoreo de los 5 contenedores Docker (Express, MongoDB, Redis, Worker, Vue), estado de la cola y botón para simular apagado/encendido del Worker.

---

## 5. Instalación y Ejecución Local

### Prerrequisitos
- Node.js versión 18+ o 20+
- npm versión 9+

### Pasos

1. Clonar el repositorio y acceder a la carpeta:
```bash
git clone https://github.com/KarenSofs3/TASKFLOW-BACKEND.git
cd TASKFLOW-BACKEND/frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (archivo `.env`):
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 6. Ejecución con Docker

### Opción A: Contenedor individual del Frontend
```bash
docker build -t taskflow-frontend .
docker run -d -p 5173:80 --name taskflow-frontend taskflow-frontend
```

### Opción B: Todos los 5 servicios con Docker Compose (Recomendado)
Desde la raíz del proyecto `TASKFLOW/`:
```bash
docker compose up --build -d
```

Servicios desplegados:
| Servicio | Contenedor | Puerto Anfitrión | Función |
|---|---|---|---|
| **frontend** | `taskflow-frontend` | `5173` | Cliente Web Vue 3 + Nginx |
| **backend** | `taskflow-backend` | `3000` | API REST Express + Socket.IO |
| **worker** | `taskflow-worker` | — | Procesador asíncrono Node.js |
| **mongoserver** | `taskflow-mongo` | `27017` | Base de datos persistente |
| **redisserver** | `taskflow-redis` | `6379` | Caché en memoria y cola LPUSH/BRPOP |

---

## 7. Guía para la Demostración del Reto Final de Integración (Sustentación SENA)

Durante la presentación ante la instructora, siga esta secuencia para demostrar el cumplimiento del 100% de las Historias de Usuario:

1. **Apertura:** Iniciar TASKFLOW y abrir el navegador en `http://localhost:5173`. Verificar que los indicadores del Dashboard y Monitor aparezcan en verde.
2. **Registro de Solicitud (HU-01):** Ir a *Nueva Solicitud*. Usar uno de los botones rápidos (ej: "Documento") y enviar. Mostrar que aparece confirmación inmediata.
3. **Persistencia y Encolamiento (HU-04, HU-07, HU-16):** Observar cómo el estado pasa en vivo de `PENDIENTE` a `EN COLA` sin refrescar la página.
4. **Procesamiento y Respuesta (HU-05, HU-06):** Ver la transición automática a `PROCESANDO` y finalmente a `RESPONDIDA`. Entrar al detalle y mostrar la respuesta generada según la regla de la categoría.
5. **Demostración de Caché Redis (HU-08):** Ir a *Mis Solicitudes*.
   - Primera consulta: Muestra distintivo `CACHE MISS (MongoDB)`.
   - Clic en *Actualizar*: Muestra distintivo `REDIS CACHE HIT` instantáneo.
6. **Prueba de Cola con Worker Detenido (HU-04):**
   - Ejecutar en terminal: `docker compose stop worker`
   - En *Monitor*, verificar que el Worker figure como `Detenido / down`.
   - Registrar 3 solicitudes nuevas. Comprobar que entran y permanecen en estado `EN COLA`.
   - Iniciar el Worker: `docker compose start worker`
   - Observar cómo el Worker consume automáticamente las solicitudes represadas en la cola y las responde en vivo.
7. **Prueba de Fallo Controlado (HU-11):** En *Nueva Solicitud*, dar clic en "Probar Fallo Controlado (HU-11)". Enviar la solicitud que contiene la palabra `error`. Mostrar que pasa a estado `ERROR` de forma controlada sin tumbar el Worker ni afectar a las demás solicitudes.
8. **Persistencia ante reinicio (HU-10):** Reiniciar los servicios (`docker compose restart mongoserver`). Recargar y verificar que ninguna solicitud se perdió gracias al volumen persistente `mongo-data`.
