import mongoose from 'mongoose';
import { RA } from './backend/src/models/RA';
import { CE } from './backend/src/models/CE';

mongoose.connect('mongodb://localhost:27018/pai_db')
  .then(async () => {
    const r = await RA.countDocuments();
    const c = await CE.countDocuments();
    console.log(`RAs: ${r}, CEs: ${c}`);
    process.exit(0);
  });
