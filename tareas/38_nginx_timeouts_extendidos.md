# Tarea 38: Ampliación de timeouts de Nginx y optimización de Server-Sent Events (SSE)

## Propósito
El usuario sugirió aumentar los límites de tiempo (timeouts) de Nginx en la máquina EC2.
Las metas logradas son:
1. Incrementar el límite de tiempo de proxy de 5 minutos (300 segundos) a 1 hora (3600 segundos) para tolerar sin cortes las peticiones más largas de la IA.
2. Evitar que Nginx cierre de forma prematura las conexiones de tipo Server-Sent Events (SSE) que el frontend utiliza para reportar en tiempo real el progreso de la generación del proyecto.
3. Desactivar el almacenamiento en búfer de Nginx para la API, garantizando que el streaming de eventos llegue al frontend de forma inmediata.

## Arquitectura/Flujo
1. **Configuración de Tiempos Excedidos**:
   - En la ubicación `/api/` de los archivos de configuración, se han establecido `proxy_read_timeout`, `proxy_connect_timeout` y `proxy_send_timeout` en `3600s`.
2. **Directivas Específicas de SSE**:
   - Se desactivó el almacenamiento en caché y buffering de respuestas del backend mediante `proxy_buffering off;` y `proxy_cache off;`. Esto impide que Nginx retenga los micro-mensajes de eventos del stream SSE intentando juntarlos en un chunk más grande.
   - Se forzó el uso del protocolo HTTP/1.1 de keep-alive en la conexión proxy: `proxy_http_version 1.1;` y `proxy_set_header Connection "";`.

## Archivos Modificados
- `nginx_default.conf`
- `nginx-host-ejemplo.conf`
