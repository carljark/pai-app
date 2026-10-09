/**
 * Imprime en JSON las solicitudes de centros abiertas y los ciclos que faltan por incorporar.
 * Solo lectura. En producción lo lanza `scripts/solicitudes-pendientes.sh` dentro del contenedor.
 */
import mongoose from 'mongoose';
import { resumenPendientes } from '../src/services/solicitudes.service';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27018/pai_db';

try {
  await mongoose.connect(uri);
  console.log(JSON.stringify(await resumenPendientes(), null, 2));
} finally {
  await mongoose.disconnect();
}
