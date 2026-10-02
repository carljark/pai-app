# Tarea 172: Traducción de proyectos entre castellano y catalán

## Propósito
Un proyecto generado en castellano se mostraba siempre en castellano aunque la interfaz estuviera en catalán, y al revés. Se añade la traducción con IA bajo demanda, guardada por idioma, según las decisiones del usuario:
- traducción con botón, no automática;
- la versión traducida es editable como versión propia;
- las exportaciones salen en el idioma que se está viendo.

Diseño completo: `documentation/traduccion_proyectos.md`.

## Arquitectura y flujo
- **Backend**
  - `Project`: campos `language`, `contentVersion` y `translations.{castellano,catalan}` (`rawText`, `sourceVersion`, `translatedAt`, `editedAt`).
  - `services/translation.service.ts`:
    - validación del idioma y detección heurística;
    - troceo del Markdown por encabezados y párrafos (6000 caracteres por sección);
    - glosario oficial de RAs/CEs y módulos (`_es`/`_ca`);
    - prompt de traducción y `translateMarkdown`, con el motor y fallback de la generación.
  - `services/projectContent.service.ts`:
    - `pickProjectText`, para las exportaciones;
    - `buildContentUpdate`, que guarda la edición en la traducción o en el original e incrementa `contentVersion`.
  - `controllers/translation.controller.ts`: `POST /api/projects/:id/translate` (`requireApproved` + `requireAiAccess`).
  - `project.controller.ts`: la generación guarda `language` y `updateProject` usa `buildContentUpdate`.
  - `docx.controller.ts`: exportación con `?lang=` e importación que sube `contentVersion`.
  - Migración `12_add_project_language.ts`: idioma detectado y `contentVersion: 0` para los proyectos existentes. Es idempotente.
- **Frontend**
  - `project.model.ts`: tipos y helpers puros (`resolveProjectContent`, `projectTextIn`, `originalText`, `projectLanguage`).
  - `projects.mapper.ts` / `projects.service.ts`: mapeo de los campos nuevos, `translateProject` y `exportDocx(id, lang)`.
  - `ProjectsFacade.contentLanguage`: idioma del texto editado, que se envía al guardar y exportar.
  - `AppFacade.viewPastProject`: abre la versión del idioma de la interfaz.
  - `ProjectTranslationFacade` (servicio nuevo) y `TranslationBannerComponent` (componente standalone nuevo en el taller, fuera de `#pdf-content`).
  - Textos ES/CA en `translations.es.ts` / `translations.ca.ts`.

## Archivos modificados
- Backend:
  - `models/Project.ts`, `controllers/project.controller.ts`, `controllers/docx.controller.ts`, `routes/project.routes.ts`;
  - nuevos: `services/translation.service.ts`, `services/projectContent.service.ts`, `controllers/translation.controller.ts`, `migrations/12_add_project_language.ts`, `tests/translation.test.ts`.
- Frontend:
  - `project.model.ts`, `projects.mapper.ts`, `projects.service.ts`, `projects.facade.ts`, `app.facade.ts`, `taller-view.component.{ts,html}`, `translations.{es,ca}.ts`;
  - nuevos: `project-translation.facade.ts` y `translation-banner.component.{ts,html,scss}`, con sus specs;
  - specs ajustados: `app.facade.spec.ts`, `app.spec.ts`, `taller-view.component.spec.ts`, `projects.facade.spec.ts`, `projects.mapper.spec.ts`, `project.model.spec.ts`.
- Documentación: `documentation/traduccion_proyectos.md`.

## Decisiones técnicas
- La lógica nueva va en un servicio y un componente nuevos para no hacer crecer `ProjectsFacade` (575 líneas) ni `TallerViewComponent` (286), que ya superaban los límites de AGENTS.md.
- `contentVersion` (contador) en lugar de un hash: el frontend puede saber si la traducción está desactualizada sin calcular nada.
- En `features/projects/**` y `features/taller/**` se evitaron ramas sin test; los helpers puros concentran las decisiones y tienen tests propios.
- El aviso queda fuera de `#pdf-content` para que no aparezca en el PDF.

## Verificación
- Frontend: `ngc` y `tsc` de specs sin errores; ESLint 0; Prettier al día.
- Backend: los módulos nuevos cargan con `tsx` y no se añaden errores de tipos de clases nuevas.
- Pendiente (usuario): `cd backend && npm run test:cov`, `cd frontend && npm test`, arrancar el backend para aplicar la migración 12 y probar la traducción de un proyecto real en el taller.
