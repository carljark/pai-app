import mongoose from 'mongoose';
import { RA } from './src/models/RA';
import { CE } from './src/models/CE';
import { Project } from './src/models/Project';

mongoose.connect('mongodb://localhost:27018/pai_db')
  .then(async () => {
    const r = await RA.countDocuments();
    const c = await CE.countDocuments();
    const p = await Project.countDocuments();
    console.log(`RAs: ${r}, CEs: ${c}, Projects: ${p}`);
    process.exit(0);
  });
