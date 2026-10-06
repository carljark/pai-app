#!/usr/bin/env python3
"""
Helper script para generar el andamiaje (scaffold) de un nuevo ciclo de FP en Plappin.

Por defecto el ciclo se crea SIN mapa intermodular (el mapa es opcional y bajo demanda).
Uso:
  python3 scaffold_cfgm.py --slug cocina --name-es "Cocina y Gastronomía" --name-ca "Cuina i Gastronomia"
  python3 scaffold_cfgm.py --etapa cfgs --slug integracion_social --name-es "Integración Social" --name-ca "Integració Social"
  python3 scaffold_cfgm.py --slug cocina --name-es "..." --name-ca "..." --con-mapa
"""

import os
import glob
import re
import argparse

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
ETAPAS = {"cfgm": "CFGM", "cfgs": "CFGS"}


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


def generate_backend_data(etapa, slug, name_es, name_ca):
    out_path = os.path.join(ROOT_DIR, f"backend/src/data/ras_{etapa}_{slug}.data.ts")
    if os.path.exists(out_path):
        print(f"⚠️  El archivo ya existe: {out_path}")
        return out_path

    content = f"""/**
 * Catálogo curricular oficial de Resultados de Aprendizaje y Criterios de Evaluación
 * para {name_es} ({name_ca}).
 */
export const {etapa.upper()}_{slug.upper()}_RAS_DATA: any[] = [
  // Rellenar con los módulos y RAs correspondientes
];
"""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Creado: {out_path}")
    return out_path


def generate_migration(etapa, slug, name_es, tipo_nivel, next_num):
    filename = f"{next_num:02d}_ingest_{etapa}_{slug}_ras.ts"
    out_path = os.path.join(ROOT_DIR, "backend/src/migrations", filename)
    if os.path.exists(out_path):
        print(f"⚠️  La migración ya existe: {out_path}")
        return out_path

    const = f"{etapa.upper()}_{slug.upper()}_RAS_DATA"
    content = f"""import {{ RA }} from '../models/RA';
import {{ {const} }} from '../data/ras_{etapa}_{slug}.data';

export const up = async () => {{
  console.log('🔄 Sincronizando RAs de {name_es}...');

  await RA.deleteMany({{ tipoNivel: '{tipo_nivel}' }});

  const docs = {const}.map((ra: any) => ({{
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


def generate_mapa_seed(etapa, slug):
    out_path = os.path.join(ROOT_DIR, f"backend/src/data/mapa-intermodular/mapa_{etapa}_{slug}.json")
    if os.path.exists(out_path):
        print(f"⚠️  El archivo ya existe: {out_path}")
        return out_path

    content = "[\n  // Módulos con learningOutcomes y conexiones con actividades formativas (sin conexiones vacías)\n]\n"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Creado dataset JSON de mapa: {out_path}")
    return out_path


def main():
    parser = argparse.ArgumentParser(description="Scaffold para un nuevo ciclo de FP en Plappin")
    parser.add_argument("--slug", required=True, help="Identificador corto en minúsculas (ej: peluqueria, cocina, integracion_social)")
    parser.add_argument("--name-es", required=True, help="Nombre oficial en castellano")
    parser.add_argument("--name-ca", required=True, help="Nombre oficial en catalán")
    parser.add_argument("--etapa", choices=sorted(ETAPAS), default="cfgm", help="Grado medio (cfgm, por defecto) o superior (cfgs)")
    parser.add_argument("--con-mapa", action="store_true", help="Crea también el dataset del mapa intermodular (por defecto, NO)")

    args = parser.parse_args()
    slug = args.slug.lower().strip()
    name_es = args.name_es.strip()
    name_ca = args.name_ca.strip()
    etapa = args.etapa
    tipo_nivel = f"{ETAPAS[etapa]}_{slug.upper()}"
    next_mig = get_next_migration_number()

    print(f"🚀 Iniciando andamiaje para: {name_es} ({name_ca}) -> tipoNivel: {tipo_nivel}")
    generate_backend_data(etapa, slug, name_es, name_ca)
    generate_migration(etapa, slug, name_es, tipo_nivel, next_mig)
    if args.con_mapa:
        generate_mapa_seed(etapa, slug)

    print("\n📋 Siguientes pasos recomendados:")
    mapas = " y mapas" if args.con_mapa else " (sin 'mapas': el ciclo no tiene mapa intermodular)"
    print(f" 1. Añadir la entrada '{tipo_nivel}' a backend/src/data/niveles.ts (nombres ES/CA, cursos con sus módulos{mapas})")
    print(" 2. Rellenar los RA bilingües con un extractor determinista y validarlos contra la fuente oficial")
    print(" 3. Añadir el dataset a backend/src/tests/niveles-catalogo.test.ts")
    print(" 4. El frontend no se toca: todo sale del catálogo (GET /api/niveles)")
    print(" 5. Ejecutar npm test en backend y frontend")


if __name__ == "__main__":
    main()
