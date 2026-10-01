# Regla de no ejecución de tests ni builds

## Propósito
Dejar la ejecución de tests y compilaciones bajo el control del usuario durante las tareas de desarrollo.

## Cambio realizado
En `AGENTS.md`, la directriz de verificación del frontend ahora prohíbe ejecutar tests y builds (incluidos `npm test`, `ng test`, `npm run build` y `ng build`) durante las tareas. La excepción es que el usuario solicite explícitamente ejecutarlos.

## Archivos modificados
- `AGENTS.md`
- `tareas/141_regla_no_ejecutar_tests_ni_builds.md`
