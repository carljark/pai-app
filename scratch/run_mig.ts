import mongoose from 'mongoose';
import { up } from './backend/src/migrations/04_ingest_cfgm_estetica_ras';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pai');
  await up();
  mongoose.disconnect();
}
run();
