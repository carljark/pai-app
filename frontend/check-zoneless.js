#!/usr/bin/env node
/**
 * Guardián "zoneless": falla si zone.js reaparece en el frontend.
 *
 * El frontend usa change detection zoneless (Angular 22 por defecto, declarado
 * explícitamente con provideZonelessChangeDetection()). Este script evita
 * regresiones comprobando:
 *   1. Que zone.js no esté en package.json (dependencies/devDependencies/peerDependencies).
 *   2. Que no haya imports de 'zone.js' / 'zone.js/testing' en el código fuente.
 *   3. Que, si existe un build en dist/, el bundle no contenga firmas de zone.js.
 */

const fs = require('fs');
const path = require('path');

const root = __dirname;
let failed = false;

function fail(message) {
  console.error('ERROR: ' + message);
  failed = true;
}

// 1) package.json
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
  if (pkg[section] && pkg[section]['zone.js']) {
    fail(`zone.js encontrado en package.json > ${section}. El frontend es zoneless.`);
  }
}

// 2) Código fuente y setup de tests
const filesToScan = ['test-setup.ts', 'src/main.ts'].map((f) => path.join(root, f));

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile() && full.endsWith('.ts')) {
      filesToScan.push(full);
    }
  }
}
walk(path.join(root, 'src'));

const zoneImport = /(?:import\s+['"]zone\.js(?:\/testing)?['"]|from\s+['"]zone\.js)/;
for (const file of filesToScan) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  if (zoneImport.test(content)) {
    fail(`import de zone.js encontrado en ${path.relative(root, file)}`);
  }
}

// 3) Bundle (si existe)
const distDir = path.join(root, 'dist/frontend/browser');
if (fs.existsSync(distDir)) {
  const signatures = ['__zone_symbol__', 'ZoneTask', 'ZoneAwarePromise'];
  for (const file of fs.readdirSync(distDir)) {
    if (!file.endsWith('.js')) continue;
    const content = fs.readFileSync(path.join(distDir, file), 'utf8');
    for (const sig of signatures) {
      if (content.includes(sig)) {
        fail(`firma de zone.js "${sig}" encontrada en dist/frontend/browser/${file}`);
      }
    }
  }
}

if (failed) {
  console.error('Zoneless check failed.');
  process.exit(1);
}
console.log('Zoneless check passed (sin dependencia ni imports de zone.js).');
process.exit(0);
