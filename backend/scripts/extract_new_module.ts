import mammoth from 'mammoth';
import path from 'path';

const file = path.resolve(process.cwd(), 'updates/Currículo básico del módulo de Proyecto intermodular de aprendizaje colaborativo para grado básico.docx');

mammoth.extractRawText({path: file})
    .then(function(result) {
        console.log(result.value);
    })
    .catch(function(err) {
        console.error(err);
    });
