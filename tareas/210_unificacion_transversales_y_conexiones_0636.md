# Tarea 210: Unificación de los módulos transversales y conexiones rotas del mapa de Peluquería

## Propósito
Resolver los pendientes de la tarea 209:
1. Cuatro conexiones del mapa de 2.º de Peluquería (0643 RA5) apuntaban a un **RA6 del 0636** (Estética de manos y pies) que no existe.
2. Revisar los módulos transversales de **Estética** y **Educación Infantil**, que podían arrastrar los mismos errores que Peluquería.

## Hallazgos y correcciones
- **Conexiones al 0636 RA6.** El documento fuente (`mapa_intermodular_0643_marketing_venta_REHECHO_ES.docx`, apartado C10) cita «0636 — RA6: diseño visual de uñas y presentación, CE 0636-6a». El autor numeró un RA de más: en el BOE, el 0636 tiene cinco RA y la decoración de uñas es el RA5.
  - Las conexiones 0643-5e…h pasan a **0636 RA5 a)**, «Se han diseñado, de forma grafica, distintos maquillajes de uñas», con título, RA destino y criterio sincronizados. Se conservan sus actividades.
  - Eliminarlas habría dejado el 0643 RA5 con 4 conexiones, por debajo del mínimo de 6.
  - En el apartado C6 (0643-3e…i), la referencia secundaria vacía «0636-RA6.» («decoración y presentación estética de uñas») pasa a cita del RA completo «0636-RA5. Realiza la decoración de uñas…», porque la letra del documento no es fiable.
- **Estética (1664, 1709 y 0156):**
  - En castellano tenía los mismos espacios sobrantes que Peluquería en el 1664 («software ,», «cloud /nube»).
  - En catalán era otra traducción, a menudo más idiomática, pero con formas valencianas («seua», «seues»).
- **Educación Infantil:** el 1709 RA2 conservaba el texto **original** del RD 659/2023 («Alcanza las competencias necesarias para la obtención del título de Técnico Básico…»), que el texto consolidado sustituyó, y arrastraba «s'han de ser aplicades». Los módulos 1665 y 0179 son correctos; las diferencias de espacios frente al PDF vienen de sus cursivas.
- **Traducción canónica:**
  - Para 1664, 1709 y 0156, el agente `traductor-es-ca` combinó las dos versiones existentes con estos criterios: fidelidad al BOE, catalán balear («seva/seves»), sin calcos («del mateix», «a realitzar», «la EC») y terminología fija («acompliment», «per compte d'altri», «nexes»).
  - Se aplica a Estética, Peluquería, Educación Infantil (1709) y Atención a la Dependencia, que ya compartían 1708, 1710 y 1713.
- **Posesivos valencianos en el resto de Estética:** las 211 apariciones en campos catalanes (40 en los RA y 171 en el mapa, incluidas actividades y justificaciones) pasan a «seva/seves». Ningún otro ciclo tiene formas valencianas en campos catalanes.
- **Mapas sincronizados:** se actualizan los textos copiados de RA y criterios en los mapas de Estética, Peluquería (1.º y 2.º) e Infantil (1.º), respetando el formato de cada uno: Estética cita «0633-1h. texto» sin repetir la letra, y su JSON es compacto. Con eso desaparecen dos discrepancias previas del mapa de Estética: «verificant» en un texto castellano y «nexos/nexes».

## Arquitectura y flujo
- **Scripts temporales deterministas e idempotentes:** una segunda pasada no cambia nada. Reescriben datos y mapas con su formato original, así que el diff solo contiene las correcciones.
- **Migración `28_reload_transversales_canonicos.ts`:**
  - Recarga los RA de `CFGM_ESTETICA`, `CFGM_PELUQUERIA`, `CFGS_EDUCACION_INFANTIL` y `CFGM_ATENCION_DEPENDENCIA`.
  - Recarga las pestañas `CFGM`, `CFGM_PELUQUERIA`, `CFGM_PELUQUERIA_2` y `CFGS_EDUCACION_INFANTIL`. La de 2.º de Infantil no cambia.
  - Solo toca esos niveles y pestañas, y se puede reejecutar.

## Archivos modificados
1. `backend/src/data/ras_cfgm_estetica.data.ts`, `ras_cfgm_peluqueria.data.ts`, `ras_cfgs_educacion_infantil.data.ts` y `ras_cfgm_atencion_dependencia.data.ts`: transversales unificados; posesivos baleares en Estética.
2. `backend/src/data/mapa-intermodular/mapa_cfgm_estetica.json`, `mapa_cfgm_peluqueria.json`, `mapa_cfgm_peluqueria_2.json` y `mapa_cfgs_educacion_infantil.json`: textos sincronizados y conexiones al 0636 corregidas.
3. `backend/src/migrations/28_reload_transversales_canonicos.ts` (nueva).
4. `backend/src/tests/mapa.test.ts`: test de la migración 28. Comprueba que es idempotente, que no toca FP Básica, que el 1709 RA2 tiene el texto consolidado y la misma traducción en Estética e Infantil, que no queda «seua» ni «cloud /nube» en Estética y que las conexiones del 0643 apuntan al 0636 RA5.
5. `backend/src/tests/ras-atencion-dependencia.test.ts`: el test de transversales compartidos cubre ahora Estética (1664, 1709 y 0156) e Infantil (1708, 1709 y 1710).
6. `documentation/niveles_educativos_y_catalogo.md`: nueva sección «Módulos transversales compartidos (FP)».

## Pendiente / fuera de alcance
- **FP Básica, mapa (`mapa_fpb.json`):** dos campos catalanes contienen texto mezclado con castellano («…que ací es enuncia, apoyades en l'anatomia…»). Se detectó en el barrido de formas valencianas. No se ha corregido porque no forma parte de estos pendientes.

## Verificación
- Auditoría con scripts temporales: los cinco mapas de FP por módulos coinciden al 100 % con sus datos de RA (Estética 3 488, Peluquería 3 140 y 3 938, Infantil 2 260 y 2 306 textos), sin RA destino inexistentes.
- `cd backend && npm test`: 29 archivos y 356 tests. En dos de las cinco ejecuciones completas falló un archivo distinto cada vez (`notifications.test.ts` al arrancar, `criterios.test.ts` con una respuesta que no era una lista). Ninguno toca estos datos, ambos pasan siempre en solitario y las tres últimas ejecuciones completas salieron en verde. Parece inestabilidad del entorno de tests.
- `cd frontend && npm test`: 66 archivos y 832 tests en verde (1 omitido); cobertura y comprobación zoneless correctas.
- Despliegue en producción con `./scripts/deploy-prod.sh` tras el commit.
