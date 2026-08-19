import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const CESchema = new mongoose.Schema({
  area: String,
  subject: String,
  ce_id: String,
  description: String,
  criterios: Array
});
const CE = mongoose.model('CE', CESchema);

async function seedCEs() {
  await mongoose.connect('mongodb://localhost:27017/pai_db');
  console.log('MongoDB Conectado');

  const rawData = fs.readFileSync(path.join(process.cwd(), 'ces_eso.json'), 'utf-8');
  const ces = JSON.parse(rawData);

  await CE.deleteMany({});
  await CE.insertMany(ces);
  
  console.log(`✅ Sembradas ${ces.length} Competencias Específicas en la BD.`);
  process.exit(0);
}

seedCEs();
