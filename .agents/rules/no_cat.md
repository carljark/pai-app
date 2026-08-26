# Regla estricta: Herramientas de escritura

1. **PROHIBIDO EL USO DE CAT PARA ESCRIBIR:** Nunca utilices comandos de Bash como `cat << EOF > archivo` para crear o modificar código fuente.
2. **HERRAMIENTA NATIVA:** Utiliza única y exclusivamente tu herramienta nativa de creación y edición de archivos (`write_to_file` / `replace_file_content`). El motivo es que los comandos de shell requieren permisos explícitos del usuario continuamente, interrumpiendo el flujo de trabajo.
