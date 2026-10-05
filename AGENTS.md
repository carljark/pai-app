# Instrucciones para agentes

Estas reglas consolidan las instrucciones globales de `GEMINI.md` y las directrices de `.agents/rules/`. Para incorporar ciclos de Formación Profesional, también es obligatorio seguir `.agents/skills/agregar-fp/SKILL.md` y sus referencias.

## 1. Control de versiones, tests y despliegue

El agente se encarga de todo el ciclo de cada tarea, salvo que el usuario indique otra cosa:

1. **Rama.** Cambios pequeños y acotados: en la rama de trabajo actual. Tareas grandes (funcionalidad nueva, migraciones, muchos archivos o riesgo alto): rama nueva `feature/NNN_descripcion` creada desde la rama actual, con la numeración de las existentes (`git branch -a`).
2. **Verificación.** Lint y typecheck, y después las suites completas: `cd backend && npm test` y `cd frontend && npm test`. Si algo falla, se corrige (aunque no lo haya causado la tarea) y se vuelve a ejecutar hasta que todo pase.
3. **Commit y push.** Mensaje en castellano que resuma la tarea. Nunca `push --force`, `reset --hard` ni reescribir historia publicada. No se hace merge a `main`: lo decide el usuario.
4. **Despliegue en producción** (EC2 Ubuntu, ver `documentation/despliegue_produccion.md`), solo con los tests en verde: copia de seguridad (`scripts/backup-prod-db.sh`), `git pull` de la rama de trabajo y reconstrucción con `docker-compose.prod.yml`; después, comprobar contenedores, migraciones y API. Si el despliegue falla, volver al commit anterior desplegado y avisar.
5. El agente tiene permiso permanente para desplegar con `./scripts/deploy-prod.sh` sin pedir confirmación. En la fase actual del proyecto no importa cortar generaciones o traducciones en curso; solo hay que avisar antes si el despliegue implica migraciones de datos delicadas.

## 2. Documentación de tareas

- Todo lo que se implemente o desarrolle debe documentarse en `tareas/` en la raíz. Si no existe la carpeta, créala; por cada tarea importante, crea un archivo Markdown propio.
- Antes de crear el documento, revisa los números existentes y usa el siguiente número secuencial disponible; añade un nombre breve y descriptivo, por ejemplo `138_consolidacion_instrucciones_agente.md`.
- Redacta un diseño técnico profesional que incluya propósito, arquitectura/flujo, archivos modificados y decisiones o detalles técnicos relevantes (librerías, patrones y tradeoffs).
- Mantén además la documentación técnica pertinente en `documentation/`, especialmente para decisiones de arquitectura y comportamiento de proveedores, modelos por defecto, razonamiento y fallback.

## 3. Edición de archivos y scripts temporales

- Utiliza las herramientas nativas de edición/creación de archivos. No uses `cat`, heredocs ni redirecciones de shell para escribir o modificar archivos.
- Los scripts auxiliares o de un solo uso deben crearse en el espacio temporal aprobado para la sesión, no en directorios fuente de `frontend/` o `backend/`.
- Tras ejecutarlos, elimina los scripts temporales inmediatamente y comprueba que no quedan archivos basura. No elimines scripts de producto o migraciones permanentes.

## 4. Mantenibilidad y límites de código

- Si un componente —especialmente uno Angular— se acerca o supera unas **200 líneas** (incluyendo lógica y plantilla), detente y extrae partes a componentes standalone o mueve lógica a servicios; no sigas aumentando archivos ya grandes.
- Ninguna función o método debe superar **25 líneas**. Divide responsabilidades mayores en helpers pequeños, con nombres descriptivos y responsabilidad única.

## 5. Diseño visual homogéneo

- **Plantillas y estilos siempre en archivos propios:** los componentes Angular deben declarar su vista con `templateUrl` y sus estilos con `styleUrls`/`styleUrl`. Queda prohibido incrustar HTML o CSS en el TypeScript mediante `template:`/`styles:`.
- **Estilos con convención BEM:** las clases CSS/SCSS deben seguir BEM (`bloque`, `bloque__elemento`, `bloque--modificador`), usando el selector del componente como bloque (p. ej. `.history-view`, `.history-view__tab`, `.history-view__tab--active`). Evita clases genéricas o anidadas que rompan el aislamiento del bloque.
- Evita colores arbitrarios hardcodeados en atributos `style` de las plantillas. Prefiere las clases existentes (`btn-primary`, `btn-secondary`, `btn-danger`, etc.). Se permiten excepciones cuando el estilo dinámico o la animación lo requieran realmente.
- Si hace falta CSS personalizado, usa la paleta corporativa y las variables de `_variables.scss` (`$color-primary`, `$color-success`, etc.); no inventes colores nuevos.
- Mantén el mismo aspecto para acciones equivalentes: los CTA principales deben seguir el patrón compartido, normalmente `btn-primary`.

## 6. Frontend Angular zoneless

