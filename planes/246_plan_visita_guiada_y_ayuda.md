# Plan 246: Visita guiada y menú de Ayuda para docentes

> **Fecha:** 22 de octubre de 2026
> **Estado:** Implementado (tarea 246)
> **Partes afectadas:** backend / frontend / migraciones / despliegue

---

## 1. Objetivo

Que un docente sin perfil técnico aprenda a usar Plappin sin ayuda externa. La primera vez que entra (incluidos los usuarios que ya existen, tras el despliegue), una ventana de bienvenida le deja elegir el idioma (castellano o catalán) y le ofrece una visita guiada. Desde un nuevo botón **«Ayuda»** de la barra lateral puede repetir en cualquier momento visitas cortas por tarea, consultar preguntas frecuentes y escribirnos. La visita del taller se hace sobre un **proyecto de ejemplo** de solo lectura, en castellano y catalán, para que funcione aunque el docente aún no tenga proyectos.

## 2. Escenarios

- **Escenario: la bienvenida aparece a todos los usuarios que no la han cerrado**
  - **Dado** un usuario aprobado (nuevo o ya existente) sin `onboarding.welcomeDismissed`
  - **Cuando** entra en la aplicación
  - **Entonces** ve la ventana de bienvenida con los botones de idioma, «Empezar la visita», «Más tarde» y «No volver a mostrar»
- **Escenario: elegir el idioma en la bienvenida**
  - **Dado** la ventana de bienvenida abierta en castellano
  - **Cuando** el docente pulsa «Català»
  - **Entonces** la ventana y toda la interfaz pasan al catalán al instante (`layout.language`) y la elección se conserva igual que con el botón de idioma de la barra lateral
- **Escenario: «Más tarde» no la da por vista**
  - **Dado** la bienvenida abierta
  - **Cuando** el docente pulsa «Más tarde»
  - **Entonces** se cierra durante esta sesión del navegador, no se guarda nada en el servidor y vuelve a salir en la siguiente sesión
- **Escenario: «No volver a mostrar» la da por vista en cualquier dispositivo**
  - **Dado** la bienvenida abierta
  - **Cuando** el docente pulsa «No volver a mostrar»
  - **Entonces** se guarda `welcomeDismissed: true` en su usuario y no vuelve a aparecer, tampoco en otro ordenador
- **Escenario: «Empezar la visita» lanza la visita general**
  - **Cuando** el docente pulsa «Empezar la visita»
  - **Entonces** se guarda `welcomeDismissed: true` y empieza la visita «Conoce Plappin», que resalta una a una las opciones del menú con su explicación y el progreso «Paso N de M»
- **Escenario: el panel de Ayuda lista las visitas y marca las completadas**
  - **Dado** un docente que ha completado «Conoce Plappin»
  - **Cuando** pulsa «Ayuda» en la barra lateral
  - **Entonces** ve las cuatro visitas, con «Conoce Plappin» marcada como completada, las preguntas frecuentes y el enlace «Escríbenos», que abre Sugerencias
- **Escenario: una visita cambia a la pantalla que necesita**
  - **Dado** el docente en Inicio
  - **Cuando** lanza «Crea tu primer proyecto»
  - **Entonces** la aplicación pasa al generador y, cuando la pantalla ya está pintada, resalta el primer paso
- **Escenario: la visita del generador no genera nada**
  - **Dado** la visita «Crea tu primer proyecto» en curso
  - **Cuando** llega al último paso
  - **Entonces** se resalta el botón Generar con el texto «Cuando quieras, púlsalo» y no se envía ninguna petición de generación
- **Escenario: la visita del taller abre el proyecto de ejemplo**
  - **Cuando** el docente lanza «Revisa y edita tu proyecto»
  - **Entonces** se abre en el taller el proyecto de ejemplo en el idioma de la interfaz, en solo lectura, y la visita recorre el contenido, el panel de recursos, la exportación, la traducción y el botón «Copiar»
- **Escenario: el proyecto de ejemplo no se puede modificar ni borrar**
  - **Dado** el proyecto de ejemplo
  - **Cuando** un docente (o cualquiera que no sea administrador) intenta editarlo, renombrarlo, traducirlo, reescribirlo con IA o borrarlo
  - **Entonces** el backend responde 403 y el taller lo muestra bloqueado
