import mongoose from 'mongoose';

export async function up() {
  const db = mongoose.connection.db;
  if (!db) {
      throw new Error('No database connection');
  }
  
  const collection = db.collection('projects');
  
  // 1. Proyectos sin 'status' pero que SÍ llegaron a generar contenido
  // Pasan a estado 'borrador' (completado) para que el frontend no los asuma como 'en_cola'
  const resultWithContent = await collection.updateMany(
    { status: { $exists: false }, 'generatedContent': { $exists: true } },
    { $set: { status: 'borrador' } }
  );
  
  // 2. Proyectos sin 'status' y que NO tienen contenido generado
  // Pasan a 'error' ya que claramente la generación falló en su día
  const resultWithoutContent = await collection.updateMany(
    { status: { $exists: false } },
    { $set: { status: 'error', errorDetail: 'Proyecto legacy sin estado ni contenido generado.' } }
  );

  console.log(`[02_fix_missing_status_projects] ${resultWithContent.modifiedCount} proyectos legacy sin estado reparados a 'borrador'.`);
  console.log(`[02_fix_missing_status_projects] ${resultWithoutContent.modifiedCount} proyectos legacy vacíos reparados a 'error'.`);
}
