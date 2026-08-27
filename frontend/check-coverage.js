const fs = require('fs');

const summaryPath = './coverage/frontend/coverage-summary.json';
if (!fs.existsSync(summaryPath)) {
  console.error('Coverage summary not found!');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const total = summary.total;

const thresholds = {
  lines: 90,
  statements: 90,
  functions: 90,
  branches: 90
};

let failed = false;

Object.keys(thresholds).forEach(key => {
  if (total[key].pct < thresholds[key]) {
    console.error(`ERROR: Coverage for ${key} (${total[key].pct}%) is below the threshold of ${thresholds[key]}%`);
    failed = true;
  }
});

if (failed) {
  console.error('Coverage check failed.');
  process.exit(1);
}

console.log('All coverage thresholds met.');
process.exit(0);
