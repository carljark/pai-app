import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Migration } from '../src/models/Migration';

dotenv.config();

const migrationsDir = path.join(process.cwd(), 'migrations');

async function runMigrations() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db');
  console.log('Conectado a MongoDB. Comprobando migraciones...');

  if (!fs.existsSync(migrationsDir)) {
    console.log('No existe la carpeta de migraciones.');
    process.exit(0);
  }

  // Obtener lista de archivos de migración y ordenarlos (001_..., 002_...)
  const files = fs.readdirSync(migrationsDir)
                  .filter(f => f.endsWith('.ts') || f.endsWith('.js'))
                  .sort();

  for (const file of files) {
    const migrationName = file;

    // Comprobar si ya se ejecutó
    const alreadyRun = await Migration.findOne({ name: migrationName });
    if (alreadyRun) {
      console.log(`[SKIP] Migración ${migrationName} ya fue ejecutada.`);
      continue;
    }

    console.log(`[START] Ejecutando migración: ${migrationName}...`);
    try {
      // Importar dinámicamente el script de migración
      const migrationModule = await import(path.join(migrationsDir, file));
      
      // Ejecutar la función up() de la migración
      if (migrationModule.up) {
        await migrationModule.up();
      } else {
        console.warn(`La migración ${migrationName} no tiene una función up() exportada.`);
      }

      // Registrar como completada
      await new Migration({ name: migrationName }).save();
      console.log(`[DONE] Migración ${migrationName} completada exitosamente.`);

    } catch (error) {
      console.error(`[ERROR] Fallo al ejecutar la migración ${migrationName}:`, error);
      process.exit(1); // Detener el proceso si una falla
    }
  }

  console.log('Todas las migraciones han finalizado correctamente.');
  process.exit(0);
}

runMigrations();
