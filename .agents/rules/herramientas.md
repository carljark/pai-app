# Reglas Adicionales para el Agente

1. **Uso de herramientas:** Utiliza siempre tu herramienta de creación de archivos nativa (write_to_file) para crear o modificar archivos. NO utilices el comando `cat` en bash (ej. `cat << EOF`) ya que requiere permisos explícitos constantemente.

2. **Limpieza de scripts temporales:** Si creas scripts auxiliares o de un solo uso (como scripts en .js, .ts o .cjs para aplicar refactorizaciones, probar expresiones regulares o automatizar pequeños cambios locales), es tu obligación eliminarlos (usando `rm`) antes de dar por completado tu turno o tarea. El repositorio debe quedar siempre completamente limpio y sin archivos basura.
