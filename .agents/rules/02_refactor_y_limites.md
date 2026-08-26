# Reglas estrictas: Refactorización y Límites de Código

Para garantizar la mantenibilidad, legibilidad y modularidad del proyecto, debes cumplir estrictamente las siguientes directivas al escribir o modificar código:

1. **Límite de líneas por Componente:** 
   Si un componente (especialmente en Angular) alcanza o se acerca a las **200 líneas** de código (contando lógica y template), es tu obligación detenerte y **extraer partes a nuevos componentes independientes** (preferiblemente Standalone Components) o mover lógica a servicios externos. No sigas engordando archivos grandes.

2. **Límite de líneas por Función/Método:**
   Ninguna función o método debe superar las **25 líneas** de extensión. Si la lógica que vas a implementar requiere más líneas, debes **dividirla y delegar responsabilidades en funciones auxiliares** más pequeñas, con nombres descriptivos y enfocadas en una única tarea (Single Responsibility Principle).
