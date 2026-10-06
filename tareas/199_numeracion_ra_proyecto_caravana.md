# Tarea 199: Numeración oficial de los RA en el proyecto «La Caravana Màgica» (producción)

## Propósito
El proyecto de FP Básica «La Caravana Màgica» (id `6aac10caecae615c96ac5b38`, 2.º curso, en catalán, generado el 17-09-2026) es anterior a la tarea 185. La IA numeró los RA con un esquema propio, «RA módulo.posición» (`RA 1.1`, `RA PI.3`…), que no coincide con el número oficial de cada RA en su módulo. Por ejemplo, «Prepara les instal·lacions» aparecía como `RA 1.1` y es el RA2 de *Preparació de l'entorn professional*.

El usuario indicó que el apartado 2 (Concreció curricular) estaba bien, pero el texto guardado usaba el mismo esquema en todo el documento (la propia introducción del apartado 2 lo explicaba). Se corrigió el documento entero para que la numeración sea homogénea.

## Arquitectura y flujo
- El contenido es Markdown libre en `generatedContent.rawText`. El proyecto no tiene traducciones.
- Ningún código renumera el texto, así que se trató como una corrección puntual de datos en producción. No se cambió código del producto ni se añadió ninguna migración.
- Pasos:
  1. Exportar el proyecto y la colección `ras` de producción (`mongoexport`, solo lectura).
  2. Construir la correspondencia emparejando cada descripción con el catálogo de RA. El texto del proyecto difiere ligeramente del catálogo actual (se corrigió después), así que se emparejó a mano, módulo a módulo.
  3. Script temporal en Python (en el espacio temporal de la sesión) que:
     - sustituye las etiquetas;
     - reescribe los rangos que dejan de ser correlativos;
     - reescribe dos líneas que mezclaban RA de varios módulos;
     - cambia las dos frases que explicaban la numeración antigua;
     - ordena por número de RA las filas de las tablas del apartado 2 y de la matriz.
  4. Revisión del diff (220 líneas cambiadas) y aprobación del usuario.
  5. Copia de seguridad: `scripts/backup-prod-db.sh` → `pai_db_20261006_105916.archive.gz`, en el EC2 y en local.
  6. `updateOne` condicionado a `contentVersion: 3`: escribe el texto nuevo y sube `contentVersion` a 4, igual que una edición desde la interfaz (`buildContentUpdate`).

## Correspondencia aplicada

| Módulo | Antes → oficial |
|---|---|
| Projecte intermodular d'aprenentatge col·laboratiu | PI.1→RA5, PI.2→RA4, PI.3→RA2, PI.4→RA3, PI.5→RA1 |
| Preparació de l'entorn professional | 1.1→RA2, 1.2→RA3, 1.3→RA4, 1.4→RA1 |
| Cures estètiques / Depilació / Maquillatge / Atenció al client | x.n→RAn |
| Rentat i canvis de forma del cabell | 5.n→RAn |
| Ciències aplicades II | 7.1→RA1, 7.2→RA2, 7.3→RA11 |
| Comunicació i societat II | 8.1→RA8, 8.2→RA4 |
| Itinerari per a l'ocupabilitat | 9.1→RA5, 9.2→RA1, 9.3→RA2 |

## Archivos modificados
1. Documento `projects` `6aac10caecae615c96ac5b38` en la base de datos de producción: `generatedContent.rawText` y `contentVersion` (3 → 4).
2. `.gitignore`: ignora `.claude/settings.local.json`.
3. `.claude/settings.local.json` (local, no versionado): permisos de `ssh`/`scp` al EC2 y del script de copia de seguridad, solo para este proyecto.

## Decisiones técnicas
- **Etiqueta `RAn` sin prefijo de módulo.** Es el formato oficial y el que usan los proyectos generados después de la tarea 185. Donde la etiqueta antigua aportaba el contexto de módulo (listas que mezclaban módulos), se añadió el nombre del módulo.
- **Rangos.** Los rangos no correlativos tras renumerar se convierten en listas, por ejemplo «RA 7.1 a RA 7.3» → «RA1, RA2 i RA11».
- **Sin cambios en criterios ni en textos de RA.** Las letras de los criterios y las descripciones no se tocan: la tarea solo afecta a la numeración.
- **Escritura condicionada a `contentVersion: 3`.** Así no se pisa una edición hecha entre la exportación y la escritura.
- **Tipo de `contentVersion`.** El `$inc` del shell de mongo lo guardó como double. Se reescribió como `NumberInt(4)`, el mismo tipo que el resto de documentos.
- **Otro proyecto que menciona «carav».** «Ciències aplicades I + Comunicació i societat I» (`6ac25a8232ba53f026edd6e3`) ya tenía la numeración oficial y no se tocó. El usuario pidió corregir solo este proyecto.

## Verificación
- Releído el proyecto tras la escritura:
  - el texto guardado es idéntico al revisado;
  - `contentVersion` = 4 (int);
  - estado `borrador`;
  - 0 etiquetas con el formato antiguo.
- La web responde 200 (`https://plappin.duckdns.org/`).
- No se ejecutaron las suites de tests: no hay cambios de código, solo `.gitignore`.
- Scripts y exportaciones temporales borrados del espacio temporal; también se borró la copia del JSON en el EC2 y en el contenedor.