- **Escenario: el proyecto de ejemplo no aparece en los listados**
  - **Dado** el proyecto de ejemplo en la base de datos
  - **Cuando** se consulta el historial, el área personal, las notificaciones o los proyectos aprobados que se usan como referencia para la IA
  - **Entonces** no aparece
- **Escenario: copiar el proyecto de ejemplo**
  - **Dado** el proyecto de ejemplo abierto
  - **Cuando** el docente pulsa «Copiar»
  - **Entonces** obtiene una copia propia y editable («Copia de …») que ya no está marcada como ejemplo
- **Escenario: completar o abandonar una visita queda registrado**
  - **Cuando** el docente termina una visita o la cierra en el paso N
  - **Entonces** al terminarla se añade su id a `onboarding.completedTours` y se registra en la telemetría `tour_completed` o `tour_abandoned` con el paso
- **Escenario: los pasos siguen el idioma de la interfaz**
  - **Dado** una visita en curso en castellano
  - **Cuando** se lanza otra visita tras cambiar a catalán
  - **Entonces** todos los textos de la visita y del panel de Ayuda salen en catalán
- **Escenario: todas las anclas de las visitas existen**
  - **Dado** la definición de cada visita
  - **Entonces** cada selector `[data-tour="…"]` existe en la plantilla de la vista correspondiente (test de integridad)
- **Escenario: el botón «?» de cada pantalla lanza su visita**
  - **Dado** el generador, el taller o el mapa
  - **Cuando** el docente pulsa «?» junto al título
  - **Entonces** empieza la visita de esa pantalla
- **Escenario: en móvil la visita del menú despliega la barra lateral**
  - **Dado** una pantalla de móvil con la barra lateral plegada
  - **Cuando** empieza «Conoce Plappin»
  - **Entonces** la barra lateral se despliega antes de resaltar sus opciones

## 3. Alternativas

**Motor de la visita**
- **driver.js (recomendada).** Licencia MIT, unos 5 KB y sin dependencias. Se encarga del resaltado con fondo oscurecido, la colocación del texto, el teclado (flechas y Esc) y el desplazamiento hasta el elemento. Trabaja sobre el DOM, así que no depende de zone.js. Se envuelve en un `TourService` para poder simularlo en los tests.
- *Implementación propia* (superposición + `getBoundingClientRect`). Sin dependencias, pero obliga a reconstruir y probar la colocación, el desplazamiento, el teclado y la accesibilidad con el umbral del 90 % por archivo. Más coste y más fallos posibles.
- *Shepherd.js / Intro.js.* Más pesados. Intro.js exige licencia comercial y Shepherd arrastra Floating UI.

**Dónde guardar el progreso**
- **En el usuario, en el backend (recomendada).** Los docentes alternan el ordenador del centro y el de casa, y «para todos» exige saber qué usuarios ya la han cerrado.
- *localStorage.* Más sencillo, pero se repetiría en cada navegador y se perdería al limpiar los datos.

**Proyecto de ejemplo**
- **Documento `Project` real con `isExample: true`, creado por migración a partir de un JSON bilingüe del repositorio (recomendada).** Reutiliza el taller tal cual (lectura, recursos, exportación y copia), y la protección de solo lectura ya existe (`canEditProject`, `blocked()`). Solo hay que excluirlo de los listados.
- *Proyecto falso solo en el frontend.* Habría que simular en el taller toda la carga del proyecto, y exportar o copiar no funcionaría.
- *Clonarlo automáticamente a cada docente.* Llenaría las áreas personales de copias iguales; mejor que lo copie quien quiera, con el botón «Copiar».

**Contenido del ejemplo:** una situación de aprendizaje de 1.º de CFGS Educación Infantil, un ciclo ya incorporado con datos completos en ES/CA. Se genera con el propio generador, se revisa a mano, se traduce y se valida la paridad con el agente `traductor-es-ca`. Se guarda en `backend/src/data/proyecto-ejemplo/proyecto-ejemplo.json`; no se incrusta en el frontend.

## 4. Cambios por archivo

