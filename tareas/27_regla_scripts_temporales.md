# Tarea 27: Regla estricta de scripts temporales y migraciones seguras

## Propósito
El usuario ha solicitado establecer una directriz formal sobre cómo el agente debe gestionar, escribir y ubicar los scripts temporales de automatización, migración o refactorización. La meta es evitar el uso de comandos shell no nativos (como `cat << EOF`) que requieran permisos adicionales y prevenir la creación de archivos basura en los directorios de trabajo principales de la aplicación.

## Arquitectura/Flujo
1. **Creación de la Regla**: Se ha redactado un nuevo archivo de reglas en el directorio de políticas del asistente: `.agents/rules/03_migraciones_y_scripts_seguros.md`.
2. **Definición de Directivas**:
   - **Uso de Escritura Nativa**: Obliga al uso de las herramientas de la plataforma (`write_to_file`, `replace_file_content`) en vez de redirecciones de comandos en la consola de comandos.
   - **Ubicación en el Workspace Scratch**: Demanda que cualquier script temporal sea ubicado fuera de la raíz de frontend o backend (específicamente en la carpeta de scratch temporal del espacio de trabajo).
   - **Limpieza de Residuos**: Refuerza la obligatoriedad de limpiar todos los archivos temporales generados tras finalizar su ejecución.

## Archivos Modificados
- `.agents/rules/03_migraciones_y_scripts_seguros.md` (creado)
- `tareas/27_regla_scripts_temporales.md` (creado)

## Detalles Técnicos
- La regla se integra en el framework de descubrimiento de comportamiento del agente (`.agents/rules`). En futuros contextos de tareas, el agente consultará estas directivas automáticamente antes de intentar crear scripts de ayuda o pruebas locales.
