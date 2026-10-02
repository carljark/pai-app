import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { runMigrations } from '../src/migrations/runner';

dotenv.config();

/**
 * Ejecución manual de migraciones (`npm run migrate`). Usa el mismo runner que el arranque
 * del servidor, que procesa `src/migrations/legacy/` y después `src/migrations/`.
 */
async function main(): Promise<void> {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db');
  console.log('Conectado a MongoDB. Comprobando migraciones...');
  await runMigrations();
  await mongoose.disconnect();
  process.exit(0);
}

main();