- El frontend es zoneless y declara `provideZonelessChangeDetection()` en `src/app/app.config.ts`. No reintroduzcas `zone.js` en dependencias, imports, `test-setup.ts` ni polyfills.
- El estado asíncrono que alimenta la vista debe actualizar signals/computed. Si un estado no signal usado por la plantilla cambia, notifica con `ChangeDetectorRef.markForCheck()` o `ApplicationRef.tick()`.
- Para trabajo tras el render, prefiere `afterNextRender`/`afterEveryRender`; no uses `NgZone.onStable` ni `onMicrotaskEmpty` como sustitutos.
- Comprueba la compatibilidad zoneless de dependencias externas; por ejemplo, `<markdown>` de `ngx-markdown` es compatible, pero no se debe asumir lo mismo del pipe.
- No importes `zone.js/testing` ni uses `fakeAsync`/`tick` o la utilidad de pruebas `async` de Angular. Para esperar la estabilidad, usa tests nativos `async`/`await` con `await fixture.whenStable()`.
- **Zoneless no prohíbe `TestBed` ni `fixture.detectChanges()`:** úsalos cuando el test necesite crear el fixture o solicitar explícitamente una actualización de la vista.
- Al terminar cada tarea, ejecuta las suites completas (`npm test` en `backend/` y `frontend/`) y corrige los fallos antes de hacer commit (ver §1).

## 7. Migraciones y modificaciones de datos

- Antes de añadir una migración, inspecciona el runner, las migraciones existentes y la secuencia para evitar colisiones; identifica qué entorno y colecciones afecta.
- Trata las migraciones como cambios persistentes: define claramente su alcance, evita sobrescribir o borrar datos ajenos y verifica si es seguro reejecutarlas. Fuera del despliegue descrito en §1 (que incluye la copia de seguridad previa y las migraciones del runner), no ejecutes operaciones de escritura contra producción sin autorización explícita.
- Los scripts temporales de migración se guardan en el espacio temporal aprobado y se eliminan tras usarlos; una migración de producto debe residir en la carpeta de migraciones que utiliza el runner real.

## 8. Incorporación de ciclos FP

Cuando la tarea incorpore un ciclo, sigue la skill y referencias completas:

- `.agents/skills/agregar-fp/SKILL.md`
- `.agents/skills/agregar-fp/references/checklist_archivos.md`
- `.agents/skills/agregar-fp/references/lecciones_aprendidas_cobertura.md`

Directrices invariantes:

- Contrasta currículos y denominaciones con fuentes oficiales: TodoFP/BOE para castellano y CAIB/BOIB para catalán balear. No uses datos inventados ni copias monolingües como fallback.
- Mantén paridad real ES/CA en datos, interfaz, generador, prompts, mapa y traducciones: nunca pongas catalán en campos `_es` ni castellano en `_ca`. El cambio de idioma debe mapear de forma reactiva tanto datos de API/Mongo como seeds estáticos; los prompts deben usar el nombre oficial en el idioma solicitado.
- Integra el nivel de extremo a extremo: modelos/enums y migraciones backend; tipos, carga/fallback curricular y orden por curso en frontend; traducciones; generador, historial, home, perfil y mapa.
- Si hay 1.º y 2.º curso, separa selección de módulos, datasets y pestañas del mapa por curso.
- Guarda mapas grandes como JSON en `backend/src/data/mapa-intermodular/` e ingiéralos mediante migraciones en MongoDB. **No incrustes semillas grandes como TypeScript en el bundle frontend** por el riesgo de OOM en builds/EC2.
- Para el mapa: cada conexión debe tener al menos una actividad (`activities.length >= 1`); no crees conexiones huérfanas. Mantén entre **6 y 15 conexiones por RA** como objetivo (aprox. 300–600 por curso), relaciones bidireccionales y actividades deduplicadas. Conserva simetría ES/CA en módulos, RA/CE, conexiones y actividades; como máximo tres CE externos por conexión.
- Empareja los documentos curriculares castellano/catalán por índice de actividad y verifica que mantienen la misma estructura y cantidad de filas/bloques.
- En tests del mapa, simula clicks en los botones reales del DOM para cubrir las funciones compiladas de plantillas y comprueba títulos/contenido en ambos idiomas. En tests que esperan errores, espía y restaura `console.error`; provee mocks para evitar peticiones HTTP accidentales.
- Usa el scaffold de la skill cuando proceda, verifica la secuencia de migración y alcanza al menos **90 % de cobertura global**, además de respetar los umbrales específicos de cobertura de plantillas configurados en el frontend.

## 9. Proveedores, modelos y razonamiento de IA

- Antes de añadir o modificar parámetros de razonamiento, generación o muestreo, comprueba que el proveedor y el modelo concretos los admiten; no asumas que un parámetro común de API sirve para todos.
- Usa la configuración nativa de cada proveedor y solo en modelos con soporte confirmado: por ejemplo, `thinkingConfig.thinkingLevel` en Gemini y `reasoning_effort` en OpenRouter.
- No envíes parámetros de razonamiento a routers dinámicos como `openrouter/free` si no puedes garantizar que el modelo elegido los admita.
- Si cambian el catálogo o las capacidades, actualiza la allowlist del backend y añade tests de modelos compatibles e incompatibles.
- Documenta cambios relevantes de proveedor, modelo predeterminado, razonamiento y fallback en `documentation/`.
