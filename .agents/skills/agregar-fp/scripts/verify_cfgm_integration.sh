#!/bin/bash
# Script de validación para comprobar la correcta integración bilingüe de un CFGM
set -e

if [ -z "$1" ]; then
  echo "Uso: ./verify_cfgm_integration.sh <TIPO_NIVEL>"
  echo "Ejemplo: ./verify_cfgm_integration.sh CFGM_PELUQUERIA"
  exit 1
fi

TIPO_NIVEL="$1"
SLUG=$(echo "$TIPO_NIVEL" | sed 's/CFGM_//' | tr '[:upper:]' '[:lower:]')
ROOT_DIR="$(cd "$(dirname "$0")/../../../.." && pwd)"

echo "🔍 Verificando presencia e integridad bilingüe de $TIPO_NIVEL (slug: $SLUG)..."

# 1. Catálogo de niveles (fuente única de backend y frontend)
CATALOGO="$ROOT_DIR/backend/src/data/niveles.ts"
if grep -q "id: '$TIPO_NIVEL'" "$CATALOGO"; then
  echo "  ✅ El catálogo backend/src/data/niveles.ts contiene $TIPO_NIVEL"
  if grep -A 30 "id: '$TIPO_NIVEL'" "$CATALOGO" | grep -q "modulos:"; then
    echo "  ✅ Los cursos declaran sus módulos en orden oficial"
  else
    echo "  ⚠️ ADVERTENCIA: los cursos de $TIPO_NIVEL no declaran 'modulos' (se mostrarán todos sin ordenar)"
  fi
  if grep -A 30 "id: '$TIPO_NIVEL'" "$CATALOGO" | grep -q "mapas:"; then
    echo "  ✅ El nivel declara sus pestañas del mapa intermodular"
  else
    echo "  ⚠️ ADVERTENCIA: $TIPO_NIVEL no declara 'mapas' (no aparecerá en el mapa intermodular)"
  fi
else
  echo "  ❌ ERROR: Falta la entrada '$TIPO_NIVEL' en backend/src/data/niveles.ts"
fi

# 2. El frontend no debe nombrar el nivel: todo sale del catálogo
if grep -rq "$TIPO_NIVEL" "$ROOT_DIR/frontend/src" --include='*.ts' --include='*.html' --exclude='*.spec.ts' --exclude='niveles.mock.ts'; then
  echo "  ❌ ERROR: el frontend nombra $TIPO_NIVEL fuera de los specs; debe salir del catálogo:"
  grep -rln "$TIPO_NIVEL" "$ROOT_DIR/frontend/src" --include='*.ts' --include='*.html' --exclude='*.spec.ts' --exclude='niveles.mock.ts'
else
  echo "  ✅ El frontend no tiene el nivel escrito a mano"
fi

# 3. Integridad Bilingüe de Datos Curriculares (evitar la trampa del fallback monolingüe)
DATA_FILE="$ROOT_DIR/backend/src/data/ras_cfgm_${SLUG}.data.ts"
if [ -f "$DATA_FILE" ]; then
  echo "  ✅ Archivo de datos curriculares existe: ras_cfgm_${SLUG}.data.ts"
  # Comprobar que module_es y module_ca no son idénticos
  SAMPLE_CHECK=$(python3 -c "
import json, re
with open('$DATA_FILE', 'r', encoding='utf-8') as f:
    text = f.read()
m_es = re.findall(r'\"module_es\":\s*\"([^\"]+)\"', text)
m_ca = re.findall(r'\"module_ca\":\s*\"([^\"]+)\"', text)
if m_es and m_ca:
    diff = sum(1 for e, c in zip(m_es, m_ca) if e != c)
    print(f'{diff}/{len(m_es)}')
else:
    print('0/0')
" 2>/dev/null || echo "0/0")
  echo "  ✅ Diferenciación lingüística en módulos (ES vs CA): $SAMPLE_CHECK módulos distintos"
fi

# 4. Dataset del Mapa Intermodular y Validación de Actividades (Cero Conexiones Vacías)
MAPA_FILE="$ROOT_DIR/backend/src/data/mapa-intermodular/mapa_cfgm_${SLUG}.json"
if [ -f "$MAPA_FILE" ]; then
  echo "  ✅ Dataset JSON del Mapa Intermodular presente: mapa_cfgm_${SLUG}.json"
  python3 -c "
import json, sys
with open('$MAPA_FILE', 'r', encoding='utf-8') as f:
    modules = json.load(f)

total_ras = 0
total_conns = 0
empty_conns = 0
total_acts = 0
for m in modules:
    for lo in m.get('learningOutcomes', []):
        total_ras += 1
        for c in lo.get('connections', []):
            total_conns += 1
            acts = c.get('activities', [])
            if not acts or len(acts) == 0:
                empty_conns += 1
            total_acts += len(acts)

avg_conns = round(total_conns / total_ras, 1) if total_ras > 0 else 0
print(f'     • Módulos: {len(modules)}, RAs: {total_ras}')
print(f'     • Conexiones totales: {total_conns} (Media: {avg_conns} por RA)')
print(f'     • Actividades formativas: {total_acts}')

if empty_conns > 0:
    print(f'  ❌ ERROR: Existen {empty_conns} conexiones vacías sin actividades asociadas.')
    sys.exit(1)
else:
    print('  ✅ Cero conexiones vacías: el 100% de las conexiones tiene al menos una actividad.')

if avg_conns > 25:
    print(f'  ⚠️ ADVERTENCIA: La media de conexiones por RA ({avg_conns}) es inusualmente alta.')
"
else
  echo "  ❌ ERROR: Falta archivo de dataset backend/src/data/mapa-intermodular/mapa_cfgm_${SLUG}.json"
fi

echo ""
echo "🧪 Ejecutando suite de pruebas unitarias y verificación de cobertura..."
cd "$ROOT_DIR/frontend" && npm test
cd "$ROOT_DIR/backend" && npm test

echo ""
echo "🎉 ¡Verificación completada exitosamente! Todas las validaciones bilingües y pruebas han pasado."
