import xlsx from 'xlsx';
import fs from 'fs';

const wb = xlsx.readFile('/Users/csgj/dev/pai-app/Proyecto_FPB_PAI/Datos curiculum FP/Curriculo_FPB_Estructurado.xlsx');
const modulos = xlsx.utils.sheet_to_json(wb.Sheets['Modulos_y_Ambitos']);
const ras = xlsx.utils.sheet_to_json(wb.Sheets['RA_y_Competencias']);

const result = ras.map((r: any) => {
    const mod = modulos.find((m: any) => m.ID_Modulo === r.ID_Modulo_Vinculado);
    return {
        id: r.ID_Item,
        module: mod ? mod.Nombre_Modulo : r.ID_Modulo_Vinculado,
        description: r.Texto_Oficial
    };
});

fs.writeFileSync('ras.json', JSON.stringify(result, null, 2));
console.log(`Saved ${result.length} RAs to ras.json`);
