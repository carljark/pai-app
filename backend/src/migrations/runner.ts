import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Migration } from '../models/Migration';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Carpeta de migraciones y cómo se registra cada archivo en la colección `migrations`.
 * Las legacy (antes en `backend/migrations` con `scripts/migrate.ts`) se registraban con
 * la extensión `.ts`; se conserva para que ninguna migración ya aplicada se reejecute.
 */
interface MigrationSource {
  dir: string;
  recordName: (file: string) => string;
}

const SOURCES: MigrationSource[] = [
  { dir: path.join(__dirname, 'legacy'), recordName: (file) => file },
  { dir: __dirname, recordName: (file) => file.replace('.ts', '') },
];

function listMigrationFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.ts') && f !== 'runner.ts')
    .sort();
}

async function runMigrationFile(dir: string, file: string, name: string): Promise<void> {
  console.log(`Ejecutando migración: ${name}`);
  try {
    const migration = await import(path.join(dir, file));
    if (migration.up) {
      await migration.up();
      await Migration.create({ name });
      console.log(`✅ Migración ${name} completada.`);
    } else {
      console.warn(`⚠️ Migración ${name} no exporta una función 'up()'.`);
    }
  } catch (error) {
    console.error(`❌ Error en la migración ${name}:`, error);
    process.exit(1); // Detener el arranque si falla una migración crítica
  }
}

/** Ejecuta en orden las migraciones pendientes: primero las legacy y después las actuales. */
export async function runMigrations(): Promise<void> {
  console.log('🔄 Iniciando motor de migraciones...');
  for (const source of SOURCES) {
    for (const file of listMigrationFiles(source.dir)) {
      const name = source.recordName(file);
      if (await Migration.exists({ name })) continue;
      await runMigrationFile(source.dir, file, name);
    }
  }
  console.log('✨ Migraciones al día.');
}
