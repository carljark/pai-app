import mongoose from 'mongoose';

const CESchema = new mongoose.Schema({
  area: String,
  subject: String,
  ce_id: String,
  description: String,
  criterios: Array
});
const CE = mongoose.model('CE', CESchema);

const translationMap: Record<string, string> = {
  "Biologia i Geologia": "Biología y Geología",
  "Economia i Emprenedoria": "Economía y Emprendimiento",
  "Física i Química": "Física y Química",
  "Geografia i Història": "Geografía e Historia",
  "Llengua Castellana i Literatura": "Lengua Castellana y Literatura",
  "Llengua Catalana i Literatura": "Lengua Catalana y Literatura",
  "Matemàtiques A": "Matemáticas",
  "Matemàtiques B": "Matemáticas",
  "Matemàtiques": "Matemáticas",
  "Tecnologia i Digitalització": "Tecnología y Digitalización"
};

async function fixLanguage() {
  await mongoose.connect('mongodb://localhost:27017/pai_db');
  console.log('MongoDB Conectado');

  const ces = await CE.find();

  for (let ce of ces) {
    if (translationMap[ce.subject]) {
      ce.subject = translationMap[ce.subject];
    }
    await ce.save();
  }
  
  console.log('✅ Nombres de asignaturas actualizados al castellano y matemáticas unificadas.');
  process.exit(0);
}

fixLanguage();
