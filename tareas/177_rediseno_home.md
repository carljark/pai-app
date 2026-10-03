# Tarea 177: Rediseño de la página de inicio (home)

## Propósito
Reducir el texto corrido de la home y hacerla más atractiva, **sin modificar el logo ni la palabra "plappin" de la cabecera**.

Antes, bajo el logo había dos bloques largos: una descripción con tres viñetas extensas (`homeDescription`) y un aviso sobre la IA de unas 80 palabras (`homeAiDisclaimer`). Los botones de acción quedaban debajo de todo ese texto.

## Diseño
- **Público y función**: docentes de FP y ESO; la home sirve para empezar o retomar un proyecto en un clic y entender de un vistazo qué hace la herramienta.
- **Paleta**: solo variables corporativas de `_variables.scss` (`$color-primary`, `-dark`, `-light`, `$color-background`, textos). Tipografía Inter, la de la app, con más escala en el saludo.
- **Estructura**:
  1. Hero: logo y palabra **intactos**, saludo como titular (`h1`, 2rem), una línea de propuesta de valor y los dos botones, todo centrado.
  2. **"Cómo funciona"**: tres pasos numerados (secuencia real: elegir currículo → generar → revisar y exportar) **unidos por una línea**, la metáfora de *conectar módulos*. Es el único elemento llamativo de la página. En móvil pasa a vertical con tramos de línea entre nodos.
  3. Tres ventajas en línea (icono + título + una frase), sin tarjetas.
  4. Nota breve: "La IA propone, tú decides." más una frase.
  5. Actividad reciente, sin cambios.
- Se evitaron recursos genéricos: tarjetas idénticas con sombra, etiquetas en mayúsculas y títulos de sección innecesarios ("Qué te ofrece" se eliminó en la revisión visual).

## Arquitectura y archivos
1. `features/home/components/home-intro/` (**nuevo**, standalone, `templateUrl`/`styleUrl`, BEM `home-intro__*`): pasos, ventajas y nota de IA a partir de `computed` sobre las traducciones. Los iconos SVG están en la constante `FEATURE_ICONS`.
2. `home-dashboard.component.{html,ts,scss}`: saludo como `h1`, `home-hero__tagline`, uso de `<app-home-intro>`; se eliminan los estilos de los bloques de texto retirados. Las reglas `.home-hero__logo-container`, `__word` y `__logo` no se modifican.
3. `translations.{es,ca}.ts`: se sustituyen `homeDescription` y `homeAiDisclaimer` por 16 claves cortas con paridad ES/CA (`homeTagline`, `homeStepsTitle`, `homeStep1..3Title/Text`, `homeFeature1..3Title/Text`, `homeAiTitle`, `homeAiText`).
4. Specs: nuevo `home-intro.component.spec.ts` (pasos, ventajas, iconos y cambio a catalán); `home-dashboard.component.spec.ts` comprueba el nuevo hero y que el logo sigue presente.

## Decisiones técnicas
- Componente separado para no superar las ~200 líneas por componente (AGENTS §4) y aislar los estilos.
- Texto sin HTML: las claves nuevas son texto plano, sin `[innerHTML]`.
- Línea de conexión con pseudo-elementos (`::before` en escritorio, `::after` por paso en móvil) y un anillo del color de fondo en los nodos.

## Verificación
- Revisión visual con Playwright en escritorio (1366 px) y móvil (390 px), en castellano y catalán.
- `ngc`, `tsc` de specs y ESLint sin errores.
- Pendiente (usuario): `cd frontend && npm test`.
