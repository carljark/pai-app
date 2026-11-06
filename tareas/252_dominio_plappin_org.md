# Tarea 252: `plappin.org` como dominio principal

## Propósito
El usuario quiere ir sustituyendo `plappin.duckdns.org` por `plappin.org`, y puede que algún día abandone el dominio de DuckDNS. Esta tarea hace que el repositorio y el despliegue usen ya `plappin.org`, y deja anotado qué falta antes de poder abandonar el dominio antiguo.

## Estado encontrado
- **DNS:** `plappin.org`, `www.plappin.org` y `plappin.duckdns.org` apuntan a `51.92.83.118`.
- **Nginx del host:** `/etc/nginx/sites-available/default` ya tiene `server_name plappin.duckdns.org plappin.org www.plappin.org`, en HTTP y en HTTPS.
- **Certificado:** se llama `plappin.duckdns.org`, cubre los tres dominios y caduca el 24-12-2026 (lo renueva certbot).
- **Aplicación:** no tiene el dominio en el código. El backend usa `cors()` sin lista de orígenes y el frontend llama a `/api` relativo.
- **Comprobación:** la API responde 200 con datos en los tres dominios.

## Cambios
1. Variable de GitHub `DOMAIN`: pasa a `plappin.org`. El workflow Deploy comprueba ese dominio tras desplegar.
2. `documentation/despliegue_produccion.md`:
   - nuevo apartado de dominio;
   - aviso sobre el certificado;
   - paso 5 del despliegue y tabla de variables actualizados.
3. `documentation/exportacion_importacion_proyectos.md`: el dominio de producción pasa a `plappin.org`.
4. `nginx_default.conf`: la copia de referencia se alinea con el `server_name` del servidor.

Los registros antiguos de `tareas/` y `planes/` conservan `plappin.duckdns.org`, porque describen lo que se hizo entonces.

## Pendiente antes de abandonar `plappin.duckdns.org`
Hay que reemitir el certificado sin ese dominio. Si deja de resolver al EC2, la validación HTTP-01 falla y certbot no renueva el certificado entero, así que también caería `plappin.org`:

```bash
sudo certbot --nginx --cert-name plappin.duckdns.org -d plappin.org -d www.plappin.org
```

Después se quita del `server_name` del Nginx del host y de `nginx_default.conf`. Son escrituras en producción: requieren autorización del usuario.

## Verificación
- `gh variable list`: `DOMAIN = plappin.org`.
- `certbot certificates` (solo lectura por SSH): dominios y caducidad indicados arriba.
- `curl` a `https://plappin.org`, `https://www.plappin.org` y `https://plappin.duckdns.org`: responden 200, y `/api/afinidades-eso?tab=ESO_2` devuelve datos en los tres.
- Tests: los que ejecuta el hook de `push`. No hay cambios de código.
