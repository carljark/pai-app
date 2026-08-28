# Regla estricta: Diseño y Colores Homogéneos en la Interfaz

Para asegurar una experiencia de usuario (UX) consistente y profesional en toda la aplicación, debes cumplir estrictamente las siguientes directivas sobre estilos y colores:

1. **Uso de Clases del Framework de Estilos:**
   Está prohibido inyectar colores duros de forma arbitraria (como `background: #27ae60;` o `color: #ef4444;`) mediante atributos de estilo en línea (`style="..."`) dentro de los templates de componentes, a menos que sea estrictamente necesario por dinámicas visuales o animaciones. En su lugar, debes emplear las clases de utilidad provistas por el framework de estilos (como `btn-primary`, `btn-secondary`, `btn-danger`, etc.).

2. **Alineación con Variables SCSS:**
   Si es necesario aplicar un estilo específico o una regla css personalizada, debes mapear los colores obligatoriamente a las variables de color predefinidas en el archivo `_variables.scss` (por ejemplo, `$color-primary`, `$color-primary-dark`, `$color-success`, `$color-danger`, etc.). No inventes nuevas tonalidades de color fuera de la paleta corporativa sage-green pastel/ladrillo establecida.

3. **Homogeneidad de Botones y Componentes:**
   Los botones de llamada a la acción (CTAs) equivalentes o que realicen acciones principales (como "Generar Proyecto", "Guardar Borrador", etc.) deben compartir la misma clase y aspecto visual (`btn-primary`) que los botones de acción homólogos en otras vistas del sistema (como el Historial, el Sidebar o el Taller).
