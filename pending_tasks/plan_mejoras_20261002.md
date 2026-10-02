# Plan de mejoras — 2026-10-02

Origen: `pending_tasks/audios/mejoras_20261002.mp3` (2:13). Transcripción y plan de implementación.

## Resumen del audio

Conversación entre dos personas pidiendo tres mejoras para Plappin:

1. **Proyectos compartidos / colaboración**: que quede claro y visual que un proyecto es compartido y con quién, y poder invitar a otros usuarios/profesores al crear el proyecto para seguir trabajándolo entre varios.
2. **Visualización de la selección curricular**: que se vean los ítems seleccionados mientras se eligen y también al pulsar "Generar proyecto" (que reaparezca el aviso/resumen).
3. **Buscador del archivo/historial**: hoy es de una sola palabra clave; quieren varias palabras, filtrar por asignaturas/módulos, por temática (texto en todo el proyecto) y por RAs (en FP). Los criterios de evaluación se descartan por ahora (demasiado volumen).

## Mejora A — Proyectos compartidos

### Backend
- `backend/src/models/Project.ts`: añadir `collaborators: [{ userId, addedAt }]`. El `userId` actual sigue siendo el propietario.
- Endpoints:
  - `POST /api/projects/:id/collaborators` (añadir).
  - `DELETE /api/projects/:id/collaborators/:userId` (quitar). Propietario o admin.
  - `POST /api/projects/generate` acepta `collaboratorIds` opcional.
- Directorio de usuarios para invitar: endpoint ligero autenticado `GET /api/users/directory` (id, nombre, email), ya que el actual es solo para admin.
- Reglas de acceso: propietario + colaboradores (+ admin) pueden ver/editar/generar.
- Notificar a los colaboradores vía `backend/src/services/notification.service.ts`.

### Frontend
- `frontend/src/app/features/projects/models/project.model.ts` y `projects.mapper.ts`: añadir `collaborators` / `isShared`.
- Generador: selector multi-usuario para invitar antes de generar.
- Historial y cabecera del taller: insignia "Compartido" + listado/avatares de participantes.
- Métodos en `ProjectsFacade`.
- Traducciones ES/CA y tests.

## Mejora B — Visualización de la selección

- Generador (`frontend/src/app/features/curriculum/components/curriculum-selector`): asegurar que el carrito flotante de selección sea visible/desplegable durante la selección (revisar `isOpen` por defecto y estilos móvil).
- Al pulsar "Generar" (`frontend/src/app/app.facade.ts`): mostrar un resumen/aviso con los RAs/módulos seleccionados reutilizando `curriculum.selectedItemsDetails()` y `curriculum.groupedSelectedItems()`, antes de encolar o mientras se procesa.
- Traducciones y tests de plantilla.

## Mejora C — Buscador avanzado del historial

- `frontend/src/app/features/history/components/history-view`: sustituir la búsqueda de un solo término por:
  - **múltiples palabras clave** (AND, sin distinguir acentos ni mayúsculas),
  - **filtro por módulo/asignatura** (campo `project.modules`),
  - **filtro por RA** (campo `project.ras`, ya persistido),
  - **búsqueda temática** en todo el contenido (`generatedContent.rawText`).
- Decisión: filtrado en cliente (el historial ya se carga completo y el componente ya filtra en memoria) con chips de filtros y contador de resultados. Se contempla moverlo a servidor si crece el volumen.
- Traducciones y tests.

## Transversal

- Mantener la arquitectura hexagonal actual (modelo → servicio → facade → componente).
- Paridad estricta ES/CA.
- Mantenibilidad: componentes < 200 líneas, funciones < 25 líneas.
- Cobertura de tests ≥ 90 %.
- Documentar en `tareas/` y, cuando aplique, en `documentation/`.
