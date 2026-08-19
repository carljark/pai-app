import pandas as pd
import json

df = pd.read_excel('/Users/csgj/dev/pai-app/Proyecto_FPB_PAI/Datos curiculum FP/Curriculo_FPB_Estructurado.xlsx', sheet_name=None)
ra_df = df.get('RA_y_Competencias')
if ra_df is not None:
    atc = ra_df[ra_df['ID_Modulo_Vinculado'] == 'MOD_ATC']
    print(atc[['ID_Item', 'Texto_Oficial']])
else:
    print("Sheet 'RA_y_Competencias' not found")
