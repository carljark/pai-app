import mongoose from 'mongoose';
import { RA } from '../src/models/RA';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db').then(async () => {
  const sample = await RA.findOne({});
  console.log(sample);
  process.exit(0);
});
