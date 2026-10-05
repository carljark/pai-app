---
name: registrar-tarea
description: Documenta una tarea terminada en tareas/ con el siguiente número secuencial (AGENTS.md §2). Úsala al acabar cualquier implementación o desarrollo relevante, o cuando el usuario pida registrar o documentar lo hecho.
---

# Registrar una tarea en `tareas/`

Argumento opcional: descripción corta de la tarea ($ARGUMENTS). Si falta, dedúcela de la conversación y de los cambios de la sesión (`git status`, `git diff --stat`).

1. **Número:** `ls tareas | sed -E 's/^([0-9]+).*/\1/' | sort -n | tail -1` y súmale 1. Usa orden numérico, no alfabético: hay números de 2 y 3 dígitos.
2. **Nombre:** `tareas/<NNN>_<slug_en_snake_case>.md`, en castellano, sin tildes ni ñ en el nombre de archivo.
3. **Contenido:** créalo con la herramienta Write (nunca `cat`/heredoc), en castellano, con esta estructura:

```markdown
# Tarea <NNN>: <Título descriptivo>

> **Plan:** [NNN — Título](../planes/NNN_plan_xxx.md)   (solo si la tarea viene de un plan)

## Propósito
<Problema que resuelve y objetivo.>

## Arquitectura y flujo
<Cómo encaja en backend/frontend, flujo de datos, endpoints, signals, migraciones.>

## Archivos modificados
1. `ruta/al/archivo`: <qué cambió y por qué>.

## Decisiones técnicas
<Librerías, patrones, tradeoffs y alternativas descartadas.>

## Verificación
<Comandos ejecutados de verdad en la sesión y su resultado: lint, typecheck, `npm test` de backend y frontend, revisión visual, despliegue. Si algo no se verificó, dilo y explica por qué.>

## Desviaciones respecto al plan
<Solo si hay plan: qué cambió frente a lo previsto y por qué. Si no hubo cambios, dilo.>
```

4. **Plan de origen:** si la tarea viene de un plan de `planes/` (búscalo por la conversación o con `grep -l "Aprobado" planes/*.md`), cambia su estado a `Implementado (tarea NNN)` en el plan y en `planes/README.md`.
5. Si la tarea cambia arquitectura, proveedores o modelos de IA, modelo por defecto, razonamiento o fallback, actualiza también el documento pertinente en `documentation/`.
6. Muestra al usuario la ruta del archivo creado.

No inventes resultados de verificación: reporta solo lo que se ejecutó de verdad. Esta skill solo documenta; los tests, el commit, el push y el despliegue siguen el flujo de AGENTS.md §1.
