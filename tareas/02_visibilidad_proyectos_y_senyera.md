# Diseño Técnico: Visibilidad Global de Proyectos y Renderizado de la Senyera

## 1. Propósito de la Tarea
- Restaurar la visibilidad de todos los proyectos en el archivo (historial) para que el claustro pueda ver las creaciones de los demás compañeros.
- Identificar al creador del proyecto mostrando su nombre en el listado del historial.
- Resolver los problemas de renderizado Unicode con la bandera de Cataluña (la Senyera), garantizando que se vea perfectamente en todos los navegadores y sistemas operativos (especialmente macOS/iOS).

## 2. Arquitectura y Flujo de Datos
- **Backend (`server.ts`):** Se ha revertido el filtro privado (`{ userId: req.user._id }`) en el endpoint `GET /api/projects` para que devuelva la totalidad de los documentos de la colección `Project`. Adicionalmente, se ha utilizado la función `.populate('userId', 'name')` de Mongoose para inyectar automáticamente el nombre del creador haciendo un JOIN con la colección de usuarios.
- **Frontend (`app.html`):** 
  - Se ha añadido lógica interpolada en las tarjetas del historial: `{{ proj.userId?.name || 'Anónimo' }}` para mostrar la autoría. Si el proyecto se creó antes de implementar el sistema de login, mostrará "Anónimo".
  - Se ha rediseñado el componente de selección de idioma. En lugar de depender del inestable Emoji Tag Sequence (`🏴󠁥󠁳󠁣󠁴cat󠁿`), se ha incrustado un gráfico **SVG (Scalable Vector Graphics)** inline. Este enfoque dibuja los vectores geométricos (4 barras rojas sobre fondo amarillo) en tiempo real, garantizando un renderizado 100% fiel e inmune a las limitaciones tipográficas del SO del cliente.

## 3. Archivos Modificados
- `backend/src/server.ts`: Endpoint `GET /api/projects`.
- `frontend/src/app/app.html`: Tarjetas de la sección Historial y componente `<select>` del idioma.

## 4. Detalles Técnicos Adicionales
El uso de un SVG inline (900x600 con coordenadas rectangulares) no incrementa el peso del DOM de manera medible y soluciona un problema clásico del ecosistema Apple, el cual se niega a soportar banderas regionales más allá de las preaprobadas por Unicode, interpretando a menudo el tag de Cataluña como una simple bandera pirata/negra.
