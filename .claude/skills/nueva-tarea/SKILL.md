---
name: nueva-tarea
description: Crea el documento de diseño técnico de una tarea en tareas/ con el siguiente número secuencial. Úsala al terminar cualquier implementación o desarrollo relevante, o cuando el usuario pida documentar una tarea.
---

# Documentar una tarea en `tareas/`

1. Calcula el siguiente número: `ls tareas | sed -E 's/^([0-9]+).*/\1/' | sort -n | tail -1` y súmale 1. Usa orden numérico, no alfabético.
2. Si el usuario pasó un tema en `$ARGUMENTS`, úsalo para el nombre; si no, dedúcelo de los cambios de la sesión (`git status`, `git diff --stat`).
3. Crea `tareas/<NNN>_<slug_en_snake_case>.md` con la herramienta Write (nunca `cat`/heredoc), en castellano, con esta estructura:

```markdown
# Tarea <NNN>: <Título descriptivo>

## Propósito
<Problema que resuelve y objetivo.>

## Arquitectura y flujo
<Cómo encaja en backend/frontend, flujo de datos, endpoints, signals, migraciones.>

## Archivos modificados
1. `ruta/al/archivo`: <qué cambió y por qué>.

## Decisiones técnicas
<Librerías, patrones, tradeoffs y alternativas descartadas.>

## Verificación
<Tests añadidos o actualizados. No ejecutes tests ni builds: indica los comandos para que los lance el usuario.>
```

4. Si la tarea cambia arquitectura, proveedores o modelos de IA, modelo por defecto, razonamiento o fallback, actualiza también el documento pertinente en `documentation/`.
5. No hagas commit.
