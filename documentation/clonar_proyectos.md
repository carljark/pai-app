# Clonar proyectos

Cualquier usuario aprobado puede copiar un proyecto terminado (`borrador` o `publicado`), suyo o de otro docente, desde el botón **Copiar** del historial de proyectos o del área personal. La copia es un proyecto nuevo e independiente: se edita sin tocar el original.

## API

`POST /api/projects/:id/clone` con cuerpo `{ "language": "castellano" | "catalan" }`. Requiere `requireApproved`.

| Respuesta | Caso |
|---|---|
| `201` | Copia creada; devuelve el proyecto con `userId` y colaboradores poblados (`PROJECT_POPULATE`). |
| `400` | Id con formato no válido. |
| `403` | Usuario pendiente de aprobación. |
| `404` | El proyecto no existe. |
| `409` | El proyecto no está terminado (`en_cola`, `generando` o `error`). |
| `500` | Error de base de datos. |

## Qué se copia

`backend/src/services/project-clone.service.ts`:

- **Igual que el original:** módulos, RA, criterios seleccionados, metodología, nivel (`tipoNivel`), curso, idioma, `contentVersion`, instrucciones extra, proveedor/modelo de IA y tiempo de generación, y `generatedContent` (texto y estructura).
- **Traducciones:** solo las que tienen texto, marcadas como `completada`. Se conserva su `sourceVersion`; como también se copia `contentVersion`, una traducción al día sigue al día en la copia. Una traducción en curso o con error no se copia.
- **Archivos adjuntos:** `uploads/<idOriginal>` se copia a `uploads/<idCopia>`. Si el original no tiene carpeta, no se crea ninguna. Si la copia de archivos falla, el proyecto copiado se conserva y el error se registra en consola.
- **Cambia:** `userId` pasa a ser quien copia, `status` es `borrador`, no hay colaboradores ni turno de edición (`editLock`), y `clonedFrom` guarda el id del original.
- **Título:** «Copia de …» o «Còpia de …» según el `language` de la petición, que el frontend toma del idioma de la interfaz. Si el título del original es genérico («Proyecto Integrador», «Proyecto de ESO», «Proyecto Generado») o falta, se usan los módulos unidos con « + », igual que el historial. Sin título ni módulos: «Copia de proyecto» / «Còpia de projecte».

Cada copia registra `CLONE_PROJECT` en `ActivityLog` con el título y el id del original (`details.clonedFrom`).

## Decisiones

- **Endpoint de backend en lugar de clonar en el frontend:** no existe un endpoint para crear proyectos sin generarlos con IA, y el frontend no puede copiar los archivos adjuntos.
- **No se copian colaboradores:** clonar crea un proyecto propio; compartirlo con otros es una decisión de quien hace la copia.
- **Sin migración:** `clonedFrom` es opcional en el modelo.

## Frontend

- `ProjectsService.cloneProject` → `ProjectsFacade.cloneProject` → `AppFacade.cloneProject`: llama a la API con el idioma de la interfaz, recarga el historial y muestra el toast «Proyecto copiado». Si falla, abre el modal de error con el mensaje del servidor.
- El botón aparece en `history-project-card` y en `personal-view`, solo en proyectos terminados.
