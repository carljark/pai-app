# Tarea 26: Traducción del dashboard Home al Catalán

## Propósito
El usuario ha solicitado que la página principal ("home") se adapte completamente al sistema de internacionalización bilingüe (Castellano/Catalán), ya que aún contenía textos y literales en código duro.

## Arquitectura/Flujo
1. **Revisión del Servicio**: El `TranslationService` (`translation.service.ts`) ya incluía múltiples claves para el `Home` (como `homeTitle`, `homeGreeting`, etc.), pero algunas partes del HTML y del Typescript no las estaban explotando correctamente.
2. **Nuevas claves**: Se han añadido variables para las opciones del nivel educativo que figuraban escritas a fuego (`courseLevelFP` y `courseLevelPDC`) y una clave para el nombre de usuario por defecto (`defaultUser` = "Docente" / "Docent").
3. **Refactorización del template y lógica**:
   - Se ha intervenido `home-dashboard.component.ts`.
   - Se modificaron las asignaciones condicionales que imprimían el nivel de estudios (`project.tipoNivel === ...`) usando el servicio de traducción.
   - Se modificó la frase de "*Ver todos los proyectos (X)*" para usar `workshopViewAll`.
   - Se adaptó la variable reactiva `userName = computed(...)` para utilizar `this.t().defaultUser` cuando no haya nombre guardado en sesión.

## Archivos Modificados
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`: Inserción de `t()` en vez de strings estáticos.
- `frontend/src/app/services/translation.service.ts`: Integración de los literales "Docente"/"Docent".
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.spec.ts`: Actualización del mock del servicio de traducción para no quebrar las aserciones de la suite de testing.

## Detalles Técnicos
- La refactorización incluyó el fix de 2 tests (`should get default user name if null` y `should handle project level label correctly`) que validaban el texto explícito, sustituyendo los *matches* por el equivalente provisto a través del Mock de Vitest para no afectar la cobertura obligatoria del >90%.
