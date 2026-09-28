#!/usr/bin/env python3
"""
Helper script para generar el andamiaje (scaffold) de un nuevo CFGM en Plappin.
Uso:
  python3 scaffold_cfgm.py --slug cocina --name-es "Cocina y Gastronomía" --name-ca "Cuina i Gastronomia"
"""

import os
import sys
import glob
import re
import argparse

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))

def get_next_migration_number():
    migrations_dir = os.path.join(ROOT_DIR, "backend/src/migrations")
    files = glob.glob(os.path.join(migrations_dir, "[0-9][0-9]_*.ts"))
    numbers = []
    for f in files:
        basename = os.path.basename(f)
        match = re.match(r"^(\d+)_", basename)
        if match:
            numbers.append(int(match.group(1)))
    return max(numbers) + 1 if numbers else 1

def generate_backend_data(slug, name_es, name_ca, tipo_nivel):
    out_path = os.path.join(ROOT_DIR, f"backend/src/data/ras_cfgm_{slug}.data.ts")
    if os.path.exists(out_path):
        print(f"⚠️  El archivo ya existe: {out_path}")
        return out_path
    
    content = f"""/**
 * Catálogo curricular oficial de Resultados de Aprendizaje y Criterios de Evaluación
 * para {name_es} ({name_ca}).
 */
export const CFGM_{slug.upper()}_RAS_DATA: any[] = [
  // Rellenar con los módulos y RAs correspondientes
];
"""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Creado: {out_path}")
    return out_path

def generate_frontend_data(slug, name_es, name_ca, tipo_nivel):
    out_path = os.path.join(ROOT_DIR, f"frontend/src/app/features/curriculum/data/ras_cfgm_{slug}.data.ts")
    if os.path.exists(out_path):
        print(f"⚠️  El archivo ya existe: {out_path}")
        return out_path
    
    content = f"""import {{ CfgmRaData }} from './ras_cfgm_estetica.data';

/**
 * Catálogo curricular oficial de {name_es} / {name_ca}.
 */
export const CFGM_{slug.upper()}_RAS_DATA: CfgmRaData[] = [
  // Rellenar con los módulos y RAs correspondientes
];
"""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Creado: {out_path}")
    return out_path

def generate_migration(slug, name_es, tipo_nivel, next_num):
    filename = f"{next_num:02d}_ingest_cfgm_{slug}_ras.ts"
    out_path = os.path.join(ROOT_DIR, "backend/src/migrations", filename)
    if os.path.exists(out_path):
        print(f"⚠️  La migración ya existe: {out_path}")
        return out_path
    
    content = f"""import {{ RA }} from '../models/RA';
import {{ CFGM_{slug.upper()}_RAS_DATA }} from '../data/ras_cfgm_{slug}.data';

export const up = async () => {{
  console.log('🔄 Sincronizando RAs de {name_es}...');
  
  await RA.deleteMany({{ tipoNivel: '{tipo_nivel}' }});
  
  const docs = CFGM_{slug.upper()}_RAS_DATA.map((ra: any) => ({{
    id: ra.id,
    module: ra.module,
    module_es: ra.module_es,
    module_ca: ra.module_ca,
    moduleCode: ra.moduleCode,
    tipoNivel: ra.tipoNivel,
    description: ra.description_ca || ra.description,
    description_ca: ra.description_ca,
    description_es: ra.description_es,
    criterios_es: ra.criterios_es,
    criterios_ca: ra.criterios_ca
  }}));

  await RA.insertMany(docs);
  console.log(`✅ Insertados ${{docs.length}} RAs para {tipo_nivel}.`);
}};
"""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Creada migración: {out_path}")
    return out_path

def generate_mapa_seed(slug, name_es, name_ca, tipo_nivel):
    out_path = os.path.join(ROOT_DIR, f"frontend/src/app/features/mapa-intermodular/data/mapa-intermodular-cfgm-{slug}.seed.ts")
    if os.path.exists(out_path):
        print(f"⚠️  El archivo ya existe: {out_path}")
        return out_path
    
    content = f"""import {{ FPBModule }} from '../models/mapa-intermodular.model';

/**
 * Semilla del Mapa Intermodular para {name_es} ({name_ca}).
 */
export const CFGM_{slug.upper()}_MODULES_SEED: FPBModule[] = [
  // Definir módulos de 1.er curso, RAs, criterios y conexiones
];
"""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Creado seed mapa: {out_path}")
    return out_path

def main():
    parser = argparse.ArgumentParser(description="Scaffold para nuevo CFGM en Plappin")
    parser.add_argument("--slug", required=True, help="Identificador corto en minúsculas (ej: peluqueria, cocina, automocion)")
    parser.add_argument("--name-es", required=True, help="Nombre oficial en castellano")
    parser.add_argument("--name-ca", required=True, help="Nombre oficial en catalán")
    
    args = parser.parse_args()
    slug = args.slug.lower().strip()
    name_es = args.name_es.strip()
    name_ca = args.name_ca.strip()
    tipo_nivel = f"CFGM_{slug.upper()}"
    next_mig = get_next_migration_number()

    print(f"🚀 Iniciando andamiaje para: {name_es} ({name_ca}) -> tipoNivel: {tipo_nivel}")
    generate_backend_data(slug, name_es, name_ca, tipo_nivel)
    generate_frontend_data(slug, name_es, name_ca, tipo_nivel)
    generate_migration(slug, name_es, tipo_nivel, next_mig)
    generate_mapa_seed(slug, name_es, name_ca, tipo_nivel)

    print("\n📋 Siguientes pasos recomendados:")
    print(f" 1. Añadir '{tipo_nivel}' al enum de backend/src/models/Project.ts")
    print(f" 2. Añadir la descripción del curso en backend/src/controllers/project.controller.ts")
    print(f" 3. Añadir '{tipo_nivel}' y el array de orden en frontend/src/app/features/curriculum/services/curriculum.facade.ts")
    print(f" 4. Añadir las traducciones en translations.es.ts y translations.ca.ts")
    print(f" 5. Añadir el botón tab en generator-view.component.html y mapa-intermodular-view.component.html")
    print(f" 6. Actualizar las pruebas unitarias y verificar cobertura con npm test")

if __name__ == "__main__":
    main()
