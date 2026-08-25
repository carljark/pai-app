import xlsx from 'xlsx';
import path from 'path';

const filePath = path.resolve(process.cwd(), '../correcciones/FULL AUTOAVALUACIÓ RA_CE_GB .xlsx');
const workbook = xlsx.readFile(filePath);

console.log("Hojas en el Excel:");
workbook.SheetNames.forEach(sheetName => {
  console.log(`- ${sheetName}`);
  const sheet = workbook.Sheets[sheetName];
  const json = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(json.slice(0, 15)); // Imprimir las primeras 15 filas
});
