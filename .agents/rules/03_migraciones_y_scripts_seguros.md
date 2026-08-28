# Regla estricta: Migraciones y Scripts Temporales Seguros

Para realizar modificaciones complejas, migraciones locales, automatizaciones de test o refactorizaciones multiarchivo mediante scripts auxiliares, debes cumplir estrictamente las siguientes directivas:

1. **Uso de Escritura Nativa:**
   Está terminantemente prohibido el uso de comandos shell de redirección (como `cat << EOF > script.js`) para escribir código o scripts. Todo script temporal o de migración debe crearse y modificarse utilizando la herramienta nativa `write_to_file` o `replace_file_content`.

2. **Ubicación en Espacio Temporal de Trabajo:**
   Los scripts temporales, auxiliares o de migración no deben crearse en directorios principales de la aplicación (como la raíz de `frontend/` o `backend/`) para evitar ensuciar el repositorio de trabajo. Debes ubicarlos siempre dentro del directorio de espacio temporal o scratch provisto para la sesión (por ejemplo, en el directorio de scratch `/scratch/` dentro del directorio de artefactos de la conversación).

3. **Ejecución y Limpieza Absoluta:**
   Una vez ejecutado el script en el espacio temporal mediante la terminal, es obligatorio proceder a su eliminación inmediata para garantizar que el repositorio y el espacio de trabajo queden completamente limpios y libres de archivos basura antes de finalizar el turno.
