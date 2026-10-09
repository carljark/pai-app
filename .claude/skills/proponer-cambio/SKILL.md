---
name: proponer-cambio
description: Escribe un plan de cambio en planes/ (NNN_plan_*.md con el número común que compartirán la rama feature/NNN y la tarea, + entrada en README.md) ANTES de implementar, y espera el OK del usuario. Úsala antes de una tarea grande (funcionalidad nueva, migraciones, muchos archivos o riesgo alto, los mismos casos que llevan rama feature según AGENTS.md §1) o cuando el usuario pida proponer o planificar un cambio.
---

# Proponer cambio

Argumento opcional: descripción corta del cambio ($ARGUMENTS). Si falta, dedúcela de la conversación.

**Esta skill no modifica código.** Solo investiga, escribe el plan y espera la aprobación.

1. **Investiga** lo necesario para que el plan sea concreto: archivos reales, rutas y líneas. Consulta `AGENTS.md`, `documentation/` y `tareas/` antes de redescubrir algo.
2. **Número común (AGENTS.md §1.1):** el plan fija el número NNN que compartirán la rama `feature/NNN_*` y el registro `tareas/NNN_*.md`. Es el mayor número usado en `tareas/`, `planes/` o las ramas `feature/` más uno, con 3 dígitos:
   ```bash
   { ls tareas planes; git branch -a; } | grep -oE '(^|feature/)[0-9]+_' | grep -oE '[0-9]+' | sort -n | tail -1 | awk '{printf "%03d\n", $1+1}'
   ```
   Si la tarea ya tiene rama `feature/NNN_*` creada, usa ese número en vez de calcular uno nuevo.
3. **Nombre:** `planes/NNN_plan_<descripcion_snake_case>.md` (en castellano, sin tildes ni ñ en el nombre de archivo).
4. **Contenido** (en castellano, creado con la herramienta Write):
   ```markdown
   # Plan NNN: <Título>

   > **Fecha:** <D de Mes de AAAA>
   > **Estado:** Propuesto
   > **Partes afectadas:** backend / frontend / migraciones / despliegue

   ---

   ## 1. Objetivo
   Qué se quiere conseguir y por qué, en 3-5 líneas.

   ## 2. Escenarios
   Comportamiento esperado, verificable. Cada escenario será el nombre de un test.
   - **Escenario: <nombre>**
     - **Dado** <contexto>
     - **Cuando** <acción>
     - **Entonces** <resultado observable>

   ## 3. Alternativas
   Opciones consideradas con sus trade-offs, en breve. Indica la **recomendada** y por qué.

   ## 4. Cambios por archivo
   | Archivo | Cambio | Capa |
   |---|---|---|
   | `backend/src/...` | <qué cambia> | domain / infrastructure / application / presentation / config |

   ## 5. Tareas
   - [ ] <paso concreto>

   ## 6. Riesgos y verificación prevista
   Qué puede romperse (datos y migraciones, paridad ES/CA, cobertura por archivo, compatibilidad zoneless, límites de 200 líneas por componente y 25 por función, despliegue en el EC2) y qué comandos o pruebas lo validarán.
   ```
5. **Índice:** inserta la entrada **al principio** de la lista en `planes/README.md` (debajo de `## Planes`), con este formato:
   ```markdown
   - **[NNN — Título](NNN_plan_xxx.md)** · _Propuesto_  
     Descripción de una o dos frases.

   ```
   (Hay dos espacios al final de la primera línea, que son el salto de línea en Markdown.)
6. **Presenta** al usuario la ruta del plan y un resumen corto (objetivo, alternativa recomendada y archivos afectados) y **espera su OK**. No implementes nada todavía.
7. **Al recibir el OK:** cambia el estado a `Aprobado` en el plan y en el índice, crea la rama `feature/NNN_<descripcion>` con **el mismo número del plan** y empieza a implementar siguiendo la sección 5 y el flujo de AGENTS.md §1. Si el usuario lo rechaza, pon `Descartado` y anota el motivo en una línea bajo la cabecera.

Al terminar la implementación, `/registrar-tarea` crea `tareas/NNN_*.md` con el mismo número, enlaza el plan y lo marca como `Implementado (tarea NNN)`.
