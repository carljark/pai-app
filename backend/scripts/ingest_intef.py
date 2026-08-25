import os
import zipfile
import json
import xml.etree.ElementTree as ET
import re

directory = 'Ejemplos proyectos FP y ESO'
output_file = 'backend/src/data/intef_examples.json'

examples = []

def clean_html(raw_html):
    if not raw_html: return ""
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', raw_html)
    return re.sub(r'\s+', ' ', cleantext).strip()

if not os.path.exists(directory):
    print(f"Directory {directory} not found")
    exit(1)

for filename in os.listdir(directory):
    if filename.endswith(".zip"):
        filepath = os.path.join(directory, filename)
        print(f"Procesando {filename}...")
        try:
            with zipfile.ZipFile(filepath, 'r') as zip_ref:
                # Tratar de leer contentv3.xml
                if 'contentv3.xml' in zip_ref.namelist():
                    xml_data = zip_ref.read('contentv3.xml')
                    root = ET.fromstring(xml_data)
                    
                    title = "Proyecto INTEF"
                    description = ""
                    
                    # Buscar titulo y descripcion en la estructura eXe
                    for string_elem in root.findall('.//string[@value="_title"]'):
                        # el siguiente unicode suele ser el valor
                        # es un poco feo recorrer así, vamos a usar xpath o buscar
                        pass
                    
                    # Para simplificar, buscaremos con regex en el xml crudo
                    xml_str = xml_data.decode('utf-8', errors='ignore')
                    
                    title_match = re.search(r'<string role="key" value="_title"></string>\s*<unicode value="([^"]+)"></unicode>', xml_str)
                    if title_match:
                        title = title_match.group(1)
                        
                    desc_match = re.search(r'<string role="key" value="_description"></string>\s*<unicode value="([^"]+)"></unicode>', xml_str)
                    if desc_match:
                        description = clean_html(desc_match.group(1))
                    
                    # Extraer todo el texto de los nodos freeText o instuctions
                    content_texts = []
                    for unicode_elem in re.findall(r'<unicode value="([^"]+)"></unicode>', xml_str):
                        if len(unicode_elem) > 100: # Solo textos largos
                            content_texts.append(clean_html(unicode_elem))
                            
                    full_content = " ".join(content_texts)[:1500] # Limitar a 1500 chars para no saturar tokens
                    
                    if not description:
                        description = full_content[:300]
                        
                    examples.append({
                        "title": title,
                        "description": description,
                        "content_sample": full_content
                    })
                else:
                    print(f"Saltando {filename}, no tiene contentv3.xml")
        except Exception as e:
            print(f"Error procesando {filename}: {e}")

os.makedirs(os.path.dirname(output_file), exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(examples, f, ensure_ascii=False, indent=2)

print(f"✅ Se han procesado y guardado {len(examples)} ejemplos en {output_file}")
