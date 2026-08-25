import mammoth from 'mammoth';
import path from 'path';

const file = path.resolve(process.cwd(), '../correcciones/Mejoras plappin.docx');

mammoth.extractRawText({path: file})
    .then(function(result) {
        console.log(result.value);
    })
    .catch(function(err) {
        console.error(err);
    });
