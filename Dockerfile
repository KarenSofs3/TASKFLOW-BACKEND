# ==========================================
# ETAPA 1: Construcción (Build) con Node.js
# ==========================================
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copiar manifiestos de dependencias
COPY package*.json ./

# Instalar dependencias limpias
RUN npm ci

# Copiar código fuente
COPY . .

# Argumentos de entorno para Vite durante el build
ARG VITE_API_URL=http://localhost:3000/api
ARG VITE_SOCKET_URL=http://localhost:3000

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL

# Construir artefactos de producción (dist)
RUN npm run build

# ==========================================
# ETAPA 2: Servidor Web Nginx ligero para producción
# ==========================================
FROM nginx:alpine AS production-stage

# Copiar configuración personalizada para SPA (Vue Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados desde la etapa de construcción
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Puerto de escucha del servidor Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
