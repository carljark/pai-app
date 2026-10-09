# Tarea 211: Corrección del catalán del mapa intermodular de FP Básica

## Propósito
En la tarea 210 apareció en el mapa de FP Básica una justificación catalana mezclada con castellano («…que ací es enuncia, apoyades en l'anatomia…»). Al revisarla se vio que el problema era más amplio: muchas justificaciones y algunas copias de criterios del mapa tenían una traducción defectuosa. Esta tarea corrige el catalán de `mapa_fpb.json` (pestaña `FPB`).

## Errores corregidos
- **Castellanismos léxicos:**
  - Verbos: «Mantener», «Favorecer», «Expresarse», «cerrar», «Recoger», «Conocer», «Ofrecer», «Ejecutar», «Adecuar», «pedir», «mantiene», «introduce», «moviliza».
  - Otras palabras: «apoyades», «ofrecit», «evaluació», «recibiment», «mercancías», «almacenament», «albaranes», «proveedors», «enfermetat», «gusto», «cuya», «subsanables» (pasa a «esmenables»).
- **Acentos y ortografía castellanos:** «teoría», «patología», «morfológica», «terminología», «geométric», «diagnóstic», «democrátic», «idéntic», «fácilment», «eficacia», «correspondencia».
- **Apóstrofos y artículos:**
  - «del Itinerari» → «de l'Itinerari», y lo mismo con «del aigua», «del entorn» y «del espai».
  - «al entregar» → «en entregar»; «la emplenament» y «la harmonia» → «l'harmonia».
  - «l'industria» → «la indústria»; «l'importància» → «la importància».
  - «el seu fase» → «la seva fase»; «els cures» → «les cures».
- **Pronombres sin elidir:** «es expliquen» → «s'expliquen», «es ajusta» → «s'ajusta», «es entrenan» → «s'entrenen», «es recolzan» → «es recolzen».
- **Formas valencianas:** «ací» → «aquí», «obtindre» → «obtenir», «consumixen» → «consumeixen».
- **Otros:** «posat de treball» → «lloc de treball», «Preparar al client» → «Preparar el client» y concordancias verbales.

## Arquitectura y flujo
1. Un detector temporal con reglas estrictas («del/al/el/de» ante vocal, «la» ante a/e/o, «á», «ñ», «-ción», verbos castellanos, «es …an», formas valencianas) seleccionó 79 textos catalanes únicos con errores claros, con 133 apariciones entre justificaciones, copias de criterios y un título.
2. Dos revisiones con el agente `traductor-es-ca`, cada texto comparado con su campo `_es`:
   - **Lote 1:** corrección completa de los 79 textos marcados. Cambiaron 72; los otros 7 eran falsos positivos.
   - **Lote 2:** revisión de las 294 justificaciones únicas restantes, que salen de la misma traducción. Se corrigieron 85.
3. Las correcciones se aplican por **ruta exacta** en el JSON, comprobando antes que el texto de esa ruta es el esperado. El mismo texto repetido en varias conexiones se corrige en todas: 157 textos y 221 apariciones.
4. Un barrido posterior de patrones (acentos castellanos, léxico encontrado en los lotes) en **todos** los campos catalanes del mapa encontró 22 restos más, en justificaciones y en un título. Se corrigieron con sustituciones exactas: «morfológica», «l'industria», «subsanables»…
5. **Migración `29_reload_mapa_fpb_catalan.ts`:** recarga la pestaña `FPB` desde el JSON. No toca los RA ni otras pestañas y se puede reejecutar.

El JSON compacto del mapa se reescribe con su mismo formato.

## Archivos modificados
1. `backend/src/data/mapa-intermodular/mapa_fpb.json`: catalán corregido.
2. `backend/src/migrations/29_reload_mapa_fpb_catalan.ts` (nueva).
3. `backend/src/tests/mapa.test.ts`: test de la migración 29. Comprueba que es idempotente, que no toca otras pestañas, que carga 11 módulos y que no quedan «del Itinerari», «ací», «apoyades», «Mantener», «Favorecer», «es entrenan» ni «fácilment» en justificaciones y criterios catalanes.

## Decisiones técnicas
- **Los RA de FP Básica no se tocan:** `ras_fpb_catalan.data.ts` no tenía estos errores. Estaban solo en el mapa, incluidas sus copias de criterios.
- **Estructura del mapa sin resincronizar:** a diferencia de los mapas de grado medio y superior (tarea 210), el de FPB no se puede resincronizar automáticamente con sus RA. Usa nombres de módulo distintos («Cuidados estéticos básicos de uñas» frente a «… de manos y uñas»), códigos que no están en los datos y citas que no se pueden emparejar (788). Por eso solo se corrige la lengua, no la estructura.
- **Falsos positivos que se mantienen:** «es faran», «es duran» y «es poden» (formas catalanas correctas), «Atenció al client», «albarans» (plural de «albarà») y «Diferencia» (verbo catalán).
- **Límite de la revisión:** los textos de las actividades (unas 3 400) se muestrearon y parecen correctos, pero no se han revisado uno por uno. El barrido de patrones no encontró errores en ellos.

## Verificación
- Detector final sobre todos los campos catalanes del mapa: solo quedan falsos positivos conocidos.
- `cd backend && npx vitest run`: 29 archivos y 357 tests en verde.
- `cd frontend && npm test`: 66 archivos y 832 tests en verde (1 omitido); cobertura y comprobación zoneless correctas.
- Despliegue en producción con `./scripts/deploy-prod.sh` tras el commit.
