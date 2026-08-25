import mongoose from 'mongoose';
import { runMigrations } from './src/migrations/runner';

mongoose.connect('mongodb://localhost:27018/pai_db')
  .then(async () => {
    await runMigrations();
    process.exit(0);
  });
