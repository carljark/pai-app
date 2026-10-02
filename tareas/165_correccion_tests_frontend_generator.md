# Tarea 165: Corrección de tests del frontend (generator-view y projects.facade)

## Propósito

Dejar la suite del frontend en verde corrigiendo dos tests desincronizados con el código actual.

## Cambios

### `generator-view.component.spec.ts`
- El mock de `CurriculumFacade` reemplazaba el signal `tipoNivel` por uno nuevo (`mockCurriculum.tipoNivel = signal(v)`), de modo que el `computed` `courseOptions()` no se recalculaba al cambiar de nivel y el `<select>` no llegaba a ofrecer la opción `4º` (fallaba `setCurso('4º')`).
- Se sustituye por signals estables (`tipoNivelSignal`, `cursoSignal`) y un spy `setTipoNivelSpy`; el primer test pasa a comprobar el spy en lugar de `mockSet`.

### `projects.facade.spec.ts`
- `loadHistory` devuelve el historial ya mapeado (`fromProjectDtoArray`), que normaliza `ras`, `collaborators` y `generatedContent`. El test comparaba contra el DTO crudo.
- Se actualiza la expectativa a `fromProjectDtoArray(mockProjects)`.

## Resultado

- `ng test --watch=false`: **41 archivos, 584 tests en verde** (1 skipped).
- `git diff --check` limpio.
