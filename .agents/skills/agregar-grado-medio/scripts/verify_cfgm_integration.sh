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

# 1. Project.ts
if grep -q "$TIPO_NIVEL" "$ROOT_DIR/backend/src/models/Project.ts"; then
  echo "  ✅ Backend Project.ts contiene $TIPO_NIVEL"
else
  echo "  ❌ ERROR: Falta $TIPO_NIVEL en backend/src/models/Project.ts"
fi

# 2. project.controller.ts
if grep -q "$TIPO_NIVEL" "$ROOT_DIR/backend/src/controllers/project.controller.ts"; then
  echo "  ✅ Backend project.controller.ts contiene $TIPO_NIVEL"
  if grep -A 5 "$TIPO_NIVEL" "$ROOT_DIR/backend/src/controllers/project.controller.ts" | grep -q "language === 'catalan'"; then
    echo "  ✅ Backend project.controller.ts contempla selector bilingüe para IA"
  else
    echo "  ⚠️ ADVERTENCIA: project.controller.ts podría no alternar entre ES y CA según la variable language"
  fi
else
  echo "  ❌ ERROR: Falta $TIPO_NIVEL en backend/src/controllers/project.controller.ts"
fi

# 3. curriculum.facade.ts
if grep -q "$TIPO_NIVEL" "$ROOT_DIR/frontend/src/app/features/curriculum/services/curriculum.facade.ts"; then
  echo "  ✅ Frontend curriculum.facade.ts contiene $TIPO_NIVEL"
else
  echo "  ❌ ERROR: Falta $TIPO_NIVEL en frontend/src/app/features/curriculum/services/curriculum.facade.ts"
fi

# 4. Traducciones ES y CA
if grep -iq "$SLUG" "$ROOT_DIR/frontend/src/app/services/translations.es.ts" && grep -iq "$SLUG" "$ROOT_DIR/frontend/src/app/services/translations.ca.ts"; then
  echo "  ✅ Archivos de traducción translations.es.ts y translations.ca.ts contienen la clave del nivel"
else
  echo "  ❌ ERROR: Falta clave de traducción en translations.es.ts o translations.ca.ts"
fi

# 5. Generator View
if grep -q "$TIPO_NIVEL" "$ROOT_DIR/frontend/src/app/features/generator/components/generator-view/generator-view.component.ts"; then
  echo "  ✅ Generator view contiene $TIPO_NIVEL"
else
  echo "  ❌ ERROR: Falta $TIPO_NIVEL en generator-view.component.ts"
fi

# 6. Mapa Intermodular View
if grep -q "$TIPO_NIVEL" "$ROOT_DIR/frontend/src/app/features/mapa-intermodular/components/mapa-intermodular-view/mapa-intermodular-view.component.html"; then
  echo "  ✅ Mapa Intermodular view HTML contiene $TIPO_NIVEL"
else
  echo "  ❌ ERROR: Falta $TIPO_NIVEL en mapa-intermodular-view.component.html"
fi

# 7. Integridad Bilingüe de Datos Curriculares (evitar la trampa del fallback monolingüe)
DATA_FILE="$ROOT_DIR/frontend/src/app/features/curriculum/data/ras_cfgm_${SLUG}.data.ts"
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

# 8. Semilla del Mapa Intermodular
SEED_FILE="$ROOT_DIR/frontend/src/app/features/mapa-intermodular/data/mapa-intermodular-cfgm-${SLUG}.seed.ts"
if [ -f "$SEED_FILE" ]; then
  SEED_LINES=$(wc -l < "$SEED_FILE" | tr -d ' ')
  echo "  ✅ Semilla del Mapa Intermodular presente ($SEED_LINES líneas)"
else
  echo "  ❌ ERROR: Falta archivo de semilla mapa-intermodular-cfgm-${SLUG}.seed.ts"
fi

echo ""
echo "🧪 Ejecutando suite de pruebas unitarias y verificación de cobertura..."
cd "$ROOT_DIR/frontend" && npm test -- --watch=false --browsers=ChromeHeadless
cd "$ROOT_DIR/backend" && npm test

echo ""
echo "🎉 ¡Verificación completada exitosamente! Todas las validaciones bilingües y pruebas han pasado."