| Archivo | Cambio | Capa |
|---|---|---|
| `backend/src/models/User.ts` | Subdocumento `onboarding: { welcomeDismissed: Boolean (default false), completedTours: [String] }`. Mongoose aplica el valor por defecto a los documentos antiguos: los usuarios existentes verán la bienvenida sin migración | domain |
| `backend/src/data/tours.ts` | Lista de ids de visitas válidos (`intro`, `generator`, `taller`, `mapa`) para validar el PATCH | domain |
| `backend/src/controllers/onboarding.controller.ts` (nuevo) | `GET /api/users/me/onboarding` y `PATCH /api/users/me/onboarding` (`{ welcomeDismissed?, completedTour? }`, con `$addToSet` y validación del id) | presentation |
| `backend/src/routes/user.routes.ts` | Registrar las dos rutas | presentation |
| `backend/src/models/Project.ts` | `isExample: { type: Boolean, default: false, index: true }` | domain |
| `backend/src/services/project-access.service.ts` | `canEditProject` devuelve `false` para `isExample` salvo a administradores | application |
| `backend/src/controllers/project.controller.ts` | Excluir `isExample` de `listProjects`, de los proyectos aprobados usados como referencia (l. 147-151) y de los recuentos; `deleteProject` rechaza el ejemplo; nuevo `getExampleProject` (`GET /api/projects/example`, antes de `/:id`) | presentation |
| `backend/src/controllers/notification.controller.ts` | Excluir `isExample` | presentation |
| `backend/src/controllers/project-clone.controller.ts` | La copia no hereda `isExample` | presentation |
| `backend/src/controllers/docx.controller.ts` | Permitir exportar el ejemplo (hoy solo lo hace el autor) | presentation |
| `backend/src/routes/project.routes.ts` | Ruta `GET /example` | presentation |
| `backend/src/data/proyecto-ejemplo/proyecto-ejemplo.json` (nuevo) | Contenido del ejemplo: título, nivel, módulos, RA, metodología y `rawText`/`jsonStructure` en castellano y catalán | domain |
| `backend/src/migrations/50_proyecto_ejemplo.ts` (nuevo) | Inserta o actualiza (upsert por `isExample: true`) el proyecto de ejemplo con estado `publicado`, traducción `completada` y sin `userId` de docente. Se puede reejecutar | infrastructure |
| `backend/src/tests/onboarding.test.ts`, `project-example.test.ts` (nuevos) | Escenarios de bienvenida, visitas, solo lectura, exclusión de listados, copia y migración | tests |
| `frontend/package.json` | Dependencia `driver.js` (versión exacta) | config |
| `frontend/src/app/features/help/tours/tour.model.ts` (nuevo) | Tipos `TourId`, `TourStep { anchor, titleKey, textKey, side? }`, `TourDefinition { id, view, before?, steps }` | domain |
| `frontend/src/app/features/help/tours/{intro,generator,taller,mapa}.tour.ts` (nuevos) | Definición declarativa de cada visita (de 3 a 6 pasos) | domain |
| `frontend/src/app/features/help/services/tour.service.ts` (nuevo) | Cambia de vista (`layout.switchView`), despliega la barra lateral en móvil, espera el render (`afterNextRender`), crea driver.js con los textos de `trans.t()`, marca la visita como completada y registra la telemetría | application |
| `frontend/src/app/features/help/services/onboarding.facade.ts` (nuevo) | Estado en signals (`welcomeVisible`, `completedTours`) y llamadas GET/PATCH; «Más tarde» en `sessionStorage` | application |
| `frontend/src/app/features/help/components/welcome-modal/` (nuevo, `.ts/.html/.scss/.spec.ts`) | Bienvenida con el selector ES/CA y los tres botones | presentation |
| `frontend/src/app/features/help/components/help-panel/` (nuevo) | Panel lateral de Ayuda: visitas (con ✓), preguntas frecuentes plegables y «Escríbenos» | presentation |
| `frontend/src/app/features/help/components/help-button/` (nuevo) | Botón «?» reutilizable con `@Input() tour` | presentation |
| `frontend/src/app/layout/components/sidebar/sidebar.component.{ts,html}` | Botón «Ayuda» encima del de idioma; anclas `data-tour` en las opciones del menú | presentation |
| `frontend/src/app/app.{ts,html}` | Montar `app-welcome-modal` y `app-help-panel`; cargar el onboarding al haber usuario | presentation |
| `generator-view.component.html`, `taller-view.component.html`, plantilla de la vista del mapa | Anclas `data-tour` y `app-help-button` junto al título (sin añadir lógica a componentes que ya son grandes) | presentation |
| `frontend/src/app/features/projects/services/projects.facade.ts` | `openExampleProject()`: pide `/api/projects/example` y lo abre en el taller | application |
| `frontend/src/app/services/translations.{es,ca}.ts` | Todos los textos: bienvenida, panel, preguntas frecuentes y pasos (`tour*`) | presentation |
| `frontend/src/app/features/help/tours/tours.integrity.spec.ts` (nuevo) | Comprueba que cada ancla existe en su plantilla y que cada clave de texto existe en ES y CA | tests |
| `frontend/src/styles/_tour.scss` (nuevo) | Tema de driver.js con la paleta de `_variables.scss`, botones grandes y tipografía legible | presentation |
| `documentation/visita_guiada.md` (nuevo) | Cómo añadir o modificar una visita, las anclas, la persistencia y el proyecto de ejemplo | docs |

