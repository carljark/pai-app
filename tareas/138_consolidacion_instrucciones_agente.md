# Consolidación de instrucciones para agentes

## Propósito

Centralizar en el `AGENTS.md` de la raíz las reglas globales de trabajo que antes estaban distribuidas entre `GEMINI.md`, `.agents/rules/` y la skill de incorporación de ciclos FP. El objetivo es que los agentes dispongan de una referencia única para versionado, documentación, mantenibilidad, scripts seguros, diseño de interfaz, zoneless, migraciones, FP y configuración de modelos IA.

## Arquitectura y flujo de las instrucciones

`AGENTS.md` funciona como índice normativo principal del repositorio. Contiene las reglas comunes y resume los invariantes de la integración FP. Para las tareas especializadas conserva referencias a la fuente de detalle:

- `.agents/skills/agregar-fp/SKILL.md`
- `.agents/skills/agregar-fp/references/checklist_archivos.md`
- `.agents/skills/agregar-fp/references/lecciones_aprendidas_cobertura.md`

Los archivos originales no se eliminaron ni modificaron; siguen disponibles para consulta exhaustiva.

## Archivos modificados

- `AGENTS.md`: consolidación de reglas globales de `GEMINI.md`, reglas de `.agents/rules/`, política de zoneless, normas para migraciones y scripts, integración FP y capacidades de razonamiento de modelos.
- `tareas/138_consolidacion_instrucciones_agente.md`: registro técnico de esta consolidación.

## Detalles técnicos y decisiones

- Se preservó la regla de no hacer commits automáticamente y la documentación secuencial de tareas.
- Se unificaron las directrices de uso de herramientas, limpieza de scripts temporales, límites de tamaño de componentes y funciones, consistencia visual y seguridad de migraciones.
- Se aclaró que zoneless no elimina `TestBed` ni `fixture.detectChanges()`; se prohíbe reintroducir Zone.js y se orientan las pruebas a `await fixture.whenStable()`.
- Se resumieron los invariantes de FP: fuentes oficiales, paridad ES/CA, separación por curso, mapas JSON persistidos en MongoDB, conexiones sin actividades vacías, deduplicación y cobertura de pruebas.
- Se mantuvo la regla existente de verificar capacidades por proveedor/modelo antes de enviar parámetros de razonamiento y de cubrir modelos compatibles e incompatibles con tests.

## Verificación

- Revisión de `GEMINI.md`, los seis archivos de `.agents/rules/`, la skill `agregar-fp` y sus dos referencias.
- `git diff --check` sin errores. No se requieren pruebas de aplicación para este cambio de documentación.
