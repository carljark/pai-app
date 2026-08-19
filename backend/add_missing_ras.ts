import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

const RASchema = new mongoose.Schema({ id: String, module: String, description: String, description_es: String, description_ca: String }, { strict: false });
const RA = mongoose.model('RA', RASchema, 'ras');

async function fix() {
  await mongoose.connect('mongodb://localhost:27017/pai_db');
  
  const ra3 = {
    id: 'RA_ATC_3',
    module: 'Atención al cliente',
    description: '3. Informa al probable cliente del servicio realizado, justificando las operaciones ejecutadas.',
    description_es: '3. Informa al probable cliente del servicio realizado, justificando las operaciones ejecutadas.',
    description_ca: '3. Informa al probable client del servei realitzat, justificant les operacions executades.'
  };

  const ra4 = {
    id: 'RA_ATC_4',
    module: 'Atención al cliente',
    description: '4. Atiende reclamaciones de posibles clientes, reconociendo el protocolo de actuación.',
    description_es: '4. Atiende reclamaciones de posibles clientes, reconociendo el protocolo de actuación.',
    description_ca: '4. Atén reclamacions de possibles clients, reconeixent el protocol d\'actuació.'
  };

  await RA.updateOne({ id: 'RA_ATC_3' }, { $set: ra3 }, { upsert: true });
  await RA.updateOne({ id: 'RA_ATC_4' }, { $set: ra4 }, { upsert: true });
  
  // Update server.ts seed so it's not lost
  console.log('Inserted missing RAs into DB.');
  process.exit(0);
}
fix();
