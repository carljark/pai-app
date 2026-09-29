# Análisis de Arquitectura Hexagonal - Frontend PAI

**Fecha:** 2026-09-29 20:52:42 CEST  
**Autor:** Asistente IA (OpenCode)

---

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| Features totales | 11 |
| Hexagonales limpias | 4 (36%) |
| Con deuda arquitectónica | 7 (64%) |

---

## ✅ Features que SÍ cumplen arquitectura hexagonal

| Feature | Domain | Application | Infrastructure | Presentation |
|---------|--------|-------------|----------------|--------------|
| **Auth** | `auth.model.ts` | `auth.facade.ts` | `auth.mapper.ts` | `auth-form.component.ts` |
| **Notifications** | `notification.model.ts` | `notifications.facade.ts` | `notification.mapper.ts`, `PaiService` | `notifications-badge`, `recent-activity-modal` |
| **Mapa Intermodular** | `mapa-intermodular.model.ts` | `mapa-intermodular.facade.ts` | `mapa-intermodular.service.ts`, seed data | `mapa-intermodular-view` + UI |
| **Curriculum** | `curriculum.model.ts` | `curriculum.facade.ts` | `ras_cfgm_*.data.ts` | `curriculum-selector` |

**Patrón correcto**: Facade expone *signals* y *métodos de caso de uso*; service solo HTTP; mapper DTO↔Domain; componente solo consume facade.

---

## ❌ Features con deuda arquitectónica (prioridad de refactor)

### 1. **Projects** — **ALTA** 🔴
**Problema**: `ProjectsFacade` inyecta `HttpClient` y hace llamadas HTTP directamente.
```typescript
// projects.facade.ts - infra en application
private http = inject(HttpClient);
generateProject() { return this.http.post(...) }
exportDocx() { return this.http.get(...) }
```
**Solución**: Extraer `ProjectsService` (infra: HTTP + mapper), `ProjectsFacade` solo orquesta casos de uso y estado.

---

### 2. **Feedback** — **ALTA** 🔴
**Problema**: `FeedbackService` (infra) expone estado de UI (`signals`).
```typescript
// feedback.service.ts - estado de presentación en infra
feedbacks = signal<FeedbackItem[]>([]);
isSubmitting = signal<boolean>(false);
isLoading = signal<boolean>(false);
```
**Solución**: Crear `FeedbackFacade` (application) con estado; `FeedbackService` solo HTTP + `FeedbackMapper`.

---

### 3. **Generator View** — **ALTA** 🔴
**Problema**: Lógica de negocio y selectores hardcodeados en componente.
```typescript
// generator-view.component.ts
onCourseChange() { curriculum.setCurso(...) }
onMethodologyChange() { projects.methodology.set(...) }
// selectores IA/modelo hardcodeados en template
```
**Solución**: `GeneratorFacade` con `getAvailableModels(tipoNivel)`, `generateProjectUseCase()`.

---

### 4. **History View** — **MEDIA** 🟡
**Problema**: Usa `AppFacade` como service locator, lógica de filtrado en componente.
**Solución**: `HistoryFacade` con `getFilteredProjects(filters)`, `getStats()`.

---

### 5. **Personal View** — **MEDIA** 🟡
**Problema**: `filteredProjects` computed con lógica de negocio compleja en vista.
**Solución**: `PersonalFacade` expone `getProjectsByLevel()`, `getStats()`.

---

### 6. **Taller View** — **MEDIA** 🟡
**Problema**: Orquestación completa en componente (export, import, save, publish, PDF).
**Solución**: `TallerFacade` con `exportDocx()`, `importDocx()`, `saveDraft()`, `publish()`, `exportPDF()`.

---

### 7. **Admin Dashboard** — **MEDIA** 🟡
**Problema**: Sin facade propio; `AdminFacade` es anémico (solo CRUD), lógica de negocio en componente.
**Solución**: `AdminFacade` con `approveUser()`, `changeRole()`, `toggleAiAccess()`, `getAnalytics()`.

---

### 8. **Home Dashboard** — **BAJA** 🟢
**Estado**: Casi OK. Solo accede a `projects.fpProjects()` (computed interno del facade).
**Mejora menor**: Facade expone `getRecentProjects(limit)`.

---

### 9. **AppFacade** — **BAJA** 🟢 (God Object)
**Problema**: Service locator; componentes inyectan `AppFacade` y acceden a todo.
```typescript
// app.facade.ts
export class AppFacade {
  layout = inject(LayoutService);
  trans = inject(TranslationService);
  curriculum = inject(CurriculumFacade);
  projects = inject(ProjectsFacade);
  notifications = inject(NotificationsFacade);
  paiService = inject(PaiService);
  auth = inject(AuthFacade);
  telemetry = inject(TelemetryService);
}
```
**Solución**: Eliminar; inyectar facades directamente donde se necesiten.

---

### 10. **Auth** — **BAJA** 🟢 (Menor)
**Estado**: Ya hexagonal. Solo mover `AuthMapper` a `infrastructure/mappers` (ahora en `features/auth/mappers`).

---

## 🎯 Plan de acción inmediato

**Próximo paso**: Refactor **Projects** (prioridad ALTA)
1. Crear `ProjectsService` (infra: HTTP + `ProjectsMapper`)
2. Crear `ProjectsMapper` (DTO ↔ Domain)
3. Limpiar `ProjectsFacade` → solo casos de uso + estado
4. Actualizar tests y verificar cobertura ≥ 90%
5. Actualizar componentes consumidores (`generator-view`, `history-view`, `personal-view`, `taller-view`, `home-dashboard`)

---

## Archivos a modificar en Projects (estimado)

```
src/app/features/projects/
├── models/
│   └── project.model.ts           # nuevo: domain types
├── mappers/
│   └── projects.mapper.ts         # nuevo: DTO ↔ Domain
├── services/
│   ├── projects.service.ts        # nuevo: infra HTTP
│   └── projects.facade.ts         # refactor: solo application
└── components/                    # consumidores a actualizar
```

---