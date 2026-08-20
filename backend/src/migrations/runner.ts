import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MigrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  executedAt: { type: Date, default: Date.now }
});
export const Migration = mongoose.model('Migration', MigrationSchema);

export async function runMigrations() {
  console.log('🔄 Iniciando motor de migraciones...');
  const migrationsDir = __dirname;
  
  // Leer todos los archivos .ts en el directorio actual (ignorando runner.ts)
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.ts') && f !== 'runner.ts')
    .sort();

  for (const file of files) {
    const migrationName = file.replace('.ts', '');
    
    // Comprobar si ya se ha ejecutado
    const exists = await Migration.findOne({ name: migrationName });
    if (!exists) {
      console.log(`Ejecutando migración: ${migrationName}`);
      try {
        const migration = await import(path.join(migrationsDir, file));
        if (migration.up) {
          await migration.up();
          await Migration.create({ name: migrationName });
          console.log(`✅ Migración ${migrationName} completada.`);
        } else {
          console.warn(`⚠️ Migración ${migrationName} no exporta una función 'up()'.`);
        }
      } catch (error) {
        console.error(`❌ Error en la migración ${migrationName}:`, error);
        process.exit(1); // Detener el arranque si falla una migración crítica
      }
    }
  }
  console.log('✨ Migraciones al día.');
}
