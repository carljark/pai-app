import mongoose from 'mongoose';

export async function up() {
  const db = mongoose.connection.db;
  if (!db) {
      throw new Error('No database connection');
  }
  
  const collection = db.collection('projects');
  
  const query = { status: { $in: ['en_cola', 'generando'] } };
  const staleProjectsCount = await collection.countDocuments(query);
  
  console.log(`Se han encontrado ${staleProjectsCount} proyectos atascados en cola o generando.`);

  if (staleProjectsCount > 0) {
    const result = await collection.updateMany(
      query,
      { 
        $set: { 
          status: 'error', 
          errorDetail: 'Cancelado automáticamente por limpieza de base de datos (trabajo huérfano/stale).' 
        } 
      }
    );
    console.log(`Se han marcado ${result.modifiedCount} proyectos como 'error'.`);
  } else {
    console.log('No es necesario limpiar nada.');
  }
}