## 5. Tareas

- [ ] Rama `feature/246_visita_guiada_y_ayuda`.
- [ ] Backend: `onboarding` en `User`, controlador, rutas y tests.
- [ ] Backend: `isExample` en `Project`, solo lectura, exclusión de listados, `GET /api/projects/example`, copia y exportación; tests.
- [ ] Contenido del ejemplo: generarlo con la app (CFGS Educación Infantil, 1.º), revisarlo, traducirlo y validar la paridad ES/CA con `traductor-es-ca`; guardarlo en el JSON.
- [ ] Migración `50_proyecto_ejemplo.ts` (upsert) y test de reejecución.
- [ ] Frontend: `driver.js`, modelo de visitas, `TourService` y `OnboardingFacade`, con tests.
- [ ] Frontend: ventana de bienvenida con el selector de idioma y tests.
- [ ] Frontend: panel de Ayuda, botón en la barra lateral, preguntas frecuentes, «Escríbenos» y tests.
- [ ] Anclas `data-tour` y las cuatro visitas: Conoce Plappin, Crea tu primer proyecto, Revisa y edita tu proyecto (sobre el ejemplo) y Explora el mapa.
- [ ] Botones «?» en el generador, el taller y el mapa.
- [ ] Test de integridad de anclas y claves ES/CA.
- [ ] Telemetría `tour_started` / `tour_completed` / `tour_abandoned` con el paso.
- [ ] Revisión de los textos en lenguaje de aula, sin jerga técnica.
- [ ] `documentation/visita_guiada.md` y `tareas/246_visita_guiada_y_ayuda.md`.
- [ ] Lint, typecheck y suites completas; commit, push y despliegue (la migración solo inserta un documento nuevo: no es delicada).

## 6. Riesgos y verificación prevista

- **Anclas rotas tras rediseños:** el test de integridad falla si desaparece un `data-tour`. Además, `TourService` omite los pasos cuyo elemento no esté en el DOM, en lugar de romper la visita.
- **Proyecto de ejemplo filtrado a medias:** hay que revisar todas las consultas a `Project` (historial, área personal, notificaciones, referencias de la IA, recuentos y administración) y cubrir cada una con un test.
- **Paridad ES/CA:** el test de integridad comprueba las claves en los dos idiomas; el contenido del ejemplo se valida con `traductor-es-ca` y se comprueba que las dos versiones tienen las mismas secciones.
- **Zoneless:** driver.js no usa zone.js; la espera del render se hace con `afterNextRender` y el estado va en signals. `check-zoneless.js` lo verifica.
- **Límites de tamaño:** el taller ya supera las 200 líneas, así que solo se le añaden atributos y el componente `app-help-button`, sin lógica. Las visitas son datos declarativos y `TourService` se divide en helpers de 25 líneas como máximo.
- **Cobertura por archivo (90 %, plantillas 80 %):** driver.js se simula en los specs; la bienvenida y el panel se prueban con clics reales del DOM.
- **Bienvenida para todos tras el despliegue:** es lo deseado. Si molesta, basta con «No volver a mostrar».
- **Accesibilidad:** foco atrapado en la bienvenida, `role="dialog"` y `aria-labelledby`, cierre con Esc y contraste de la paleta.
- **Verificación:** `cd backend && npm run typecheck && npm test`; `cd frontend && npx eslint <archivos> && npx ngc -p tsconfig.app.json --noEmit && npm test`; prueba manual con `docker compose up` (bienvenida en ES/CA, las cuatro visitas en escritorio y en móvil, intento de editar el ejemplo); tras el despliegue, comprobar la migración 50 y `GET /api/projects/example` en producción.
