# Tarea 117: Visualización del Sidebar Sin Colapsar por Defecto en la Página Home

## Propósito
Configurar el comportamiento del sidebar principal de navegación de la aplicación para que, cuando el usuario se encuentre en la página de inicio (**Home**), se muestre por defecto expandido (sin colapsar), permitiendo una visibilidad inmediata y accesible de todas las secciones del menú lateral. En el resto de vistas operativas (generador, taller, mapa, historial, etc.), el sidebar permanece colapsado por defecto a 72px para maximizar el área de trabajo y contenido.

---

## Arquitectura y Flujo

```
               [Inicio de App o Navegación]
                           │
                           ▼
                  LayoutService.currentView
                           │
              ┌────────────┴────────────┐
              │                         │
     view === 'home'             view !== 'home'
              │                         │
              ▼                         ▼
   isSidebarCollapsed(false)  isSidebarCollapsed(true)
              │                         │
              ▼                         ▼
   .app-sidebar (250px)       .app-sidebar.collapsed (72px)
   [Iconos + Texto menú]      [Solo iconos de acceso rápido]
```

1. **Estado Inicial (`LayoutService`):**
   - El signal `isSidebarCollapsed` se inicializa en `false` si la vista por defecto o restaurada desde `localStorage` es `'home'`.
   - Si se restaura una vista diferente de `'home'`, se inicializa en `true`.
2. **Transición entre Vistas (`switchView`):**
   - Al invocar `switchView('home')`, el sidebar se expande automáticamente (`isSidebarCollapsed.set(false)`).
   - Al navegar a cualquier otra vista (`'generator'`, `'taller'`, `'history'`, `'admin'`, `'mapa'`, `'personal'`, `'feedback'`), el sidebar se colapsa (`isSidebarCollapsed.set(true)`) para proporcionar el máximo espacio de interfaz.
3. **Acción Manual del Usuario (`toggleSidebar`):**
   - El usuario conserva en todo momento la libertad de alternar el estado del sidebar manualmente en cualquier pantalla utilizando el botón correspondiente.

---

## Archivos Modificados

| Archivo | Cambio Realizado |
|---|---|
| `frontend/src/app/services/layout.service.ts` | Inicialización de `isSidebarCollapsed` en `false` para la vista `'home'`; sincronización en `switchView` y constructor según si la vista activa es `'home'`. |
| `frontend/src/app/services/layout.service.spec.ts` | Actualización de las pruebas unitarias para validar el estado expandido en `'home'` por defecto y el colapso al alternar o navegar a otras vistas. |

---

## Detalles Técnicos

1. **Gestión Reactiva con Signals:**
   - La propiedad `isSidebarCollapsed = signal<boolean>(false)` refleja el estado del sidebar como primitiva reactiva de Angular.
   - En `switchView(view)`, la asignación `this.isSidebarCollapsed.set(view !== 'home')` garantiza un comportamiento predecible y desacoplado de efectos secundarios.
2. **Compatibilidad Responsive y Desktop:**
   - Los estilos en `_layout.scss` aplican la clase `.app-sidebar.collapsed` a partir del breakpoint `md` (768px), pasando de 250px a 72px de ancho con transición suave.
3. **Validación de Tests y Cobertura:**
   - Pruebas unitarias de `LayoutService` ampliadas cubriendo los casos de inicialización, toggle manual, navegación a `'home'` y navegación a otras vistas.
   - **Frontend:** 31/31 suites, 389/389 tests pasando exitosamente, con **94.97% de branch coverage** (por encima del umbral del 90%).
