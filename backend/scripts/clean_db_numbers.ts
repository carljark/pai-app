import mongoose from 'mongoose';

const RASchema = new mongoose.Schema({ id: String, module: String, description: String, description_es: String, description_ca: String }, { strict: false });
const RA = mongoose.model('RA', RASchema, 'ras');

const CESchema = new mongoose.Schema({ area: String, subject: String, ce_id: String, description: String, description_es: String, description_ca: String, criterios: Array, criterios_es: Array, criterios_ca: Array }, { strict: false });
const CE = mongoose.model('CE', CESchema, 'ces');

function stripNum(text: string | undefined): string | undefined {
  if (!text) return text;
  return text.replace(/^\d+\.\s*/, '');
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db');
  
  const ras = await RA.find();
  let raCount = 0;
  for (let r of ras) {
    let changed = false;
    if (r.description && /^\d+\.\s*/.test(r.description)) { r.description = stripNum(r.description); changed = true; }
    if (r.description_es && /^\d+\.\s*/.test(r.description_es)) { r.description_es = stripNum(r.description_es); changed = true; }
    if (r.description_ca && /^\d+\.\s*/.test(r.description_ca)) { r.description_ca = stripNum(r.description_ca); changed = true; }
    if (changed) { await r.save(); raCount++; }
  }
  console.log(`Limpiados números en ${raCount} RAs`);

  const ces = await CE.find();
  let ceCount = 0;
  for (let c of ces) {
    let changed = false;
    if (c.description && /^\d+\.\s*/.test(c.description)) { c.description = stripNum(c.description); changed = true; }
    if (c.description_es && /^\d+\.\s*/.test(c.description_es)) { c.description_es = stripNum(c.description_es); changed = true; }
    if (c.description_ca && /^\d+\.\s*/.test(c.description_ca)) { c.description_ca = stripNum(c.description_ca); changed = true; }
    if (changed) { await c.save(); ceCount++; }
  }
  console.log(`Limpiados números en ${ceCount} CEs`);

  process.exit(0);
}
run();
