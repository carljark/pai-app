import mongoose from 'mongoose';

const RASchema = new mongoose.Schema({}, { strict: false });
const RA = mongoose.model('RA', RASchema, 'ras');

async function check() {
  await mongoose.connect('mongodb://localhost:27017/pai_db');
  const all = await RA.find();
  console.log(JSON.stringify(all[0], null, 2));
  process.exit(0);
}
check();
