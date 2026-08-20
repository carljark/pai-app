import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const CESchema = new mongoose.Schema({
  area: String,
  subject: String,
  ce_id: String,
  description: String,
  description_es: String,
  description_ca: String,
  criterios: Array,
  criterios_es: Array,
  criterios_ca: Array
});
const CE = mongoose.model('CE', CESchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db');
  const rawData = fs.readFileSync(path.join(process.cwd(), 'backend', 'ces_eso.json'), 'utf-8');
  const ces = JSON.parse(rawData);

  for (let c of ces) {
      c.description_ca = c.description;
      c.criterios_ca = c.criterios;
  }

  await CE.deleteMany({});
  await CE.insertMany(ces);
  console.log('Restaurados 65 CEs perfectamente limpios (catalán temporal).');
  process.exit(0);
}
run();
