const fs = require('fs');

// Load sample activities from 3060, 3005, 3042, 3011, 3159
const seed = fs.readFileSync("frontend/src/app/features/mapa-intermodular/data/mapa-intermodular.seed.ts", "utf8");
const startIdx = seed.indexOf("= [") + 2;
const endIdx = seed.lastIndexOf("]");
const modules = JSON.parse(seed.substring(startIdx, endIdx + 1));

const sampleActs = [];
modules.forEach(m => {
  m.learningOutcomes.slice(0, 2).forEach(ra => {
    ra.connections.slice(0, 2).forEach(c => {
      if (c.activities[0]) sampleActs.push(c.activities[0]);
    });
  });
});

console.log(`Collected ${sampleActs.length} sample activities from all modules`);
