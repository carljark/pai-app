import mongoose from 'mongoose';

const CESchema = new mongoose.Schema({ subject: String, description_es: String }, { strict: false });
const CE = mongoose.model('CE', CESchema, 'ces');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/pai_db');
  const all = await CE.find();
  const missing = all.filter((ce: any) => !ce.description_es && ce.subject !== 'Matemáticas');
  console.log(`Total: ${all.length}`);
  console.log(`Missing ES: ${missing.length}`);
  
  const subjectsMissing = [...new Set(missing.map((m: any) => m.subject))];
  console.log('Subjects missing ES:', subjectsMissing);
  
  process.exit(0);
}
check();
