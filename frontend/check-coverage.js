const fs = require('fs');

const summaryPath = './coverage/frontend/coverage-summary.json';
if (!fs.existsSync(summaryPath)) {
  console.error('Coverage summary not found!');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const total = summary.total;

const threshold = 90;
let failed = false;

['lines', 'statements', 'functions', 'branches'].forEach(key => {
  if (total[key].pct < threshold) {
    console.error(`ERROR: Coverage for ${key} (${total[key].pct}%) is below the threshold of ${threshold}%`);
    failed = true;
  }
});

if (failed) {
  console.error('Coverage check failed.');
  process.exit(1);
}

console.log('All coverage thresholds met.');
process.exit(0);
