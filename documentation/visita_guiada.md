# Visita guiada, bienvenida y menú de Ayuda

Ayuda para docentes sin perfil técnico: una bienvenida con elección de idioma, cuatro visitas guiadas cortas, un panel de Ayuda en la barra lateral y un proyecto de ejemplo sobre el que se hace la visita del taller. Plan: `planes/246_plan_visita_guiada_y_ayuda.md`.

## Qué ve el docente

- **Bienvenida** (`features/help/components/welcome-modal`): sale a todo usuario aprobado que no la haya cerrado, también a los anteriores a este cambio.
  - Arriba, «Castellano / Català»: cambia `layout.language`, igual que el botón de idioma del menú, y toda la interfaz cambia al momento.
  - **Empezar la visita**: la da por vista y lanza «Conoce Plappin».
  - **Más tarde**: la cierra solo en esta sesión del navegador (`sessionStorage`, clave `plappin.welcomeLater`). Vuelve a salir en la siguiente sesión.
  - **No volver a mostrar**: guarda `welcomeDismissed: true` en el usuario. Ya no sale en ningún dispositivo.
  - Los usuarios pendientes de aprobación no la ven.
- **Botón «Ayuda» de la barra lateral**, que abre `help-panel`:
  - las cuatro visitas, con «✓ Hecha» en las completadas;
  - preguntas frecuentes;
  - «Escríbenos», que abre el Buzón de Sugerencias.
- **Botón «?»** (`help-button`) junto al título del generador y del taller, y en la fila de pestañas del mapa: lanza la visita de esa pantalla.

## Visitas

| Id | Pantalla | Pasos |
|---|---|---|
| `intro` | Inicio, con la barra lateral desplegada | Opciones del menú (nuevo proyecto, área personal, archivo, taller, mapa, solicitar centro, ayuda) |
| `generator` | Generador | Titulación y curso, metodología, compartir, indicaciones, selección curricular, selección actual y botón Generar. **No genera nada** |
| `taller` | Taller con el proyecto de ejemplo | Aviso del ejemplo, documento, descargar y guardar, recursos y asistente, cierre |
| `mapa` | Mapa | Ciclo y curso, forma de verlo, pasos 1-3 (en la ESO, solo los dos primeros) |

- **Definición** (`features/help/tours/tours.ts`): datos declarativos. Cada paso indica un ancla (`data-tour="…"` en la plantilla) o `null` para un mensaje centrado.
- **Textos** (`features/help/i18n/help.es.ts` y `help.ca.ts`):
  - van en el mismo orden que los pasos;
  - el tipo `HelpTexts` obliga a que los dos idiomas tengan las mismas claves;
  - el test `tours.integrity.spec.ts` comprueba que haya tantos textos como pasos y que cada ancla exista en las plantillas.

### Motor: `TourService` (driver.js 1.8.0, MIT)

1. Cierra la visita en curso y el panel de Ayuda.
2. Lleva a la pantalla de la visita (`layout.switchView`). En la visita del menú despliega la barra lateral; en la del taller abre el proyecto de ejemplo.
3. Espera al render (`afterNextRender`) y hasta 2 s a que aparezca algún ancla, porque el mapa carga sus datos por HTTP.
4. Omite los pasos cuyo elemento no está en pantalla (por ejemplo, un panel plegado o la ESO en el mapa) en lugar de romper la visita.
5. **Terminar en el último paso** guarda la visita en `completedTours` y registra `TOUR_COMPLETED`. **Cerrar antes** registra `TOUR_ABANDONED` con el número de paso. Al empezar se registra `TOUR_STARTED`. Los tres eventos van a `ActivityLog` por `POST /api/telemetry/event`.

Otros detalles:
- El motor se inyecta con el token `TOUR_DRIVER`, que los tests sustituyen por un doble.
- Los estilos de los globos están en `src/styles/_tour.scss` (clase `plappin-tour`, paleta de `_variables.scss`) sobre `driver.js/dist/driver.css`, incluido en `angular.json`.
- driver.js no depende de zone.js: trabaja sobre el DOM.

### Añadir o cambiar una visita

1. Pon `data-tour="nombre"` en el elemento de la plantilla. Si el elemento es el host de un componente, comprueba que tiene `:host { display: block }` o algo similar; si no, el resaltado no tendrá tamaño.
2. Añade el paso en `tours.ts` y su texto, en la misma posición, en `help.es.ts` y `help.ca.ts`.
3. Para una visita nueva, añade su id en `TourId`/`TOUR_IDS` del frontend y en `backend/src/data/tours.ts`. El backend rechaza ids desconocidos.
4. Añade la plantilla a la lista de `tours.integrity.spec.ts` si es nueva.

## Progreso en el backend

- `User.onboarding = { welcomeDismissed: Boolean (false), completedTours: [String] }`. No hace falta migración: Mongoose aplica los valores por defecto al leer los documentos antiguos.
- `GET /api/users/me/onboarding` devuelve el estado.
- `PATCH /api/users/me/onboarding` admite `{ welcomeDismissed?: boolean, completedTour?: TourId }` y usa `$addToSet` para no repetir visitas. Responde 400 si no hay ningún cambio válido.

## Proyecto de ejemplo

- **Contenido** (`backend/src/data/proyecto-ejemplo/`):
  - `proyecto-ejemplo.json`: metadatos (CFGS Educación Infantil 1.º, ApS, módulos 0012, 0014 y 0015, RA oficiales);
  - `proyecto-ejemplo.es.md`: el original;
  - `proyecto-ejemplo.ca.md`: la traducción al catalán balear, con la misma estructura de encabezados y tablas (lo comprueba un test).
- **Migración `50_proyecto_ejemplo`**:
  - hace un *upsert* del único documento con `isExample: true`, en estado `publicado`, sin autor y con la traducción catalana `completada`;
  - se puede reejecutar;
  - si cambias los textos, sube `EXAMPLE_CONTENT_VERSION` y añade una migración nueva que vuelva a llamar a `up()`.
- **Solo lectura**: `canEditProject` (backend y frontend) devuelve `false` en el ejemplo para quien no es administrador. Así responden 403 la edición, el cambio de nombre, la traducción y la reescritura con IA. El borrado ya exigía ser el autor.
- **Fuera de los listados**: el filtro `NOT_EXAMPLE` (`models/Project.ts`) se aplica al historial y al área personal, a los proyectos aprobados que se usan como referencia para la IA, al relleno de notificaciones y a la exportación de proyectos del administrador.
- **Exportar y copiar**:
  - cualquier docente puede exportar el ejemplo a Word;
  - la copia (`POST /:id/clone`) no hereda `isExample`, así que es un proyecto propio y editable.
- **API**: `GET /api/projects/example`.
- **Frontend**:
  - `ExampleProjectService` lo carga en `ProjectsFacade.exampleProject` (no está en el historial, así que `currentProject` lo busca ahí) y lo abre en el taller con `AppFacade.viewPastProject`;
  - el aviso del taller (`edit-lock-banner`) muestra el texto del ejemplo y el botón «Hacer una copia».
