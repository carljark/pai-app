---
name: procesar-solicitudes
description: Lee las solicitudes de centros abiertas en producción (scripts/solicitudes-pendientes.sh, solo lectura), presenta los ciclos de FP que faltan por incorporar y, para los que elija el usuario, los incorpora uno a uno con la skill agregar-ciclo-educativo, cada uno en su propia tarea y rama. Úsala cuando el usuario pida procesar, revisar o atender las solicitudes de centros pendientes.
---

# Procesar solicitudes de centros

Los docentes piden su centro y sus ciclos desde la aplicación («Solicitar centro»). Esta skill convierte esas peticiones en tareas. Diseño completo en `documentation/solicitudes_de_centros.md`.

## 1. Leer lo pendiente (solo lectura)

```bash
./scripts/solicitudes-pendientes.sh
```

Devuelve un JSON con:
- `solicitudes`: las abiertas (`pendiente` o `en_curso`), con el centro, el docente y el comentario.
- `ciclosPendientes`: los ciclos que faltan, sin duplicados entre solicitudes. Cada uno lleva `codigo` (código de la CAIB, p. ej. `SAN36`), `etapa`, `nombre_es`, `nombre_ca` y los ids de las solicitudes que lo piden. Los ciclos escritos a mano por el docente no tienen `codigo` y solo traen `nombre`.

Los ciclos que ya están en el catálogo (`codigoCaib` en `backend/src/data/niveles.ts`) salen como disponibles y no aparecen en `ciclosPendientes`.

## 2. Presentar y preguntar

Muestra al usuario una tabla corta con el código, el grado, el nombre y cuántas solicitudes piden cada ciclo, más los ciclos escritos a mano. Pregunta cuáles abordar ahora. **No incorpores nada sin su elección:** cada ciclo es una tarea grande, con extracción del BOE, traducción y despliegue.

- Ciclos sin `codigo`: identifícalos en la oferta (`backend/src/data/oferta-fp-ib.json`) o en TodoFP y la CAIB. Si no existen como ciclo de FP de Baleares, propón al usuario descartarlos.
- Un ciclo de otra comunidad o un nivel que no es FP queda fuera de esta skill: avisa al usuario.

## 3. Incorporar cada ciclo elegido

Para cada ciclo, uno detrás de otro:

1. Sigue la skill `agregar-ciclo-educativo` (ruta FP), **sin mapa intermodular**.
   - Cada ciclo es su propia tarea con número común (AGENTS.md §1.1) y rama `feature/NNN_*`, creada desde la rama de la tarea anterior para que los despliegues no se pisen.
2. Añade `codigoCaib: '<codigo>'` a la entrada nueva de `niveles.ts`. El test de `solicitudes.test.ts` comprueba que el código existe en la oferta.
3. Tests, commit, push y despliegue, como en cualquier tarea (AGENTS.md §1).
4. Registra la tarea con `/registrar-tarea` y cita en ella las solicitudes que la motivaron.

## 4. Cerrar el ciclo

La skill **no escribe en producción** (AGENTS.md §7). Al terminar, recuerda al usuario que, en el panel de administración («Solicitudes de centros»):
- marque cada ciclo incorporado como `incorporado` con su número de tarea;
- cierre como `completada` la solicitud cuando ya no le falte ningún ciclo. El docente recibe un aviso cada vez que cambia el estado de su solicitud.

Una vez desplegado el ciclo, la aplicación ya lo muestra como `disponible` aunque nadie haya cambiado su estado, porque lo recalcula con el catálogo.

## 5. Mantener la oferta

`backend/src/data/oferta-fp-ib.json` se generó una vez a partir de las páginas de familias profesionales de la CAIB, con los nombres en castellano de TodoFP. Si la CAIB añade ciclos, regenera el JSON con el procedimiento de `documentation/solicitudes_de_centros.md` y revisa la paridad ES/CA.
