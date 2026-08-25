import xlsx from 'xlsx';
import path from 'path';

const filePath = path.resolve(process.cwd(), '../correcciones/FULL AUTOAVALUACIÓ RA_CE_GB .xlsx');
const workbook = xlsx.readFile(filePath);

const sheet = workbook.Sheets['RA-mòdul'];
const json = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

let currentModule = '';
const extractedRAs: any[] = [];

for (let i = 4; i < json.length; i++) { // Las primeras 4 filas son cabeceras
  const row = json[i];
  if (!row || row.length === 0) continue;
  
  if (row[0] && typeof row[0] === 'string' && row[0].trim() !== '') {
    currentModule = row[0].trim();
  }

  const raNumberRaw = row[1];
  const description = row[2];

  if (currentModule && raNumberRaw && description) {
    const numMatch = String(raNumberRaw).match(/\d+/);
    if (numMatch) {
      extractedRAs.push({
        module: currentModule,
        id: `RA${numMatch[0]}`,
        description: description.trim()
      });
    }
  }
}

console.log(JSON.stringify(extractedRAs, null, 2));
