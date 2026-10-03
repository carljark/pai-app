# Traducción de proyectos entre castellano y catalán

## Resumen

Cada proyecto guarda el idioma en que se generó (`language`) y puede tener una versión propia en el otro idioma (`translations.<idioma>`). Si el idioma de la interfaz no coincide con el del proyecto, el taller muestra un aviso con el botón **"Traducir al catalán" / "Traducir al castellano"**. La traducción se hace con la IA, se guarda y no se vuelve a pedir.

## Modelo de datos (`backend/src/models/Project.ts`)

| Campo | Significado |
| --- | --- |
| `language` | `castellano` \| `catalan`. Idioma de `generatedContent.rawText` (el original). |
| `contentVersion` | Se incrementa cada vez que cambia el texto original (edición en su idioma o importación DOCX). |
| `translations.<idioma>.rawText` | Versión del contenido en ese idioma. |
| `translations.<idioma>.sourceVersion` | `contentVersion` del original que se tradujo. |
| `translations.<idioma>.translatedAt` / `editedAt` | Fecha de la traducción y de la última edición manual. |
| `translations.<idioma>.status` | `traduciendo` \| `completada` \| `error`. `traduciendo` actúa como bloqueo. |
| `translations.<idioma>.startedAt` / `error` | Inicio de la traducción en curso y mensaje del último fallo. |

Una traducción está **desactualizada** cuando `sourceVersion !== contentVersion`. Entonces el taller avisa y ofrece "Volver a traducir".

La migración `12_add_project_language.ts` asigna `language` a los proyectos existentes mediante una heurística de palabras frecuentes (`detectContentLanguage`) e inicializa `contentVersion` a 0.

## Flujo

1. **Generación**: `POST /api/projects/generate` guarda `language` según el idioma pedido.
2. **Apertura** (`AppFacade.viewPastProject`): `resolveProjectContent(project, idiomaInterfaz)` decide el texto:
   - la traducción, si existe;
   - si no, el original, con `missingTranslation: true`.
3. **Traducción** (`POST /api/projects/:id/translate`, con `requireApproved` y `requireAiAccess`). Es **asíncrona**:
   - un único `updateOne` condicional marca `status: 'traduciendo'` y `startedAt`, solo si no hay otra traducción en curso a ese idioma o si la anterior lleva más de 30 min (`TRANSLATION_LOCK_MS`, bloqueo abandonado tras un reinicio). Si no obtiene el bloqueo responde **409**;
   - responde **202** con el proyecto en estado `traduciendo` y traduce en segundo plano (`runProjectTranslation`). Al terminar guarda la traducción con `status: 'completada'`; si falla, guarda `status: 'error'` y `error`, y conserva la traducción anterior si existía;
   - al arrancar el servidor, `failInterruptedTranslations` marca como `error` las traducciones que quedaron en `traduciendo` por un reinicio o despliegue, para que se puedan reintentar sin esperar a que caduque el bloqueo;
   - `translation.service.ts` trocea el Markdown por encabezados, y por párrafos si hace falta, en secciones de hasta 6000 caracteres;
   - las secciones se traducen **3 a la vez** (`TRANSLATION_CONCURRENCY`) y **sin razonamiento** (`reasoning: false`), y se unen en su orden original. Si una sección necesita otro proveedor o modelo de la cascada, las siguientes van directamente a él (respaldo "pegajoso"). Un proyecto de 34.700 caracteres pasó de unos 40 min a 155 s;
   - cada sección se traduce con `generateAiContentWithFallback`, usando el proveedor y el modelo elegidos en el taller;
   - el prompt incluye un **glosario oficial**: pares origen → destino de las descripciones de RAs/CEs y de los nombres de módulo del proyecto (campos `_es` / `_ca` de Mongo, fuentes BOE / CAIB);
   - el resultado se guarda en `translations[target]` con `sourceVersion = contentVersion`.
   - **Seguimiento en el frontend** (`ProjectTranslationFacade`, servicio global):
     - consulta `GET /api/projects/:id` cada 4 s mientras haya traducciones en curso;
     - si el proyecto abierto ya está en estado `traduciendo` (p. ej. tras recargar la página), retoma el seguimiento;
     - un 409 se trata como "ya había una en curso" y también se sigue;
     - al terminar muestra un toast ("Traducción completada: <título>" o "No se ha podido traducir: <título>") en cualquier pantalla y, si se está viendo ese proyecto en ese idioma, carga la traducción en el editor.
   - El aviso "Traduciendo…" es **por proyecto** (`resolveProjectContent` → `translating` / `translationFailed`), no global.
4. **Edición** (`PUT /api/projects/:id` con `language`):
   - si `language` es distinto del original, se guarda en `translations[language]` (versión propia) sin tocar el original;
   - si es el original, se actualiza `generatedContent` y sube `contentVersion` cuando el texto cambia.
5. **Exportación**:
   - DOCX: `GET /:id/export-docx?lang=` exporta la versión del idioma visible (`pickProjectText`);
   - PDF: se genera en el navegador a partir de lo que se está viendo, así que ya sale en ese idioma.
6. **Cambio de idioma con el taller abierto**: `TranslationBannerComponent` detecta el cambio y llama a `ProjectTranslationFacade.showCurrentProject()`, que carga la versión de ese idioma y vacía el deshacer, porque pertenece a la otra versión.

## Piezas del frontend

- `features/projects/models/project.model.ts`: `ContentLanguage`, `ProjectTranslation`, `projectLanguage`, `originalText`, `resolveProjectContent` y `projectTextIn`.
- `ProjectsFacade.contentLanguage`: idioma del texto que se está editando; se envía al guardar y al exportar.
- `features/projects/services/project-translation.facade.ts`: estado de la vista, traducción y cambio de versión.
- `features/taller/components/translation-banner/`: aviso con los estados "falta traducción", "viendo traducción", "desactualizada", "traduciendo" y "error". El botón solo aparece a usuarios con acceso a la IA.

## Decisiones

- **Bajo demanda y con botón**: traducir un proyecto largo tarda de decenas de segundos a minutos y consume tokens. Generar siempre en ambos idiomas duplicaría coste y tiempo, y chocaría con la cuota de Gemini.
- **IA con glosario frente a traductor externo**: AGENTS.md exige las denominaciones oficiales en cada idioma. Un traductor genérico no las respeta, y otro proveedor añadiría otra clave.
- **Versión editable por idioma**: la edición de la traducción no altera el original. Si después cambia el original, la traducción se marca como desactualizada, pero se conserva hasta que se vuelva a traducir.
- **Asíncrona con bloqueo en base de datos**: el estado sobrevive a navegación y recargas; el bloqueo atómico evita traducciones duplicadas (doble clic, varias pestañas o usuarios) y el coste doble de IA.
- **Sondeo en lugar de SSE**: el canal SSE existente está pensado para las notificaciones de generación; un sondeo de 4 s, activo solo mientras hay traducciones en curso, es más simple y suficiente.
- **Limitación conocida**: cambiar el idioma de la interfaz con cambios sin guardar en el taller sustituye el texto del editor por la versión del otro idioma.
