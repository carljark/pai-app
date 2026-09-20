import { FPBModule } from '../models/mapa-intermodular.model';

export const CFGM_MODULES_SEED: FPBModule[] = [
  {
    "code": "0633",
    "name_es": "Técnicas de higiene facial y corporal",
    "name_ca": "Tècniques d’higiene facial i corporal",
    "type": "especifico",
    "color": "#f87171",
    "icon": "book",
    "learningOutcomes": [
      {
        "id": "0633_RA1",
        "code": "RA1",
        "text_es": "Resultado de aprendizaje 1",
        "text_ca": "Resultat d'aprenentatge 1",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Diagnòstic cutani i fitxa d’anàlisi",
            "title_ca": "Diagnòstic cutani i fitxa d’anàlisi",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "El diagnòstic d’higiene facial i corporal necessita entrevista, observació, registre tècnic i, cada vegada més, eines digitals per conservar i compartir dades de manera professional.",
            "justification_ca": "El diagnòstic d’higiene facial i corporal necessita entrevista, observació, registre tècnic i, cada vegada més, eines digitals per conservar i compartir dades de manera professional.",
            "activities": [
              {
                "id": "act_0633_C1_1",
                "title_es": "Fitxa express de pell",
                "title_ca": "Fitxa express de pell",
                "description_es": "Crear una fitxa d’anàlisi de pell clara i fàcil d’utilitzar.",
                "description_ca": "Crear una fitxa d’anàlisi de pell clara i fàcil d’utilitzar.",
                "evidence_es": "Fitxa tècnica inicial.",
                "evidence_ca": "Fitxa tècnica inicial.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C1_2",
                "title_es": "Entrevista en parelles",
                "title_ca": "Entrevista en parelles",
                "description_es": "Practicar una entrevista inicial abans d’un servei d’higiene.",
                "description_ca": "Practicar una entrevista inicial abans d’un servei d’higiene.",
                "evidence_es": "Qüestionari completat.",
                "evidence_ca": "Qüestionari completat.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C1_3",
                "title_es": "Detectius de la pell",
                "title_ca": "Detectius de la pell",
                "description_es": "Interpretar dades d’un cas i deduir la tipologia cutània.",
                "description_ca": "Interpretar dades d’un cas i deduir la tipologia cutània.",
                "evidence_es": "Informe breu de diagnòstic.",
                "evidence_ca": "Informe breu de diagnòstic.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C1_4",
                "title_es": "Mapa de necessitats",
                "title_ca": "Mapa de necessitats",
                "description_es": "Relacionar hàbits, pell i necessitats d’higiene.",
                "description_ca": "Relacionar hàbits, pell i necessitats d’higiene.",
                "evidence_es": "Mapa visual de necessitats.",
                "evidence_ca": "Mapa visual de necessitats.",
                "diversitySupport_es": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net.",
                "diversitySupport_ca": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net."
              },
              {
                "id": "act_0633_C1_5",
                "title_es": "Fitxa digital",
                "title_ca": "Fitxa digital",
                "description_es": "Traslladar la fitxa d’anàlisi a un format digital compartit.",
                "description_ca": "Traslladar la fitxa d’anàlisi a un format digital compartit.",
                "evidence_es": "Plantilla digital.",
                "evidence_ca": "Plantilla digital.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C1_6",
                "title_es": "Client/a sorpresa",
                "title_ca": "Client/a sorpresa",
                "description_es": "Fer preguntes adequades a partir d’una demanda poc clara.",
                "description_ca": "Fer preguntes adequades a partir d’una demanda poc clara.",
                "evidence_es": "Registre de dades complet.",
                "evidence_ca": "Registre de dades complet.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C1_7",
                "title_es": "Dades importants",
                "title_ca": "Dades importants",
                "description_es": "Triar quines dades són imprescindibles i quines no cal demanar.",
                "description_ca": "Triar quines dades són imprescindibles i quines no cal demanar.",
                "evidence_es": "Llista de dades clau.",
                "evidence_ca": "Llista de dades clau.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C1_8",
                "title_es": "Abans del tractament",
                "title_ca": "Abans del tractament",
                "description_es": "Explicar què s’ha d’analitzar abans de tocar la pell.",
                "description_ca": "Explicar què s’ha d’analitzar abans de tocar la pell.",
                "evidence_es": "Guió de 60 segons.",
                "evidence_ca": "Guió de 60 segons.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0633_C1_9",
                "title_es": "Revisió creuada",
                "title_ca": "Revisió creuada",
                "description_es": "Revisar la fitxa d’un altre equip i proposar millores.",
                "description_ca": "Revisar la fitxa d’un altre equip i proposar millores.",
                "evidence_es": "Fitxa millorada.",
                "evidence_ca": "Fitxa millorada.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              }
            ]
          },
          {
            "title_es": "Atenció a la clientela i comunicació professional",
            "title_ca": "Atenció a la clientela i comunicació professional",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "Un servei d’higiene facial o corporal no és només tècnica: també implica acollir, escoltar, explicar el procés i mantenir una actitud professional, també davant clientela internacional.",
            "justification_ca": "Un servei d’higiene facial o corporal no és només tècnica: també implica acollir, escoltar, explicar el procés i mantenir una actitud professional, també davant clientela internacional.",
            "activities": [
              {
                "id": "act_0633_C2_1",
                "title_es": "Acollida de cabina",
                "title_ca": "Acollida de cabina",
                "description_es": "Practicar una acollida professional abans del tractament.",
                "description_ca": "Practicar una acollida professional abans del tractament.",
                "evidence_es": "Guió d’acollida.",
                "evidence_ca": "Guió d’acollida.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C2_2",
                "title_es": "Explica-m’ho fàcil",
                "title_ca": "Explica-m’ho fàcil",
                "description_es": "Explicar les fases d’un servei d’higiene amb llenguatge comprensible.",
                "description_ca": "Explicar les fases d’un servei d’higiene amb llenguatge comprensible.",
                "evidence_es": "Infografia oral o visual.",
                "evidence_ca": "Infografia oral o visual.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C2_3",
                "title_es": "Client/a amb dubtes",
                "title_ca": "Client/a amb dubtes",
                "description_es": "Respondre preguntes habituals abans del servei.",
                "description_ca": "Respondre preguntes habituals abans del servei.",
                "evidence_es": "FAQ professional.",
                "evidence_ca": "FAQ professional.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C2_4",
                "title_es": "Welcome to the cabin",
                "title_ca": "Welcome to the cabin",
                "description_es": "Incloure frases senzilles en anglès per rebre una clienta.",
                "description_ca": "Incloure frases senzilles en anglès per rebre una clienta.",
                "evidence_es": "Guió català-anglès.",
                "evidence_ca": "Guió català-anglès.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C2_5",
                "title_es": "To professional o massa informal?",
                "title_ca": "To professional o massa informal?",
                "description_es": "Classificar frases segons si són adequades per a cabina.",
                "description_ca": "Classificar frases segons si són adequades per a cabina.",
                "evidence_es": "Llista de frases professionals.",
                "evidence_ca": "Llista de frases professionals.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0633_C2_6",
                "title_es": "Escolta activa",
                "title_ca": "Escolta activa",
                "description_es": "Practicar reformulació de demandes de la clientela.",
                "description_ca": "Practicar reformulació de demandes de la clientela.",
                "evidence_es": "Registre de demanda reformulada.",
                "evidence_ca": "Registre de demanda reformulada.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C2_7",
                "title_es": "Semàfor comunicatiu",
                "title_ca": "Semàfor comunicatiu",
                "description_es": "Detectar expressions que ajuden o perjudiquen el tracte.",
                "description_ca": "Detectar expressions que ajuden o perjudiquen el tracte.",
                "evidence_es": "Mural de comunicació.",
                "evidence_ca": "Mural de comunicació.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0633_C2_8",
                "title_es": "Mini briefing",
                "title_ca": "Mini briefing",
                "description_es": "Fer una explicació prèvia del servei en menys d’un minut.",
                "description_ca": "Fer una explicació prèvia del servei en menys d’un minut.",
                "evidence_es": "Vídeo o observació oral.",
                "evidence_ca": "Vídeo o observació oral.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0633_C2_9",
                "title_es": "Client/a internacional",
                "title_ca": "Client/a internacional",
                "description_es": "Simular una situació amb vocabulari bàsic d’estètica en anglès.",
                "description_ca": "Simular una situació amb vocabulari bàsic d’estètica en anglès.",
                "evidence_es": "Diàleg breu.",
                "evidence_ca": "Diàleg breu.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              }
            ]
          },
          {
            "title_es": "Aparells i tecnologia aplicada a la higiene",
            "title_ca": "Aparells i tecnologia aplicada a la higiene",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "Els aparells d’anàlisi, exfoliació i higiene requereixen conèixer fonament, indicacions, condicions d’ús i el paper de la tecnologia en la prestació de serveis.",
            "justification_ca": "Els aparells d’anàlisi, exfoliació i higiene requereixen conèixer fonament, indicacions, condicions d’ús i el paper de la tecnologia en la prestació de serveis.",
            "activities": [
              {
                "id": "act_0633_C5_1",
                "title_es": "Aparell misteriós",
                "title_ca": "Aparell misteriós",
                "description_es": "Identificar ús, indicacions i precaucions d’un aparell.",
                "description_ca": "Identificar ús, indicacions i precaucions d’un aparell.",
                "evidence_es": "Fitxa d’aparell.",
                "evidence_ca": "Fitxa d’aparell.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C5_2",
                "title_es": "Manual en una pàgina",
                "title_ca": "Manual en una pàgina",
                "description_es": "Crear una guia ràpida d’ús segur d’un equip.",
                "description_ca": "Crear una guia ràpida d’ús segur d’un equip.",
                "evidence_es": "Manual visual.",
                "evidence_ca": "Manual visual.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C5_3",
                "title_es": "Tecnologia sí/no",
                "title_ca": "Tecnologia sí/no",
                "description_es": "Decidir si convé usar aparell en diversos casos.",
                "description_ca": "Decidir si convé usar aparell en diversos casos.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0633_C5_4",
                "title_es": "Checklist d’equip",
                "title_ca": "Checklist d’equip",
                "description_es": "Revisar estat i seguretat abans d’utilitzar un aparell.",
                "description_ca": "Revisar estat i seguretat abans d’utilitzar un aparell.",
                "evidence_es": "Checklist de revisió.",
                "evidence_ca": "Checklist de revisió.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C5_5",
                "title_es": "Comparativa manual vs aparatologia",
                "title_ca": "Comparativa manual vs aparatologia",
                "description_es": "Comparar tècnica manual i tècnica amb aparell.",
                "description_ca": "Comparar tècnica manual i tècnica amb aparell.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0633_C5_6",
                "title_es": "Mini demo",
                "title_ca": "Mini demo",
                "description_es": "Preparar una demostració segura d’un equip.",
                "description_ca": "Preparar una demostració segura d’un equip.",
                "evidence_es": "Demostració guiada.",
                "evidence_ca": "Demostració guiada.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C5_7",
                "title_es": "Tecnologia 4.0 al saló",
                "title_ca": "Tecnologia 4.0 al saló",
                "description_es": "Imaginar com digitalitzar o millorar un servei d’higiene.",
                "description_ca": "Imaginar com digitalitzar o millorar un servei d’higiene.",
                "evidence_es": "Proposta de millora.",
                "evidence_ca": "Proposta de millora.",
                "diversitySupport_es": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics.",
                "diversitySupport_ca": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics."
              },
              {
                "id": "act_0633_C5_8",
                "title_es": "Errors d’ús",
                "title_ca": "Errors d’ús",
                "description_es": "Detectar usos incorrectes d’aparatologia en imatges o casos.",
                "description_ca": "Detectar usos incorrectes d’aparatologia en imatges o casos.",
                "evidence_es": "Informe breu.",
                "evidence_ca": "Informe breu.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0633_C5_9",
                "title_es": "Fitxa QR",
                "title_ca": "Fitxa QR",
                "description_es": "Crear una fitxa amb QR cap a instruccions d’ús.",
                "description_ca": "Crear una fitxa amb QR cap a instruccions d’ús.",
                "evidence_es": "Fitxa QR simulada.",
                "evidence_ca": "Fitxa QR simulada.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              }
            ]
          }
        ]
      },
      {
        "id": "0633_RA2",
        "code": "RA2",
        "text_es": "Resultado de aprendizaje 2",
        "text_ca": "Resultat d'aprenentatge 2",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Higiene, desinfecció i cabina segura",
            "title_ca": "Higiene, desinfecció i cabina segura",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "La higiene facial i corporal comparteix amb altres serveis la necessitat de desinfectar, ordenar, protegir i prevenir riscos durant tota la intervenció.",
            "justification_ca": "La higiene facial i corporal comparteix amb altres serveis la necessitat de desinfectar, ordenar, protegir i prevenir riscos durant tota la intervenció.",
            "activities": [
              {
                "id": "act_0633_C3_1",
                "title_es": "Cabina amb errors",
                "title_ca": "Cabina amb errors",
                "description_es": "Detectar errades d’higiene i organització en una cabina simulada.",
                "description_ca": "Detectar errades d’higiene i organització en una cabina simulada.",
                "evidence_es": "Checklist d’errors.",
                "evidence_ca": "Checklist d’errors.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0633_C3_2",
                "title_es": "Ruta de desinfecció",
                "title_ca": "Ruta de desinfecció",
                "description_es": "Ordenar els passos de neteja i desinfecció d’útils.",
                "description_ca": "Ordenar els passos de neteja i desinfecció d’útils.",
                "evidence_es": "Protocol pas a pas.",
                "evidence_ca": "Protocol pas a pas.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C3_3",
                "title_es": "Material net o contaminat?",
                "title_ca": "Material net o contaminat?",
                "description_es": "Classificar materials segons tractament d’higiene necessari.",
                "description_ca": "Classificar materials segons tractament d’higiene necessari.",
                "evidence_es": "Taula de materials.",
                "evidence_ca": "Taula de materials.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0633_C3_4",
                "title_es": "EPI en acció",
                "title_ca": "EPI en acció",
                "description_es": "Triar EPI adequats per al servei d’higiene.",
                "description_ca": "Triar EPI adequats per al servei d’higiene.",
                "evidence_es": "Kit EPI justificat.",
                "evidence_ca": "Kit EPI justificat.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C3_5",
                "title_es": "Cabina zen però segura",
                "title_ca": "Cabina zen però segura",
                "description_es": "Organitzar espai bonic, còmode i segur.",
                "description_ca": "Organitzar espai bonic, còmode i segur.",
                "evidence_es": "Disseny de cabina.",
                "evidence_ca": "Disseny de cabina.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C3_6",
                "title_es": "Inspector/a d’higiene",
                "title_ca": "Inspector/a d’higiene",
                "description_es": "Avaluar el compliment d’un protocol en una pràctica.",
                "description_ca": "Avaluar el compliment d’un protocol en una pràctica.",
                "evidence_es": "Rúbrica d’higiene.",
                "evidence_ca": "Rúbrica d’higiene.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C3_7",
                "title_es": "Abans, durant i després",
                "title_ca": "Abans, durant i després",
                "description_es": "Distingir mesures d’higiene en cada fase del servei.",
                "description_ca": "Distingir mesures d’higiene en cada fase del servei.",
                "evidence_es": "Taula temporal.",
                "evidence_ca": "Taula temporal.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0633_C3_8",
                "title_es": "Cartell de normes",
                "title_ca": "Cartell de normes",
                "description_es": "Crear un cartell visual de normes de cabina.",
                "description_ca": "Crear un cartell visual de normes de cabina.",
                "evidence_es": "Cartell per aula-taller.",
                "evidence_ca": "Cartell per aula-taller.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0633_C3_9",
                "title_es": "Escape higiene",
                "title_ca": "Escape higiene",
                "description_es": "Resoldre pistes sobre desinfecció i prevenció.",
                "description_ca": "Resoldre pistes sobre desinfecció i prevenció.",
                "evidence_es": "Protocol final desbloquejat.",
                "evidence_ca": "Protocol final desbloquejat.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              }
            ]
          },
          {
            "title_es": "Cosmètics d’higiene i exfoliació",
            "title_ca": "Cosmètics d’higiene i exfoliació",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA3",
            "targetRaText_es": "Resultado de aprendizaje 3",
            "targetRaText_ca": "Resultat d'aprenentatge 3",
            "relationType": "tecnica",
            "justification_es": "La selecció i aplicació de cosmètics d’higiene i exfoliació depèn del tipus de pell, l’acció del cosmètic i el resultat desitjat.",
            "justification_ca": "La selecció i aplicació de cosmètics d’higiene i exfoliació depèn del tipus de pell, l’acció del cosmètic i el resultat desitjat.",
            "activities": [
              {
                "id": "act_0633_C4_1",
                "title_es": "Cosmètic ideal",
                "title_ca": "Cosmètic ideal",
                "description_es": "Triar cosmètic d’higiene per a tres tipus de pell.",
                "description_ca": "Triar cosmètic d’higiene per a tres tipus de pell.",
                "evidence_es": "Recomanació justificada.",
                "evidence_ca": "Recomanació justificada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0633_C4_2",
                "title_es": "Exfoliant sota lupa",
                "title_ca": "Exfoliant sota lupa",
                "description_es": "Comparar exfoliants segons textura, acció i pell recomanada.",
                "description_ca": "Comparar exfoliants segons textura, acció i pell recomanada.",
                "evidence_es": "Fitxa comparativa.",
                "evidence_ca": "Fitxa comparativa.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C4_3",
                "title_es": "Etiqueta clara",
                "title_ca": "Etiqueta clara",
                "description_es": "Interpretar informació essencial d’un cosmètic.",
                "description_ca": "Interpretar informació essencial d’un cosmètic.",
                "evidence_es": "Targeta d’etiqueta.",
                "evidence_ca": "Targeta d’etiqueta.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C4_4",
                "title_es": "No tot serveix",
                "title_ca": "No tot serveix",
                "description_es": "Detectar productes inadequats per a una pell sensible.",
                "description_ca": "Detectar productes inadequats per a una pell sensible.",
                "evidence_es": "Llista de productes descartats.",
                "evidence_ca": "Llista de productes descartats.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0633_C4_5",
                "title_es": "Rutina jove",
                "title_ca": "Rutina jove",
                "description_es": "Dissenyar una rutina de neteja per a pell adolescent o jove.",
                "description_ca": "Dissenyar una rutina de neteja per a pell adolescent o jove.",
                "evidence_es": "Rutina visual.",
                "evidence_ca": "Rutina visual.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C4_6",
                "title_es": "Forma cosmètica",
                "title_ca": "Forma cosmètica",
                "description_es": "Relacionar gel, llet, escuma o exfoliant amb la pell adequada.",
                "description_ca": "Relacionar gel, llet, escuma o exfoliant amb la pell adequada.",
                "evidence_es": "Taula de formes cosmètiques.",
                "evidence_ca": "Taula de formes cosmètiques.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0633_C4_7",
                "title_es": "Assessor/a per un dia",
                "title_ca": "Assessor/a per un dia",
                "description_es": "Explicar a una clienta quin exfoliant li convé i per què.",
                "description_ca": "Explicar a una clienta quin exfoliant li convé i per què.",
                "evidence_es": "Consell oral.",
                "evidence_ca": "Consell oral.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C4_8",
                "title_es": "Mite o veritat",
                "title_ca": "Mite o veritat",
                "description_es": "Desmuntar mites sobre exfoliació i neteja facial.",
                "description_ca": "Desmuntar mites sobre exfoliació i neteja facial.",
                "evidence_es": "Targetes mite/veritat.",
                "evidence_ca": "Targetes mite/veritat.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0633_C4_9",
                "title_es": "Top cosmètics",
                "title_ca": "Top cosmètics",
                "description_es": "Crear un top 5 de cosmètics bàsics d’higiene amb criteri tècnic.",
                "description_ca": "Crear un top 5 de cosmètics bàsics d’higiene amb criteri tècnic.",
                "evidence_es": "Pòster o carrusel.",
                "evidence_ca": "Pòster o carrusel.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              }
            ]
          }
        ]
      },
      {
        "id": "0633_RA4",
        "code": "RA4",
        "text_es": "Resultado de aprendizaje 4",
        "text_ca": "Resultat d'aprenentatge 4",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Massatge, anatomia i benestar",
            "title_ca": "Massatge, anatomia i benestar",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "El massatge estètic aplicat a higiene facial i corporal requereix identificar zones anatòmiques, adaptar mans i maniobres i connectar amb tècniques també presents en mans i peus.",
            "justification_ca": "El massatge estètic aplicat a higiene facial i corporal requereix identificar zones anatòmiques, adaptar mans i maniobres i connectar amb tècniques també presents en mans i peus.",
            "activities": [
              {
                "id": "act_0633_C6_1",
                "title_es": "Mapa de maniobres",
                "title_ca": "Mapa de maniobres",
                "description_es": "Relacionar maniobres bàsiques amb zones anatòmiques.",
                "description_ca": "Relacionar maniobres bàsiques amb zones anatòmiques.",
                "evidence_es": "Pòster de maniobres.",
                "evidence_ca": "Pòster de maniobres.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0633_C6_2",
                "title_es": "Ritme i pressió",
                "title_ca": "Ritme i pressió",
                "description_es": "Practicar variacions de ritme i intensitat segons efecte buscat.",
                "description_ca": "Practicar variacions de ritme i intensitat segons efecte buscat.",
                "evidence_es": "Autoavaluació tècnica.",
                "evidence_ca": "Autoavaluació tècnica.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C6_3",
                "title_es": "Anatomia en moviment",
                "title_ca": "Anatomia en moviment",
                "description_es": "Assenyalar zones anatòmiques mentre es descriu la maniobra.",
                "description_ca": "Assenyalar zones anatòmiques mentre es descriu la maniobra.",
                "evidence_es": "Mapa corporal comentat.",
                "evidence_ca": "Mapa corporal comentat.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C6_4",
                "title_es": "Massatge sense paraules",
                "title_ca": "Massatge sense paraules",
                "description_es": "Comunicar confort i professionalitat amb gestos i ritme.",
                "description_ca": "Comunicar confort i professionalitat amb gestos i ritme.",
                "evidence_es": "Observació amb rúbrica.",
                "evidence_ca": "Observació amb rúbrica.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C6_5",
                "title_es": "Maniobra prohibida",
                "title_ca": "Maniobra prohibida",
                "description_es": "Detectar maniobres inadequades per zona o situació.",
                "description_ca": "Detectar maniobres inadequades per zona o situació.",
                "evidence_es": "Llista de correccions.",
                "evidence_ca": "Llista de correccions.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C6_6",
                "title_es": "Del rostre a les mans",
                "title_ca": "Del rostre a les mans",
                "description_es": "Comparar maniobres facials amb maniobres de mans.",
                "description_ca": "Comparar maniobres facials amb maniobres de mans.",
                "evidence_es": "Taula de similituds.",
                "evidence_ca": "Taula de similituds.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C6_7",
                "title_es": "Seqüència relax",
                "title_ca": "Seqüència relax",
                "description_es": "Crear una seqüència curta de massatge facial.",
                "description_ca": "Crear una seqüència curta de massatge facial.",
                "evidence_es": "Protocol seqüenciat.",
                "evidence_ca": "Protocol seqüenciat.",
                "diversitySupport_es": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net.",
                "diversitySupport_ca": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net."
              },
              {
                "id": "act_0633_C6_8",
                "title_es": "Feedback tàctil segur",
                "title_ca": "Feedback tàctil segur",
                "description_es": "Donar feedback respectuós sobre pressió, ritme i postura.",
                "description_ca": "Donar feedback respectuós sobre pressió, ritme i postura.",
                "evidence_es": "Fitxa de feedback.",
                "evidence_ca": "Fitxa de feedback.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0633_C6_9",
                "title_es": "Tutorial de maniobres",
                "title_ca": "Tutorial de maniobres",
                "description_es": "Gravar o guionitzar un tutorial curt de maniobra.",
                "description_ca": "Gravar o guionitzar un tutorial curt de maniobra.",
                "evidence_es": "Microtutorial.",
                "evidence_ca": "Microtutorial.",
                "diversitySupport_es": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo.",
                "diversitySupport_ca": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo."
              }
            ]
          }
        ]
      },
      {
        "id": "0633_RA5",
        "code": "RA5",
        "text_es": "Resultado de aprendizaje 5",
        "text_ca": "Resultat d'aprenentatge 5",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Execució integral del servei d’higiene",
            "title_ca": "Execució integral del servei d’higiene",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "L’execució del servei exigeix seleccionar la tècnica, preparar la pell, aplicar cosmètics adequats, controlar temps i aprendre a millorar l’actuació professional.",
            "justification_ca": "L’execució del servei exigeix seleccionar la tècnica, preparar la pell, aplicar cosmètics adequats, controlar temps i aprendre a millorar l’actuació professional.",
            "activities": [
              {
                "id": "act_0633_C7_1",
                "title_es": "Circuit de servei",
                "title_ca": "Circuit de servei",
                "description_es": "Executar una seqüència simplificada d’higiene facial.",
                "description_ca": "Executar una seqüència simplificada d’higiene facial.",
                "evidence_es": "Protocol realitzat.",
                "evidence_ca": "Protocol realitzat.",
                "diversitySupport_es": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net.",
                "diversitySupport_ca": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net."
              },
              {
                "id": "act_0633_C7_2",
                "title_es": "Crono-higiene",
                "title_ca": "Crono-higiene",
                "description_es": "Gestionar el temps de cada fase del servei.",
                "description_ca": "Gestionar el temps de cada fase del servei.",
                "evidence_es": "Registre de temps.",
                "evidence_ca": "Registre de temps.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C7_3",
                "title_es": "Preparar per tractar",
                "title_ca": "Preparar per tractar",
                "description_es": "Triar tècniques de preparació de pell segons cas.",
                "description_ca": "Triar tècniques de preparació de pell segons cas.",
                "evidence_es": "Fitxa de preparació.",
                "evidence_ca": "Fitxa de preparació.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0633_C7_4",
                "title_es": "Servei pas a pas",
                "title_ca": "Servei pas a pas",
                "description_es": "Crear una seqüència visual completa del tractament.",
                "description_ca": "Crear una seqüència visual completa del tractament.",
                "evidence_es": "Diagrama de servei.",
                "evidence_ca": "Diagrama de servei.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0633_C7_5",
                "title_es": "Millora la meva tècnica",
                "title_ca": "Millora la meva tècnica",
                "description_es": "Identificar una millora personal després de practicar.",
                "description_ca": "Identificar una millora personal després de practicar.",
                "evidence_es": "Pla de millora.",
                "evidence_ca": "Pla de millora.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C7_6",
                "title_es": "Cosmètic final",
                "title_ca": "Cosmètic final",
                "description_es": "Triar producte finalitzador i justificar-lo.",
                "description_ca": "Triar producte finalitzador i justificar-lo.",
                "evidence_es": "Recomanació tècnica.",
                "evidence_ca": "Recomanació tècnica.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C7_7",
                "title_es": "Cabina realista",
                "title_ca": "Cabina realista",
                "description_es": "Simular un servei amb rols de professional, client/a i observador/a.",
                "description_ca": "Simular un servei amb rols de professional, client/a i observador/a.",
                "evidence_es": "Rúbrica de servei.",
                "evidence_ca": "Rúbrica de servei.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C7_8",
                "title_es": "Tècnica en parelles",
                "title_ca": "Tècnica en parelles",
                "description_es": "Practicar una fase i rebre feedback immediat.",
                "description_ca": "Practicar una fase i rebre feedback immediat.",
                "evidence_es": "Feedback escrit.",
                "evidence_ca": "Feedback escrit.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0633_C7_9",
                "title_es": "Checklist final",
                "title_ca": "Checklist final",
                "description_es": "Comprovar si el servei compleix fases i temps.",
                "description_ca": "Comprovar si el servei compleix fases i temps.",
                "evidence_es": "Checklist completada.",
                "evidence_ca": "Checklist completada.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              }
            ]
          },
          {
            "title_es": "Qualitat, satisfacció i registre digital del servei",
            "title_ca": "Qualitat, satisfacció i registre digital del servei",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA6",
            "targetRaText_es": "Resultado de aprendizaje 6",
            "targetRaText_ca": "Resultat d'aprenentatge 6",
            "relationType": "tecnica",
            "justification_es": "La millora d’un servei d’higiene requereix registrar tècniques i incidències, valorar resultats, recollir satisfacció i usar dades per aprendre i millorar.",
            "justification_ca": "La millora d’un servei d’higiene requereix registrar tècniques i incidències, valorar resultats, recollir satisfacció i usar dades per aprendre i millorar.",
            "activities": [
              {
                "id": "act_0633_C9_1",
                "title_es": "Enquesta flash",
                "title_ca": "Enquesta flash",
                "description_es": "Crear una enquesta de satisfacció de 5 preguntes.",
                "description_ca": "Crear una enquesta de satisfacció de 5 preguntes.",
                "evidence_es": "Formulari o enquesta.",
                "evidence_ca": "Formulari o enquesta.",
                "diversitySupport_es": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics.",
                "diversitySupport_ca": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics."
              },
              {
                "id": "act_0633_C9_2",
                "title_es": "Fitxa final",
                "title_ca": "Fitxa final",
                "description_es": "Registrar cosmètics, tècniques i incidències després del servei.",
                "description_ca": "Registrar cosmètics, tècniques i incidències després del servei.",
                "evidence_es": "Fitxa final completada.",
                "evidence_ca": "Fitxa final completada.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C9_3",
                "title_es": "Gràfic de satisfacció",
                "title_ca": "Gràfic de satisfacció",
                "description_es": "Representar resultats d’una enquesta simulada.",
                "description_ca": "Representar resultats d’una enquesta simulada.",
                "evidence_es": "Gràfic senzill.",
                "evidence_ca": "Gràfic senzill.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C9_4",
                "title_es": "Informe de servei",
                "title_ca": "Informe de servei",
                "description_es": "Redactar un informe breu del resultat obtingut.",
                "description_ca": "Redactar un informe breu del resultat obtingut.",
                "evidence_es": "Informe d’una pàgina.",
                "evidence_ca": "Informe d’una pàgina.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C9_5",
                "title_es": "Què milloraria?",
                "title_ca": "Què milloraria?",
                "description_es": "Proposar una millora a partir d’una incidència.",
                "description_ca": "Proposar una millora a partir d’una incidència.",
                "evidence_es": "Pla de millora.",
                "evidence_ca": "Pla de millora.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C9_6",
                "title_es": "Rúbrica de qualitat",
                "title_ca": "Rúbrica de qualitat",
                "description_es": "Construir una rúbrica per valorar higiene facial.",
                "description_ca": "Construir una rúbrica per valorar higiene facial.",
                "evidence_es": "Rúbrica compartida.",
                "evidence_ca": "Rúbrica compartida.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C9_7",
                "title_es": "Dades que serveixen",
                "title_ca": "Dades que serveixen",
                "description_es": "Distingir dades útils de dades irrellevants en un registre.",
                "description_ca": "Distingir dades útils de dades irrellevants en un registre.",
                "evidence_es": "Llista de dades útils.",
                "evidence_ca": "Llista de dades útils.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0633_C9_8",
                "title_es": "Reunió d’equip",
                "title_ca": "Reunió d’equip",
                "description_es": "Simular una reunió per revisar la qualitat del servei.",
                "description_ca": "Simular una reunió per revisar la qualitat del servei.",
                "evidence_es": "Acta de reunió.",
                "evidence_ca": "Acta de reunió.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C9_9",
                "title_es": "Portafoli de progrés",
                "title_ca": "Portafoli de progrés",
                "description_es": "Guardar evidències del servei i reflexionar sobre aprenentatge.",
                "description_ca": "Guardar evidències del servei i reflexionar sobre aprenentatge.",
                "evidence_es": "Entrada de portafoli.",
                "evidence_ca": "Entrada de portafoli.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              }
            ]
          }
        ]
      },
      {
        "id": "0633_RA6",
        "code": "RA6",
        "text_es": "Resultado de aprendizaje 6",
        "text_ca": "Resultat d'aprenentatge 6",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Assessorament posttractament i hàbits saludables",
            "title_ca": "Assessorament posttractament i hàbits saludables",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA6",
            "targetRaText_es": "Resultado de aprendizaje 6",
            "targetRaText_ca": "Resultat d'aprenentatge 6",
            "relationType": "tecnica",
            "justification_es": "El tancament del servei inclou recomanar cosmètics, pautes d’higiene i hàbits saludables de manera entenedora i, si cal, amb suport d’anglès professional.",
            "justification_ca": "El tancament del servei inclou recomanar cosmètics, pautes d’higiene i hàbits saludables de manera entenedora i, si cal, amb suport d’anglès professional.",
            "activities": [
              {
                "id": "act_0633_C8_1",
                "title_es": "Targeta posthigiene",
                "title_ca": "Targeta posthigiene",
                "description_es": "Crear consells per després d’una higiene facial.",
                "description_ca": "Crear consells per després d’una higiene facial.",
                "evidence_es": "Targeta de consells.",
                "evidence_ca": "Targeta de consells.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0633_C8_2",
                "title_es": "Pell sana en 5 hàbits",
                "title_ca": "Pell sana en 5 hàbits",
                "description_es": "Relacionar hàbits quotidians amb estat de la pell.",
                "description_ca": "Relacionar hàbits quotidians amb estat de la pell.",
                "evidence_es": "Infografia.",
                "evidence_ca": "Infografia.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0633_C8_3",
                "title_es": "Consell bilingüe",
                "title_ca": "Consell bilingüe",
                "description_es": "Redactar un consell breu en català i anglès.",
                "description_ca": "Redactar un consell breu en català i anglès.",
                "evidence_es": "Mini guia bilingüe.",
                "evidence_ca": "Mini guia bilingüe.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C8_4",
                "title_es": "Client/a impacient",
                "title_ca": "Client/a impacient",
                "description_es": "Explicar per què cal seguir pautes posttractament.",
                "description_ca": "Explicar per què cal seguir pautes posttractament.",
                "evidence_es": "Diàleg professional.",
                "evidence_ca": "Diàleg professional.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0633_C8_5",
                "title_es": "Cosmètic de manteniment",
                "title_ca": "Cosmètic de manteniment",
                "description_es": "Seleccionar producte de manteniment segons pell.",
                "description_ca": "Seleccionar producte de manteniment segons pell.",
                "evidence_es": "Recomanació justificada.",
                "evidence_ca": "Recomanació justificada.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C8_6",
                "title_es": "WhatsApp professional",
                "title_ca": "WhatsApp professional",
                "description_es": "Gravar un àudio curt amb recordatori posttractament.",
                "description_ca": "Gravar un àudio curt amb recordatori posttractament.",
                "evidence_es": "Àudio simulat.",
                "evidence_ca": "Àudio simulat.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0633_C8_7",
                "title_es": "Do & Don’t",
                "title_ca": "Do & Don’t",
                "description_es": "Classificar què fer i què evitar després del servei.",
                "description_ca": "Classificar què fer i què evitar després del servei.",
                "evidence_es": "Mural de recomanacions.",
                "evidence_ca": "Mural de recomanacions.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0633_C8_8",
                "title_es": "FAQ pell sana",
                "title_ca": "FAQ pell sana",
                "description_es": "Respondre dubtes habituals sobre higiene i hàbits.",
                "description_ca": "Respondre dubtes habituals sobre higiene i hàbits.",
                "evidence_es": "Document FAQ.",
                "evidence_ca": "Document FAQ.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0633_C8_9",
                "title_es": "Campanya mini",
                "title_ca": "Campanya mini",
                "description_es": "Crear una campanya jove sobre cura de la pell.",
                "description_ca": "Crear una campanya jove sobre cura de la pell.",
                "evidence_es": "Cartell o carrusel.",
                "evidence_ca": "Cartell o carrusel.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "0635",
    "name_es": "Depilación mecánica y decoloración del vello",
    "name_ca": "Depilació mecànica i decoloració del borrissol",
    "type": "especifico",
    "color": "#fb923c",
    "icon": "book",
    "learningOutcomes": [
      {
        "id": "0635_RA1",
        "code": "RA1",
        "text_es": "Resultado de aprendizaje 1",
        "text_ca": "Resultat d'aprenentatge 1",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Cabina segura i higiene professional",
            "title_ca": "Cabina segura i higiene professional",
            "targetModuleCode": "0635",
            "targetModuleName_es": "Depilación mecánica y decoloración del vello",
            "targetModuleName_ca": "Depilació mecànica i decoloració del borrissol",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "La preparació segura de la cabina de depilació exigeix aplicar higiene, material d’un sol ús, prevenció de riscos i protecció de la clientela i del professional.",
            "justification_ca": "La preparació segura de la cabina de depilació exigeix aplicar higiene, material d’un sol ús, prevenció de riscos i protecció de la clientela i del professional.",
            "activities": [
              {
                "id": "act_0635_C1_1",
                "title_es": "Cabina amb errors",
                "title_ca": "Cabina amb errors",
                "description_es": "Detectar errades d’higiene i seguretat en una cabina preparada amb incidències.",
                "description_ca": "Detectar errades d’higiene i seguretat en una cabina preparada amb incidències.",
                "evidence_es": "Checklist d’errors i correccions.",
                "evidence_ca": "Checklist d’errors i correccions.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C1_2",
                "title_es": "Semàfor de riscos",
                "title_ca": "Semàfor de riscos",
                "description_es": "Classificar riscos de cabina en verd, groc i vermell.",
                "description_ca": "Classificar riscos de cabina en verd, groc i vermell.",
                "evidence_es": "Mural de riscos i mesures preventives.",
                "evidence_ca": "Mural de riscos i mesures preventives.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0635_C1_3",
                "title_es": "Kit EPI exprés",
                "title_ca": "Kit EPI exprés",
                "description_es": "Seleccionar EPI adequats per a cada servei de depilació.",
                "description_ca": "Seleccionar EPI adequats per a cada servei de depilació.",
                "evidence_es": "Fitxa visual d’EPI per servei.",
                "evidence_ca": "Fitxa visual d’EPI per servei.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C1_4",
                "title_es": "Abans i després",
                "title_ca": "Abans i després",
                "description_es": "Reorganitzar una cabina desordenada fins deixar-la professional.",
                "description_ca": "Reorganitzar una cabina desordenada fins deixar-la professional.",
                "evidence_es": "Foto/registre abans-després amb justificació.",
                "evidence_ca": "Foto/registre abans-després amb justificació.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C1_5",
                "title_es": "Protocol en 60 segons",
                "title_ca": "Protocol en 60 segons",
                "description_es": "Explicar oralment el protocol bàsic de seguretat abans d’iniciar el servei.",
                "description_ca": "Explicar oralment el protocol bàsic de seguretat abans d’iniciar el servei.",
                "evidence_es": "Vídeo o àudio curt.",
                "evidence_ca": "Vídeo o àudio curt.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C1_6",
                "title_es": "Material d’un sol ús",
                "title_ca": "Material d’un sol ús",
                "description_es": "Decidir què ha de ser d’un sol ús i què es pot desinfectar.",
                "description_ca": "Decidir què ha de ser d’un sol ús i què es pot desinfectar.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0635_C1_7",
                "title_es": "Inspector/a de cabina",
                "title_ca": "Inspector/a de cabina",
                "description_es": "Avaluar la cabina d’un altre equip amb rúbrica simple.",
                "description_ca": "Avaluar la cabina d’un altre equip amb rúbrica simple.",
                "evidence_es": "Rúbrica d’inspecció.",
                "evidence_ca": "Rúbrica d’inspecció.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C1_8",
                "title_es": "Cartell de seguretat",
                "title_ca": "Cartell de seguretat",
                "description_es": "Crear un cartell atractiu per recordar normes d’higiene.",
                "description_ca": "Crear un cartell atractiu per recordar normes d’higiene.",
                "evidence_es": "Cartell per aula-taller.",
                "evidence_ca": "Cartell per aula-taller.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C1_9",
                "title_es": "Mini escape room d’higiene",
                "title_ca": "Mini escape room d’higiene",
                "description_es": "Resoldre pistes sobre desinfecció, EPI i riscos.",
                "description_ca": "Resoldre pistes sobre desinfecció, EPI i riscos.",
                "evidence_es": "Codi final i fitxa de resolució.",
                "evidence_ca": "Codi final i fitxa de resolució.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              }
            ]
          }
        ]
      },
      {
        "id": "0635_RA2",
        "code": "RA2",
        "text_es": "Resultado de aprendizaje 2",
        "text_ca": "Resultat d'aprenentatge 2",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Entrevista, anàlisi i fitxa tècnica",
            "title_ca": "Entrevista, anàlisi i fitxa tècnica",
            "targetModuleCode": "0635",
            "targetModuleName_es": "Depilación mecánica y decoloración del vello",
            "targetModuleName_ca": "Depilació mecànica i decoloració del borrissol",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "La depilació necessita una entrevista inicial, observació de pell i borrissol i registre tècnic; la comunicació pot incloure anglès funcional per clientela internacional.",
            "justification_ca": "La depilació necessita una entrevista inicial, observació de pell i borrissol i registre tècnic; la comunicació pot incloure anglès funcional per clientela internacional.",
            "activities": [
              {
                "id": "act_0635_C2_1",
                "title_es": "Entrevista 5 preguntes",
                "title_ca": "Entrevista 5 preguntes",
                "description_es": "Dissenyar cinc preguntes clau abans d’una depilació.",
                "description_ca": "Dissenyar cinc preguntes clau abans d’una depilació.",
                "evidence_es": "Qüestionari inicial.",
                "evidence_ca": "Qüestionari inicial.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C2_2",
                "title_es": "Client/a misteriós/osa",
                "title_ca": "Client/a misteriós/osa",
                "description_es": "Interpretar una fitxa incompleta i demanar dades que falten.",
                "description_ca": "Interpretar una fitxa incompleta i demanar dades que falten.",
                "evidence_es": "Fitxa completada.",
                "evidence_ca": "Fitxa completada.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C2_3",
                "title_es": "Mapa de zones",
                "title_ca": "Mapa de zones",
                "description_es": "Registrar zona, tipus de borrissol i estat de la pell en un esquema corporal.",
                "description_ca": "Registrar zona, tipus de borrissol i estat de la pell en un esquema corporal.",
                "evidence_es": "Mapa corporal tècnic.",
                "evidence_ca": "Mapa corporal tècnic.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C2_4",
                "title_es": "English welcome",
                "title_ca": "English welcome",
                "description_es": "Practicar una acollida bàsica en anglès abans de la presa de dades.",
                "description_ca": "Practicar una acollida bàsica en anglès abans de la presa de dades.",
                "evidence_es": "Guió breu bilingüe.",
                "evidence_ca": "Guió breu bilingüe.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C2_5",
                "title_es": "Fitxa premium",
                "title_ca": "Fitxa premium",
                "description_es": "Millorar una fitxa tècnica perquè sigui clara i útil.",
                "description_ca": "Millorar una fitxa tècnica perquè sigui clara i útil.",
                "evidence_es": "Model de fitxa millorada.",
                "evidence_ca": "Model de fitxa millorada.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C2_6",
                "title_es": "Errors d’entrevista",
                "title_ca": "Errors d’entrevista",
                "description_es": "Detectar preguntes poc professionals o invasives.",
                "description_ca": "Detectar preguntes poc professionals o invasives.",
                "evidence_es": "Llista de preguntes correctes/incorrectes.",
                "evidence_ca": "Llista de preguntes correctes/incorrectes.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C2_7",
                "title_es": "La demanda real",
                "title_ca": "La demanda real",
                "description_es": "Interpretar què vol realment una clienta a partir d’un diàleg.",
                "description_ca": "Interpretar què vol realment una clienta a partir d’un diàleg.",
                "evidence_es": "Decisió tècnica justificada.",
                "evidence_ca": "Decisió tècnica justificada.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C2_8",
                "title_es": "Pell i borrissol",
                "title_ca": "Pell i borrissol",
                "description_es": "Relacionar característiques del borrissol amb dades a registrar.",
                "description_ca": "Relacionar característiques del borrissol amb dades a registrar.",
                "evidence_es": "Taula de característiques.",
                "evidence_ca": "Taula de característiques.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C2_9",
                "title_es": "Role-play amb observador",
                "title_ca": "Role-play amb observador",
                "description_es": "Fer entrevista amb un company/a observador que dona feedback.",
                "description_ca": "Fer entrevista amb un company/a observador que dona feedback.",
                "evidence_es": "Rúbrica d’entrevista.",
                "evidence_ca": "Rúbrica d’entrevista.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              }
            ]
          }
        ]
      },
      {
        "id": "0635_RA3",
        "code": "RA3",
        "text_es": "Resultado de aprendizaje 3",
        "text_ca": "Resultat d'aprenentatge 3",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Selecció de tècnica segons pell, zona i borrissol",
            "title_ca": "Selecció de tècnica segons pell, zona i borrissol",
            "targetModuleCode": "0635",
            "targetModuleName_es": "Depilación mecánica y decoloración del vello",
            "targetModuleName_ca": "Depilació mecànica i decoloració del borrissol",
            "targetRaCode": "RA3",
            "targetRaText_es": "Resultado de aprendizaje 3",
            "targetRaText_ca": "Resultat d'aprenentatge 3",
            "relationType": "tecnica",
            "justification_es": "L’elecció entre tècniques depilatòries depèn de l’anàlisi professional, la zona anatòmica, la pell, el borrissol i les propietats dels productes utilitzats.",
            "justification_ca": "L’elecció entre tècniques depilatòries depèn de l’anàlisi professional, la zona anatòmica, la pell, el borrissol i les propietats dels productes utilitzats.",
            "activities": [
              {
                "id": "act_0635_C3_1",
                "title_es": "Tria la tècnica",
                "title_ca": "Tria la tècnica",
                "description_es": "Escollir tècnica per a casos amb zones i pells diferents.",
                "description_ca": "Escollir tècnica per a casos amb zones i pells diferents.",
                "evidence_es": "Taula tècnica justificada.",
                "evidence_ca": "Taula tècnica justificada.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0635_C3_2",
                "title_es": "Debat cera vs pinces",
                "title_ca": "Debat cera vs pinces",
                "description_es": "Defensar avantatges i límits de dues tècniques.",
                "description_ca": "Defensar avantatges i límits de dues tècniques.",
                "evidence_es": "Argumentari tècnic.",
                "evidence_ca": "Argumentari tècnic.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0635_C3_3",
                "title_es": "Mapa corporal de tècniques",
                "title_ca": "Mapa corporal de tècniques",
                "description_es": "Assignar tècniques recomanables a zones corporals.",
                "description_ca": "Assignar tècniques recomanables a zones corporals.",
                "evidence_es": "Pòster anatòmic.",
                "evidence_ca": "Pòster anatòmic.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C3_4",
                "title_es": "Casos impossibles",
                "title_ca": "Casos impossibles",
                "description_es": "Detectar casos on no s’hauria d’aplicar la tècnica triada.",
                "description_ca": "Detectar casos on no s’hauria d’aplicar la tècnica triada.",
                "evidence_es": "Informe breu de contraindicació.",
                "evidence_ca": "Informe breu de contraindicació.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0635_C3_5",
                "title_es": "Selector ràpid",
                "title_ca": "Selector ràpid",
                "description_es": "Crear un arbre de decisió de depilació.",
                "description_ca": "Crear un arbre de decisió de depilació.",
                "evidence_es": "Diagrama de flux.",
                "evidence_ca": "Diagrama de flux.",
                "diversitySupport_es": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net.",
                "diversitySupport_ca": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net."
              },
              {
                "id": "act_0635_C3_6",
                "title_es": "Fitxa de cera",
                "title_ca": "Fitxa de cera",
                "description_es": "Relacionar tipus de cera amb zona, pell i borrissol.",
                "description_ca": "Relacionar tipus de cera amb zona, pell i borrissol.",
                "evidence_es": "Fitxa comparativa.",
                "evidence_ca": "Fitxa comparativa.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C3_7",
                "title_es": "Tècnica per influencer",
                "title_ca": "Tècnica per influencer",
                "description_es": "Preparar un carrusel educatiu sobre quin mètode triar.",
                "description_ca": "Preparar un carrusel educatiu sobre quin mètode triar.",
                "evidence_es": "Carrusel simulat.",
                "evidence_ca": "Carrusel simulat.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C3_8",
                "title_es": "Miniclínica de casos",
                "title_ca": "Miniclínica de casos",
                "description_es": "Cada equip resol un cas i un altre equip el revisa.",
                "description_ca": "Cada equip resol un cas i un altre equip el revisa.",
                "evidence_es": "Solució revisada.",
                "evidence_ca": "Solució revisada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0635_C3_9",
                "title_es": "Semàfor de zones",
                "title_ca": "Semàfor de zones",
                "description_es": "Classificar zones segons dificultat o risc.",
                "description_ca": "Classificar zones segons dificultat o risc.",
                "evidence_es": "Mural semàfor.",
                "evidence_ca": "Mural semàfor.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              }
            ]
          },
          {
            "title_es": "Cosmètics depilatoris i gestió digital de productes",
            "title_ca": "Cosmètics depilatoris i gestió digital de productes",
            "targetModuleCode": "0635",
            "targetModuleName_es": "Depilación mecánica y decoloración del vello",
            "targetModuleName_ca": "Depilació mecànica i decoloració del borrissol",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La selecció de cosmètics depilatoris i decolorants requereix comprendre composició, ús, manipulació i possibilitats de registre digital o al núvol.",
            "justification_ca": "La selecció de cosmètics depilatoris i decolorants requereix comprendre composició, ús, manipulació i possibilitats de registre digital o al núvol.",
            "activities": [
              {
                "id": "act_0635_C4_1",
                "title_es": "Etiqueta sota lupa",
                "title_ca": "Etiqueta sota lupa",
                "description_es": "Analitzar etiqueta, ús i precaucions d’un producte.",
                "description_ca": "Analitzar etiqueta, ús i precaucions d’un producte.",
                "evidence_es": "Fitxa tècnica de producte.",
                "evidence_ca": "Fitxa tècnica de producte.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C4_2",
                "title_es": "Inventari digital",
                "title_ca": "Inventari digital",
                "description_es": "Crear un registre senzill de productes de depilació.",
                "description_ca": "Crear un registre senzill de productes de depilació.",
                "evidence_es": "Full de càlcul o taula digital.",
                "evidence_ca": "Full de càlcul o taula digital.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C4_3",
                "title_es": "Producte caducat",
                "title_ca": "Producte caducat",
                "description_es": "Decidir què fer davant productes alterats o mal conservats.",
                "description_ca": "Decidir què fer davant productes alterats o mal conservats.",
                "evidence_es": "Protocol d’actuació.",
                "evidence_ca": "Protocol d’actuació.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0635_C4_4",
                "title_es": "Top 3 productes",
                "title_ca": "Top 3 productes",
                "description_es": "Comparar tres productes i recomanar-ne un per a un cas.",
                "description_ca": "Comparar tres productes i recomanar-ne un per a un cas.",
                "evidence_es": "Recomanació justificada.",
                "evidence_ca": "Recomanació justificada.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0635_C4_5",
                "title_es": "Codi QR de producte",
                "title_ca": "Codi QR de producte",
                "description_es": "Crear una fitxa amb QR que porti a instruccions d’ús.",
                "description_ca": "Crear una fitxa amb QR que porti a instruccions d’ús.",
                "evidence_es": "Etiqueta/QR simulat.",
                "evidence_ca": "Etiqueta/QR simulat.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C4_6",
                "title_es": "Armari perfecte",
                "title_ca": "Armari perfecte",
                "description_es": "Organitzar productes segons ús, caducitat i seguretat.",
                "description_ca": "Organitzar productes segons ús, caducitat i seguretat.",
                "evidence_es": "Foto o esquema d’organització.",
                "evidence_ca": "Foto o esquema d’organització.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C4_7",
                "title_es": "Alerta d’ús",
                "title_ca": "Alerta d’ús",
                "description_es": "Redactar advertiments senzills i clars per a productes decolorants.",
                "description_ca": "Redactar advertiments senzills i clars per a productes decolorants.",
                "evidence_es": "Targeta d’advertiments.",
                "evidence_ca": "Targeta d’advertiments.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C4_8",
                "title_es": "Composició en llenguatge jove",
                "title_ca": "Composició en llenguatge jove",
                "description_es": "Explicar components d’un producte amb paraules senzilles.",
                "description_ca": "Explicar components d’un producte amb paraules senzilles.",
                "evidence_es": "Infografia breu.",
                "evidence_ca": "Infografia breu.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C4_9",
                "title_es": "Comparativa cloud",
                "title_ca": "Comparativa cloud",
                "description_es": "Guardar i compartir fitxes de producte en un espai comú.",
                "description_ca": "Guardar i compartir fitxes de producte en un espai comú.",
                "evidence_es": "Carpeta o base compartida.",
                "evidence_ca": "Carpeta o base compartida.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              }
            ]
          }
        ]
      },
      {
        "id": "0635_RA4",
        "code": "RA4",
        "text_es": "Resultado de aprendizaje 4",
        "text_ca": "Resultat d'aprenentatge 4",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Execució tècnica, destresa manual i gestió del temps",
            "title_ca": "Execució tècnica, destresa manual i gestió del temps",
            "targetModuleCode": "0635",
            "targetModuleName_es": "Depilación mecánica y decoloración del vello",
            "targetModuleName_ca": "Depilació mecànica i decoloració del borrissol",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "La depilació requereix ajustar procediments per zones, treballar amb destresa, acabar en el temps adequat i incorporar l’aprenentatge autònom com a millora professional.",
            "justification_ca": "La depilació requereix ajustar procediments per zones, treballar amb destresa, acabar en el temps adequat i incorporar l’aprenentatge autònom com a millora professional.",
            "activities": [
              {
                "id": "act_0635_C5_1",
                "title_es": "Crono-tècnica",
                "title_ca": "Crono-tècnica",
                "description_es": "Executar una seqüència simulada dins un temps realista.",
                "description_ca": "Executar una seqüència simulada dins un temps realista.",
                "evidence_es": "Registre de temps i millores.",
                "evidence_ca": "Registre de temps i millores.",
                "diversitySupport_es": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net.",
                "diversitySupport_ca": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net."
              },
              {
                "id": "act_0635_C5_2",
                "title_es": "Destresa amb pinces",
                "title_ca": "Destresa amb pinces",
                "description_es": "Practicar precisió manual en suport simulat.",
                "description_ca": "Practicar precisió manual en suport simulat.",
                "evidence_es": "Evidència de destresa.",
                "evidence_ca": "Evidència de destresa.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0635_C5_3",
                "title_es": "Zona a zona",
                "title_ca": "Zona a zona",
                "description_es": "Adaptar el procediment a diferents zones corporals simulades.",
                "description_ca": "Adaptar el procediment a diferents zones corporals simulades.",
                "evidence_es": "Fitxa per zona.",
                "evidence_ca": "Fitxa per zona.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C5_4",
                "title_es": "Assaig i millora",
                "title_ca": "Assaig i millora",
                "description_es": "Repetir una tècnica i comparar l’evolució.",
                "description_ca": "Repetir una tècnica i comparar l’evolució.",
                "evidence_es": "Diari de millora.",
                "evidence_ca": "Diari de millora.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0635_C5_5",
                "title_es": "Tutorial intern",
                "title_ca": "Tutorial intern",
                "description_es": "Crear un microtutorial de passos tècnics.",
                "description_ca": "Crear un microtutorial de passos tècnics.",
                "evidence_es": "Vídeo curt o guió.",
                "evidence_ca": "Vídeo curt o guió.",
                "diversitySupport_es": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo.",
                "diversitySupport_ca": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo."
              },
              {
                "id": "act_0635_C5_6",
                "title_es": "Tècnica sense presses",
                "title_ca": "Tècnica sense presses",
                "description_es": "Identificar errors que apareixen quan es treballa massa ràpid.",
                "description_ca": "Identificar errors que apareixen quan es treballa massa ràpid.",
                "evidence_es": "Llista d’alertes.",
                "evidence_ca": "Llista d’alertes.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0635_C5_7",
                "title_es": "Relleu professional",
                "title_ca": "Relleu professional",
                "description_es": "Un equip inicia el procés i un altre el continua seguint protocol.",
                "description_ca": "Un equip inicia el procés i un altre el continua seguint protocol.",
                "evidence_es": "Protocol compartit.",
                "evidence_ca": "Protocol compartit.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C5_8",
                "title_es": "Temps real de cabina",
                "title_ca": "Temps real de cabina",
                "description_es": "Planificar agenda d’un servei de depilació.",
                "description_ca": "Planificar agenda d’un servei de depilació.",
                "evidence_es": "Planificació de temps.",
                "evidence_ca": "Planificació de temps.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C5_9",
                "title_es": "Autoentrenament",
                "title_ca": "Autoentrenament",
                "description_es": "Dissenyar una rutina personal de pràctica tècnica.",
                "description_ca": "Dissenyar una rutina personal de pràctica tècnica.",
                "evidence_es": "Pla d’entrenament.",
                "evidence_ca": "Pla d’entrenament.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              }
            ]
          },
          {
            "title_es": "Posttractament i assessorament a la clientela",
            "title_ca": "Posttractament i assessorament a la clientela",
            "targetModuleCode": "0635",
            "targetModuleName_es": "Depilación mecánica y decoloración del vello",
            "targetModuleName_ca": "Depilació mecànica i decoloració del borrissol",
            "targetRaCode": "RA6",
            "targetRaText_es": "Resultado de aprendizaje 6",
            "targetRaText_ca": "Resultat d'aprenentatge 6",
            "relationType": "tecnica",
            "justification_es": "Després de la depilació o decoloració cal assessorar sobre cosmètics, hàbits, hidratació i cures posteriors amb comunicació clara i, si cal, en anglès funcional.",
            "justification_ca": "Després de la depilació o decoloració cal assessorar sobre cosmètics, hàbits, hidratació i cures posteriors amb comunicació clara i, si cal, en anglès funcional.",
            "activities": [
              {
                "id": "act_0635_C7_1",
                "title_es": "Targeta postdepilació",
                "title_ca": "Targeta postdepilació",
                "description_es": "Crear una targeta amb pautes per a les 24-48 h posteriors.",
                "description_ca": "Crear una targeta amb pautes per a les 24-48 h posteriors.",
                "evidence_es": "Targeta de consells.",
                "evidence_ca": "Targeta de consells.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C7_2",
                "title_es": "Do & Don’t",
                "title_ca": "Do & Don’t",
                "description_es": "Classificar què fer i què evitar després del servei.",
                "description_ca": "Classificar què fer i què evitar després del servei.",
                "evidence_es": "Mural de recomanacions.",
                "evidence_ca": "Mural de recomanacions.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0635_C7_3",
                "title_es": "Consell exprés",
                "title_ca": "Consell exprés",
                "description_es": "Fer una explicació oral de 45 segons a la clientela.",
                "description_ca": "Fer una explicació oral de 45 segons a la clientela.",
                "evidence_es": "Vídeo o observació oral.",
                "evidence_ca": "Vídeo o observació oral.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C7_4",
                "title_es": "Mini guia bilingüe",
                "title_ca": "Mini guia bilingüe",
                "description_es": "Redactar consells en català amb frases bàsiques en anglès.",
                "description_ca": "Redactar consells en català amb frases bàsiques en anglès.",
                "evidence_es": "Guia breu bilingüe.",
                "evidence_ca": "Guia breu bilingüe.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C7_5",
                "title_es": "Hidratació i pell",
                "title_ca": "Hidratació i pell",
                "description_es": "Relacionar hidratació i recuperació cutània.",
                "description_ca": "Relacionar hidratació i recuperació cutània.",
                "evidence_es": "Fitxa de consell saludable.",
                "evidence_ca": "Fitxa de consell saludable.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0635_C7_6",
                "title_es": "Clienta que pregunta",
                "title_ca": "Clienta que pregunta",
                "description_es": "Respondre dubtes sobre sol, piscina, esport o cosmètics.",
                "description_ca": "Respondre dubtes sobre sol, piscina, esport o cosmètics.",
                "evidence_es": "FAQ posttractament.",
                "evidence_ca": "FAQ posttractament.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C7_7",
                "title_es": "Producte calmant",
                "title_ca": "Producte calmant",
                "description_es": "Recomanar cosmètic protector o calmant segons cas.",
                "description_ca": "Recomanar cosmètic protector o calmant segons cas.",
                "evidence_es": "Recomanació justificada.",
                "evidence_ca": "Recomanació justificada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0635_C7_8",
                "title_es": "Sticker de cabina",
                "title_ca": "Sticker de cabina",
                "description_es": "Dissenyar adhesius o recordatoris visuals postservei.",
                "description_ca": "Dissenyar adhesius o recordatoris visuals postservei.",
                "evidence_es": "Sticker/cartell.",
                "evidence_ca": "Sticker/cartell.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C7_9",
                "title_es": "Audio WhatsApp professional",
                "title_ca": "Audio WhatsApp professional",
                "description_es": "Gravar un missatge curt de recordatori posttractament.",
                "description_ca": "Gravar un missatge curt de recordatori posttractament.",
                "evidence_es": "Àudio simulat.",
                "evidence_ca": "Àudio simulat.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              }
            ]
          }
        ]
      },
      {
        "id": "0635_RA5",
        "code": "RA5",
        "text_es": "Resultado de aprendizaje 5",
        "text_ca": "Resultat d'aprenentatge 5",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Decoloració segura: química, temps i prevenció",
            "title_ca": "Decoloració segura: química, temps i prevenció",
            "targetModuleCode": "0635",
            "targetModuleName_es": "Depilación mecánica y decoloración del vello",
            "targetModuleName_ca": "Depilació mecànica i decoloració del borrissol",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La decoloració combina proporcions, concentracions, temps de reacció, explicació química i mesures de seguretat i higiene.",
            "justification_ca": "La decoloració combina proporcions, concentracions, temps de reacció, explicació química i mesures de seguretat i higiene.",
            "activities": [
              {
                "id": "act_0635_C6_1",
                "title_es": "Mescla correcta",
                "title_ca": "Mescla correcta",
                "description_es": "Calcular proporcions simulades i justificar-les.",
                "description_ca": "Calcular proporcions simulades i justificar-les.",
                "evidence_es": "Fitxa de mescla.",
                "evidence_ca": "Fitxa de mescla.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C6_2",
                "title_es": "Temporitzador crític",
                "title_ca": "Temporitzador crític",
                "description_es": "Analitzar què passa si es supera el temps recomanat.",
                "description_ca": "Analitzar què passa si es supera el temps recomanat.",
                "evidence_es": "Taula risc-temps.",
                "evidence_ca": "Taula risc-temps.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0635_C6_3",
                "title_es": "Química en paraules fàcils",
                "title_ca": "Química en paraules fàcils",
                "description_es": "Explicar la decoloració sense vocabulari excessivament difícil.",
                "description_ca": "Explicar la decoloració sense vocabulari excessivament difícil.",
                "evidence_es": "Explicació oral breu.",
                "evidence_ca": "Explicació oral breu.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C6_4",
                "title_es": "Protocol anticremades",
                "title_ca": "Protocol anticremades",
                "description_es": "Crear una guia de seguretat per evitar irritacions.",
                "description_ca": "Crear una guia de seguretat per evitar irritacions.",
                "evidence_es": "Protocol visual.",
                "evidence_ca": "Protocol visual.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C6_5",
                "title_es": "EPI en decoloració",
                "title_ca": "EPI en decoloració",
                "description_es": "Seleccionar protecció professional/client segons situació.",
                "description_ca": "Seleccionar protecció professional/client segons situació.",
                "evidence_es": "Kit d’EPI justificat.",
                "evidence_ca": "Kit d’EPI justificat.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C6_6",
                "title_es": "Ordre dels passos",
                "title_ca": "Ordre dels passos",
                "description_es": "Ordenar un procediment de decoloració desordenat.",
                "description_ca": "Ordenar un procediment de decoloració desordenat.",
                "evidence_es": "Seqüència correcta.",
                "evidence_ca": "Seqüència correcta.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0635_C6_7",
                "title_es": "Simulació de reacció",
                "title_ca": "Simulació de reacció",
                "description_es": "Decidir què fer davant una reacció adversa simulada.",
                "description_ca": "Decidir què fer davant una reacció adversa simulada.",
                "evidence_es": "Resposta professional.",
                "evidence_ca": "Resposta professional.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C6_8",
                "title_es": "Fitxa de seguretat",
                "title_ca": "Fitxa de seguretat",
                "description_es": "Crear una fitxa breu amb temps, mescla i precaucions.",
                "description_ca": "Crear una fitxa breu amb temps, mescla i precaucions.",
                "evidence_es": "Fitxa d’ús segur.",
                "evidence_ca": "Fitxa d’ús segur.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C6_9",
                "title_es": "Preguntes de clientela",
                "title_ca": "Preguntes de clientela",
                "description_es": "Respondre dubtes habituals sobre decoloració.",
                "description_ca": "Respondre dubtes habituals sobre decoloració.",
                "evidence_es": "FAQ professional.",
                "evidence_ca": "FAQ professional.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              }
            ]
          }
        ]
      },
      {
        "id": "0635_RA6",
        "code": "RA6",
        "text_es": "Resultado de aprendizaje 6",
        "text_ca": "Resultat d'aprenentatge 6",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Qualitat, satisfacció i millora del servei",
            "title_ca": "Qualitat, satisfacció i millora del servei",
            "targetModuleCode": "0635",
            "targetModuleName_es": "Depilación mecánica y decoloración del vello",
            "targetModuleName_ca": "Depilació mecànica i decoloració del borrissol",
            "targetRaCode": "RA6",
            "targetRaText_es": "Resultado de aprendizaje 6",
            "targetRaText_ca": "Resultat d'aprenentatge 6",
            "relationType": "tecnica",
            "justification_es": "La qualitat d’un servei de depilació es mesura amb indicadors professionals, satisfacció de la clientela i propostes de millora, que poden recollir-se digitalment.",
            "justification_ca": "La qualitat d’un servei de depilació es mesura amb indicadors professionals, satisfacció de la clientela i propostes de millora, que poden recollir-se digitalment.",
            "activities": [
              {
                "id": "act_0635_C8_1",
                "title_es": "Enquesta flash",
                "title_ca": "Enquesta flash",
                "description_es": "Crear una enquesta de satisfacció de 5 ítems.",
                "description_ca": "Crear una enquesta de satisfacció de 5 ítems.",
                "evidence_es": "Formulari o enquesta en paper.",
                "evidence_ca": "Formulari o enquesta en paper.",
                "diversitySupport_es": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics.",
                "diversitySupport_ca": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics."
              },
              {
                "id": "act_0635_C8_2",
                "title_es": "Indicadors de qualitat",
                "title_ca": "Indicadors de qualitat",
                "description_es": "Definir què vol dir servei de depilació excel·lent.",
                "description_ca": "Definir què vol dir servei de depilació excel·lent.",
                "evidence_es": "Llista d’indicadors.",
                "evidence_ca": "Llista d’indicadors.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C8_3",
                "title_es": "Dades en gràfic",
                "title_ca": "Dades en gràfic",
                "description_es": "Representar resultats d’una enquesta simulada.",
                "description_ca": "Representar resultats d’una enquesta simulada.",
                "evidence_es": "Gràfic senzill.",
                "evidence_ca": "Gràfic senzill.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C8_4",
                "title_es": "Client/a insatisfet/a",
                "title_ca": "Client/a insatisfet/a",
                "description_es": "Proposar resposta professional a una queixa.",
                "description_ca": "Proposar resposta professional a una queixa.",
                "evidence_es": "Resposta i mesura correctora.",
                "evidence_ca": "Resposta i mesura correctora.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0635_C8_5",
                "title_es": "Rúbrica de servei",
                "title_ca": "Rúbrica de servei",
                "description_es": "Crear una rúbrica breu per avaluar una pràctica.",
                "description_ca": "Crear una rúbrica breu per avaluar una pràctica.",
                "evidence_es": "Rúbrica compartida.",
                "evidence_ca": "Rúbrica compartida.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0635_C8_6",
                "title_es": "Millora 1%",
                "title_ca": "Millora 1%",
                "description_es": "Triar una petita millora realista per al següent servei.",
                "description_ca": "Triar una petita millora realista per al següent servei.",
                "evidence_es": "Pla de millora.",
                "evidence_ca": "Pla de millora.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C8_7",
                "title_es": "Termòmetre de satisfacció",
                "title_ca": "Termòmetre de satisfacció",
                "description_es": "Dissenyar un sistema visual de valoració ràpida.",
                "description_ca": "Dissenyar un sistema visual de valoració ràpida.",
                "evidence_es": "Eina visual.",
                "evidence_ca": "Eina visual.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C8_8",
                "title_es": "Informe de qualitat",
                "title_ca": "Informe de qualitat",
                "description_es": "Elaborar un informe breu després d’un servei simulat.",
                "description_ca": "Elaborar un informe breu després d’un servei simulat.",
                "evidence_es": "Informe d’una pàgina.",
                "evidence_ca": "Informe d’una pàgina.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C8_9",
                "title_es": "Pitch de millora",
                "title_ca": "Pitch de millora",
                "description_es": "Defensar una millora davant la classe.",
                "description_ca": "Defensar una millora davant la classe.",
                "evidence_es": "Pitch de 60 segons.",
                "evidence_ca": "Pitch de 60 segons.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              }
            ]
          },
          {
            "title_es": "Vocabulari tècnic, anglès professional i dossier digital",
            "title_ca": "Vocabulari tècnic, anglès professional i dossier digital",
            "targetModuleCode": "0635",
            "targetModuleName_es": "Depilación mecánica y decoloración del vello",
            "targetModuleName_ca": "Depilació mecànica i decoloració del borrissol",
            "targetRaCode": "RA6",
            "targetRaText_es": "Resultado de aprendizaje 6",
            "targetRaText_ca": "Resultat d'aprenentatge 6",
            "relationType": "tecnica",
            "justification_es": "El domini del vocabulari tècnic de depilació i decoloració facilita la comunicació professional, la documentació, l’aprenentatge autònom i l’atenció a clientela internacional.",
            "justification_ca": "El domini del vocabulari tècnic de depilació i decoloració facilita la comunicació professional, la documentació, l’aprenentatge autònom i l’atenció a clientela internacional.",
            "activities": [
              {
                "id": "act_0635_C9_1",
                "title_es": "Diccionari visual",
                "title_ca": "Diccionari visual",
                "description_es": "Crear entrades visuals de vocabulari tècnic.",
                "description_ca": "Crear entrades visuals de vocabulari tècnic.",
                "evidence_es": "Diccionari digital.",
                "evidence_ca": "Diccionari digital.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C9_2",
                "title_es": "Paraula prohibida",
                "title_ca": "Paraula prohibida",
                "description_es": "Explicar un terme tècnic sense dir la paraula clau.",
                "description_ca": "Explicar un terme tècnic sense dir la paraula clau.",
                "evidence_es": "Targetes de vocabulari.",
                "evidence_ca": "Targetes de vocabulari.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0635_C9_3",
                "title_es": "Glossari català-anglès",
                "title_ca": "Glossari català-anglès",
                "description_es": "Traduir vocabulari bàsic de depilació i decoloració.",
                "description_ca": "Traduir vocabulari bàsic de depilació i decoloració.",
                "evidence_es": "Glossari bilingüe.",
                "evidence_ca": "Glossari bilingüe.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0635_C9_4",
                "title_es": "Fitxa de client en anglès",
                "title_ca": "Fitxa de client en anglès",
                "description_es": "Redactar frases senzilles per registrar o explicar el servei.",
                "description_ca": "Redactar frases senzilles per registrar o explicar el servei.",
                "evidence_es": "Mini fitxa bilingüe.",
                "evidence_ca": "Mini fitxa bilingüe.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0635_C9_5",
                "title_es": "Pictionary estètic",
                "title_ca": "Pictionary estètic",
                "description_es": "Dibuixar i endevinar útils, productes o accions.",
                "description_ca": "Dibuixar i endevinar útils, productes o accions.",
                "evidence_es": "Cartes il·lustrades.",
                "evidence_ca": "Cartes il·lustrades.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C9_6",
                "title_es": "QR vocabulari",
                "title_ca": "QR vocabulari",
                "description_es": "Crear codis QR cap a definicions o imatges.",
                "description_ca": "Crear codis QR cap a definicions o imatges.",
                "evidence_es": "Mural amb QR.",
                "evidence_ca": "Mural amb QR.",
                "diversitySupport_es": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics.",
                "diversitySupport_ca": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics."
              },
              {
                "id": "act_0635_C9_7",
                "title_es": "Dossier tècnic",
                "title_ca": "Dossier tècnic",
                "description_es": "Organitzar termes per blocs: eines, productes, riscos, posttractament.",
                "description_ca": "Organitzar termes per blocs: eines, productes, riscos, posttractament.",
                "evidence_es": "Dossier ordenat.",
                "evidence_ca": "Dossier ordenat.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0635_C9_8",
                "title_es": "Microvídeo terme del dia",
                "title_ca": "Microvídeo terme del dia",
                "description_es": "Explicar un terme en 30 segons.",
                "description_ca": "Explicar un terme en 30 segons.",
                "evidence_es": "Clip breu.",
                "evidence_ca": "Clip breu.",
                "diversitySupport_es": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo.",
                "diversitySupport_ca": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo."
              },
              {
                "id": "act_0635_C9_9",
                "title_es": "Escape vocabulari",
                "title_ca": "Escape vocabulari",
                "description_es": "Resoldre pistes amb termes tècnics per completar un protocol.",
                "description_ca": "Resoldre pistes amb termes tècnics per completar un protocol.",
                "evidence_es": "Protocol final completat.",
                "evidence_ca": "Protocol final completat.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "0636",
    "name_es": "Estética de manos y pies",
    "name_ca": "Estètica de mans i peus",
    "type": "especifico",
    "color": "#fbbf24",
    "icon": "book",
    "learningOutcomes": [
      {
        "id": "0636_RA1",
        "code": "RA1",
        "text_es": "Resultado de aprendizaje 1",
        "text_ca": "Resultat d'aprenentatge 1",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Anàlisi de mans i peus i demanda de la clientela",
            "title_ca": "Anàlisi de mans i peus i demanda de la clientela",
            "targetModuleCode": "0636",
            "targetModuleName_es": "Estética de manos y pies",
            "targetModuleName_ca": "Estètica de mans i peus",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "El procés de manicura i pedicura parteix de l’estudi de mans i peus, la detecció d’alteracions, la relació amb l’anatomia i una comunicació professional clara amb la clientela.",
            "justification_ca": "El procés de manicura i pedicura parteix de l’estudi de mans i peus, la detecció d’alteracions, la relació amb l’anatomia i una comunicació professional clara amb la clientela.",
            "activities": [
              {
                "id": "act_0636_C1_1",
                "title_es": "Fitxa inicial de mans i peus",
                "title_ca": "Fitxa inicial de mans i peus",
                "description_es": "Crear una fitxa per registrar morfologia, demandes i dades d’interès.",
                "description_ca": "Crear una fitxa per registrar morfologia, demandes i dades d’interès.",
                "evidence_es": "Fitxa tècnica inicial.",
                "evidence_ca": "Fitxa tècnica inicial.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0636_C1_2",
                "title_es": "Entrevista a client/a",
                "title_ca": "Entrevista a client/a",
                "description_es": "Practicar la recollida de gustos, hàbits i necessitats abans del servei.",
                "description_ca": "Practicar la recollida de gustos, hàbits i necessitats abans del servei.",
                "evidence_es": "Qüestionari completat.",
                "evidence_ca": "Qüestionari completat.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0636_C1_3",
                "title_es": "Detectives d’alteracions",
                "title_ca": "Detectives d’alteracions",
                "description_es": "Identificar alteracions visibles que poden influir en el servei.",
                "description_ca": "Identificar alteracions visibles que poden influir en el servei.",
                "evidence_es": "Informe breu d’observació.",
                "evidence_ca": "Informe breu d’observació.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0636_C1_4",
                "title_es": "Mapa de mans i peus",
                "title_ca": "Mapa de mans i peus",
                "description_es": "Relacionar zones anatòmiques amb informació que cal observar.",
                "description_ca": "Relacionar zones anatòmiques amb informació que cal observar.",
                "evidence_es": "Esquema anatòmic comentat.",
                "evidence_ca": "Esquema anatòmic comentat.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C1_5",
                "title_es": "Client/a internacional",
                "title_ca": "Client/a internacional",
                "description_es": "Fer una acollida bàsica en anglès abans d’una manicura.",
                "description_ca": "Fer una acollida bàsica en anglès abans d’una manicura.",
                "evidence_es": "Diàleg breu.",
                "evidence_ca": "Diàleg breu.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0636_C1_6",
                "title_es": "Demanda real o moda?",
                "title_ca": "Demanda real o moda?",
                "description_es": "Distingir demanda estètica, necessitat tècnica i moda de xarxes.",
                "description_ca": "Distingir demanda estètica, necessitat tècnica i moda de xarxes.",
                "evidence_es": "Taula demanda/necessitat.",
                "evidence_ca": "Taula demanda/necessitat.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0636_C1_7",
                "title_es": "Fitxa incompleta",
                "title_ca": "Fitxa incompleta",
                "description_es": "Detectar dades que falten en una fitxa de client/a.",
                "description_ca": "Detectar dades que falten en una fitxa de client/a.",
                "evidence_es": "Fitxa corregida.",
                "evidence_ca": "Fitxa corregida.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0636_C1_8",
                "title_es": "Observació responsable",
                "title_ca": "Observació responsable",
                "description_es": "Decidir quan cal adaptar, ajornar o derivar un servei.",
                "description_ca": "Decidir quan cal adaptar, ajornar o derivar un servei.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0636_C1_9",
                "title_es": "Mini briefing inicial",
                "title_ca": "Mini briefing inicial",
                "description_es": "Explicar al client/a què s’observarà abans de començar.",
                "description_ca": "Explicar al client/a què s’observarà abans de començar.",
                "evidence_es": "Guió de 60 segons.",
                "evidence_ca": "Guió de 60 segons.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              }
            ]
          },
          {
            "title_es": "Imatge professional, qualitat i ocupabilitat",
            "title_ca": "Imatge professional, qualitat i ocupabilitat",
            "targetModuleCode": "0636",
            "targetModuleName_es": "Estética de manos y pies",
            "targetModuleName_ca": "Estètica de mans i peus",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La imatge del professional, l’actitud, la qualitat i la satisfacció de la clientela són elements clau per a l’ocupabilitat en el sector d’estètica i bellesa.",
            "justification_ca": "La imatge del professional, l’actitud, la qualitat i la satisfacció de la clientela són elements clau per a l’ocupabilitat en el sector d’estètica i bellesa.",
            "activities": [
              {
                "id": "act_0636_C9_1",
                "title_es": "Professional per un dia",
                "title_ca": "Professional per un dia",
                "description_es": "Definir com ha de presentar-se un/a tècnic/a de mans i peus.",
                "description_ca": "Definir com ha de presentar-se un/a tècnic/a de mans i peus.",
                "evidence_es": "Decàleg d’imatge professional.",
                "evidence_ca": "Decàleg d’imatge professional.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0636_C9_2",
                "title_es": "Qualitat visible",
                "title_ca": "Qualitat visible",
                "description_es": "Identificar detalls que fan que un servei sembli professional.",
                "description_ca": "Identificar detalls que fan que un servei sembli professional.",
                "evidence_es": "Llista d’indicadors.",
                "evidence_ca": "Llista d’indicadors.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C9_3",
                "title_es": "Client/a satisfet/a",
                "title_ca": "Client/a satisfet/a",
                "description_es": "Dissenyar una mini enquesta sobre satisfacció en manicura.",
                "description_ca": "Dissenyar una mini enquesta sobre satisfacció en manicura.",
                "evidence_es": "Enquesta breu.",
                "evidence_ca": "Enquesta breu.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0636_C9_4",
                "title_es": "Feedback elegant",
                "title_ca": "Feedback elegant",
                "description_es": "Practicar com rebre i respondre una crítica d’una clienta.",
                "description_ca": "Practicar com rebre i respondre una crítica d’una clienta.",
                "evidence_es": "Resposta professional.",
                "evidence_ca": "Resposta professional.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0636_C9_5",
                "title_es": "El meu punt fort",
                "title_ca": "El meu punt fort",
                "description_es": "Relacionar qualitats personals amb la feina d’estètica.",
                "description_ca": "Relacionar qualitats personals amb la feina d’estètica.",
                "evidence_es": "Mini DAFO personal.",
                "evidence_ca": "Mini DAFO personal.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C9_6",
                "title_es": "Abans de la foto",
                "title_ca": "Abans de la foto",
                "description_es": "Revisar si el resultat final respon a gustos i necessitats.",
                "description_ca": "Revisar si el resultat final respon a gustos i necessitats.",
                "evidence_es": "Checklist final.",
                "evidence_ca": "Checklist final.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C9_7",
                "title_es": "Pitch professional",
                "title_ca": "Pitch professional",
                "description_es": "Presentar-se com a futura professional d’estètica de mans i peus.",
                "description_ca": "Presentar-se com a futura professional d’estètica de mans i peus.",
                "evidence_es": "Pitch de 60 segons.",
                "evidence_ca": "Pitch de 60 segons.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0636_C9_8",
                "title_es": "Errors d’imatge",
                "title_ca": "Errors d’imatge",
                "description_es": "Detectar conductes poc professionals en casos simulats.",
                "description_ca": "Detectar conductes poc professionals en casos simulats.",
                "evidence_es": "Correcció proposada.",
                "evidence_ca": "Correcció proposada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0636_C9_9",
                "title_es": "Portafoli inicial",
                "title_ca": "Portafoli inicial",
                "description_es": "Crear una primera evidència de treball per al futur portafoli.",
                "description_ca": "Crear una primera evidència de treball per al futur portafoli.",
                "evidence_es": "Fitxa d’evidència professional.",
                "evidence_ca": "Fitxa d’evidència professional.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              }
            ]
          }
        ]
      },
      {
        "id": "0636_RA2",
        "code": "RA2",
        "text_es": "Resultado de aprendizaje 2",
        "text_ca": "Resultat d'aprenentatge 2",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Espai de manicura i pedicura segur i higiènic",
            "title_ca": "Espai de manicura i pedicura segur i higiènic",
            "targetModuleCode": "0636",
            "targetModuleName_es": "Estética de manos y pies",
            "targetModuleName_ca": "Estètica de mans i peus",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "La preparació de l’espai de mans i peus requereix identificar zones de treball, mantenir higiene, desinfectar o esterilitzar i aplicar criteris de prevenció de riscos.",
            "justification_ca": "La preparació de l’espai de mans i peus requereix identificar zones de treball, mantenir higiene, desinfectar o esterilitzar i aplicar criteris de prevenció de riscos.",
            "activities": [
              {
                "id": "act_0636_C2_1",
                "title_es": "Taula amb errors",
                "title_ca": "Taula amb errors",
                "description_es": "Detectar errors d’higiene en un espai de manicura preparat amb incidències.",
                "description_ca": "Detectar errors d’higiene en un espai de manicura preparat amb incidències.",
                "evidence_es": "Checklist d’errors.",
                "evidence_ca": "Checklist d’errors.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C2_2",
                "title_es": "Ruta de desinfecció",
                "title_ca": "Ruta de desinfecció",
                "description_es": "Ordenar els passos de neteja, desinfecció i esterilització d’útils.",
                "description_ca": "Ordenar els passos de neteja, desinfecció i esterilització d’útils.",
                "evidence_es": "Protocol pas a pas.",
                "evidence_ca": "Protocol pas a pas.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C2_3",
                "title_es": "Kit segur",
                "title_ca": "Kit segur",
                "description_es": "Seleccionar materials i EPI necessaris per a manicura i pedicura.",
                "description_ca": "Seleccionar materials i EPI necessaris per a manicura i pedicura.",
                "evidence_es": "Kit justificat.",
                "evidence_ca": "Kit justificat.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C2_4",
                "title_es": "Abans i després",
                "title_ca": "Abans i després",
                "description_es": "Reorganitzar una taula de treball perquè sigui higiènica i funcional.",
                "description_ca": "Reorganitzar una taula de treball perquè sigui higiènica i funcional.",
                "evidence_es": "Foto o esquema abans/després.",
                "evidence_ca": "Foto o esquema abans/després.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0636_C2_5",
                "title_es": "Semàfor d’higiene",
                "title_ca": "Semàfor d’higiene",
                "description_es": "Classificar conductes de risc i conductes correctes.",
                "description_ca": "Classificar conductes de risc i conductes correctes.",
                "evidence_es": "Mural semàfor.",
                "evidence_ca": "Mural semàfor.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0636_C2_6",
                "title_es": "Inspector/a de taula",
                "title_ca": "Inspector/a de taula",
                "description_es": "Avaluar l’espai d’un altre equip amb rúbrica simple.",
                "description_ca": "Avaluar l’espai d’un altre equip amb rúbrica simple.",
                "evidence_es": "Rúbrica d’inspecció.",
                "evidence_ca": "Rúbrica d’inspecció.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0636_C2_7",
                "title_es": "Cartell recordatori",
                "title_ca": "Cartell recordatori",
                "description_es": "Crear un cartell visual de normes d’higiene per a l’aula-taller.",
                "description_ca": "Crear un cartell visual de normes d’higiene per a l’aula-taller.",
                "evidence_es": "Cartell per aula.",
                "evidence_ca": "Cartell per aula.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C2_8",
                "title_es": "Material net o brut?",
                "title_ca": "Material net o brut?",
                "description_es": "Classificar útils segons el tractament higiènic necessari.",
                "description_ca": "Classificar útils segons el tractament higiènic necessari.",
                "evidence_es": "Taula de materials.",
                "evidence_ca": "Taula de materials.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0636_C2_9",
                "title_es": "Escape higiene mans-peus",
                "title_ca": "Escape higiene mans-peus",
                "description_es": "Resoldre pistes sobre higiene, útils i prevenció.",
                "description_ca": "Resoldre pistes sobre higiene, útils i prevenció.",
                "evidence_es": "Protocol final desbloquejat.",
                "evidence_ca": "Protocol final desbloquejat.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              }
            ]
          },
          {
            "title_es": "Selecció d’equips, cosmètics i materials",
            "title_ca": "Selecció d’equips, cosmètics i materials",
            "targetModuleCode": "0636",
            "targetModuleName_es": "Estética de manos y pies",
            "targetModuleName_ca": "Estètica de mans i peus",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "La manicura i pedicura requereixen seleccionar i manejar equips, materials i cosmètics, inclosos productes decoratius i cosmètics per annexos cutanis, amb criteri tècnic.",
            "justification_ca": "La manicura i pedicura requereixen seleccionar i manejar equips, materials i cosmètics, inclosos productes decoratius i cosmètics per annexos cutanis, amb criteri tècnic.",
            "activities": [
              {
                "id": "act_0636_C3_1",
                "title_es": "Tria el material",
                "title_ca": "Tria el material",
                "description_es": "Seleccionar útils i cosmètics per a tres serveis diferents.",
                "description_ca": "Seleccionar útils i cosmètics per a tres serveis diferents.",
                "evidence_es": "Safata de servei justificada.",
                "evidence_ca": "Safata de servei justificada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0636_C3_2",
                "title_es": "Cosmètic sota lupa",
                "title_ca": "Cosmètic sota lupa",
                "description_es": "Analitzar un cosmètic d’ungles segons ús i presentació.",
                "description_ca": "Analitzar un cosmètic d’ungles segons ús i presentació.",
                "evidence_es": "Fitxa tècnica.",
                "evidence_ca": "Fitxa tècnica.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C3_3",
                "title_es": "Equip correcte",
                "title_ca": "Equip correcte",
                "description_es": "Relacionar aparell o eina amb la seva funció professional.",
                "description_ca": "Relacionar aparell o eina amb la seva funció professional.",
                "evidence_es": "Taula equip-funció.",
                "evidence_ca": "Taula equip-funció.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0636_C3_4",
                "title_es": "Maletí professional",
                "title_ca": "Maletí professional",
                "description_es": "Dissenyar el maletí bàsic d’un/a tècnic/a de mans i peus.",
                "description_ca": "Dissenyar el maletí bàsic d’un/a tècnic/a de mans i peus.",
                "evidence_es": "Maletí visual.",
                "evidence_ca": "Maletí visual.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C3_5",
                "title_es": "No tot val",
                "title_ca": "No tot val",
                "description_es": "Detectar materials inadequats per a un servei concret.",
                "description_ca": "Detectar materials inadequats per a un servei concret.",
                "evidence_es": "Llista de descartats.",
                "evidence_ca": "Llista de descartats.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C3_6",
                "title_es": "Demostració d’ús",
                "title_ca": "Demostració d’ús",
                "description_es": "Explicar com utilitzar correctament un útil o cosmètic.",
                "description_ca": "Explicar com utilitzar correctament un útil o cosmètic.",
                "evidence_es": "Microdemo.",
                "evidence_ca": "Microdemo.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0636_C3_7",
                "title_es": "Comparativa d’esmalts",
                "title_ca": "Comparativa d’esmalts",
                "description_es": "Comparar textures i tècniques d’aplicació.",
                "description_ca": "Comparar textures i tècniques d’aplicació.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0636_C3_8",
                "title_es": "Targeta d’aparell",
                "title_ca": "Targeta d’aparell",
                "description_es": "Crear una targeta amb indicacions i precaucions d’un aparell.",
                "description_ca": "Crear una targeta amb indicacions i precaucions d’un aparell.",
                "evidence_es": "Targeta tècnica.",
                "evidence_ca": "Targeta tècnica.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0636_C3_9",
                "title_es": "Estació preparada",
                "title_ca": "Estació preparada",
                "description_es": "Preparar una estació amb els materials exactes per a un cas.",
                "description_ca": "Preparar una estació amb els materials exactes per a un cas.",
                "evidence_es": "Estació revisada.",
                "evidence_ca": "Estació revisada.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              }
            ]
          }
        ]
      },
      {
        "id": "0636_RA3",
        "code": "RA3",
        "text_es": "Resultado de aprendizaje 3",
        "text_ca": "Resultat d'aprenentatge 3",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Tècniques bàsiques de manicura i pedicura",
            "title_ca": "Tècniques bàsiques de manicura i pedicura",
            "targetModuleCode": "0636",
            "targetModuleName_es": "Estética de manos y pies",
            "targetModuleName_ca": "Estètica de mans i peus",
            "targetRaCode": "RA3",
            "targetRaText_es": "Resultado de aprendizaje 3",
            "targetRaText_ca": "Resultat d'aprenentatge 3",
            "relationType": "tecnica",
            "justification_es": "Les tècniques bàsiques d’ungles requereixen coneixement de zones anatòmiques, higiene durant el procés i control del temps professional.",
            "justification_ca": "Les tècniques bàsiques d’ungles requereixen coneixement de zones anatòmiques, higiene durant el procés i control del temps professional.",
            "activities": [
              {
                "id": "act_0636_C4_1",
                "title_es": "Seqüència bàsica",
                "title_ca": "Seqüència bàsica",
                "description_es": "Ordenar les fases de manicura bàsica.",
                "description_ca": "Ordenar les fases de manicura bàsica.",
                "evidence_es": "Protocol visual.",
                "evidence_ca": "Protocol visual.",
                "diversitySupport_es": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net.",
                "diversitySupport_ca": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net."
              },
              {
                "id": "act_0636_C4_2",
                "title_es": "Llimat segons forma",
                "title_ca": "Llimat segons forma",
                "description_es": "Practicar formes d’ungla en suport simulat.",
                "description_ca": "Practicar formes d’ungla en suport simulat.",
                "evidence_es": "Mostrari de formes.",
                "evidence_ca": "Mostrari de formes.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0636_C4_3",
                "title_es": "Cutícula amb cura",
                "title_ca": "Cutícula amb cura",
                "description_es": "Decidir com actuar segons diferents casos de cutícula.",
                "description_ca": "Decidir com actuar segons diferents casos de cutícula.",
                "evidence_es": "Fitxa de decisió.",
                "evidence_ca": "Fitxa de decisió.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0636_C4_4",
                "title_es": "Crono-manicura",
                "title_ca": "Crono-manicura",
                "description_es": "Gestionar el temps de cada fase del servei.",
                "description_ca": "Gestionar el temps de cada fase del servei.",
                "evidence_es": "Registre de temps.",
                "evidence_ca": "Registre de temps.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0636_C4_5",
                "title_es": "Zona anatòmica",
                "title_ca": "Zona anatòmica",
                "description_es": "Identificar parts de mà, peu i ungla abans de la pràctica.",
                "description_ca": "Identificar parts de mà, peu i ungla abans de la pràctica.",
                "evidence_es": "Esquema etiquetat.",
                "evidence_ca": "Esquema etiquetat.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C4_6",
                "title_es": "Higiene durant el servei",
                "title_ca": "Higiene durant el servei",
                "description_es": "Detectar moments clau on cal reforçar higiene.",
                "description_ca": "Detectar moments clau on cal reforçar higiene.",
                "evidence_es": "Checklist d’higiene.",
                "evidence_ca": "Checklist d’higiene.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C4_7",
                "title_es": "Error tècnic",
                "title_ca": "Error tècnic",
                "description_es": "Observar errors de tall, llimat o poliment i corregir-los.",
                "description_ca": "Observar errors de tall, llimat o poliment i corregir-los.",
                "evidence_es": "Correcció justificada.",
                "evidence_ca": "Correcció justificada.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C4_8",
                "title_es": "Tutorial de forma",
                "title_ca": "Tutorial de forma",
                "description_es": "Crear un microtutorial sobre tall i forma d’ungles.",
                "description_ca": "Crear un microtutorial sobre tall i forma d’ungles.",
                "evidence_es": "Guió o vídeo curt.",
                "evidence_ca": "Guió o vídeo curt.",
                "diversitySupport_es": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo.",
                "diversitySupport_ca": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo."
              },
              {
                "id": "act_0636_C4_9",
                "title_es": "Pràctica per parelles",
                "title_ca": "Pràctica per parelles",
                "description_es": "Fer una fase tècnica i rebre feedback immediat.",
                "description_ca": "Fer una fase tècnica i rebre feedback immediat.",
                "evidence_es": "Fitxa de feedback.",
                "evidence_ca": "Fitxa de feedback.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              }
            ]
          },
          {
            "title_es": "Massatge de mans i peus, anatomia i benestar",
            "title_ca": "Massatge de mans i peus, anatomia i benestar",
            "targetModuleCode": "0633",
            "targetModuleName_es": "Técnicas de higiene facial y corporal",
            "targetModuleName_ca": "Tècniques d’higiene facial i corporal",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "El massatge en manicura i pedicura comparteix principis amb el massatge estètic, requereix coneixement anatòmic i s’ha d’aplicar amb seguretat i prevenció.",
            "justification_ca": "El massatge en manicura i pedicura comparteix principis amb el massatge estètic, requereix coneixement anatòmic i s’ha d’aplicar amb seguretat i prevenció.",
            "activities": [
              {
                "id": "act_0636_C5_1",
                "title_es": "Mapa de maniobres",
                "title_ca": "Mapa de maniobres",
                "description_es": "Relacionar maniobres amb zones de mans i peus.",
                "description_ca": "Relacionar maniobres amb zones de mans i peus.",
                "evidence_es": "Pòster de maniobres.",
                "evidence_ca": "Pòster de maniobres.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C5_2",
                "title_es": "Ritme relax",
                "title_ca": "Ritme relax",
                "description_es": "Practicar ritme, pressió i seqüència de massatge.",
                "description_ca": "Practicar ritme, pressió i seqüència de massatge.",
                "evidence_es": "Autoavaluació tècnica.",
                "evidence_ca": "Autoavaluació tècnica.",
                "diversitySupport_es": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net.",
                "diversitySupport_ca": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net."
              },
              {
                "id": "act_0636_C5_3",
                "title_es": "Músculs i ossos",
                "title_ca": "Músculs i ossos",
                "description_es": "Ubicar estructures bàsiques que condicionen el massatge.",
                "description_ca": "Ubicar estructures bàsiques que condicionen el massatge.",
                "evidence_es": "Esquema anatòmic.",
                "evidence_ca": "Esquema anatòmic.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C5_4",
                "title_es": "Contraindicació o no?",
                "title_ca": "Contraindicació o no?",
                "description_es": "Decidir si aplicar massatge segons casos simulats.",
                "description_ca": "Decidir si aplicar massatge segons casos simulats.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0636_C5_5",
                "title_es": "Massatge en silenci",
                "title_ca": "Massatge en silenci",
                "description_es": "Treballar contacte, ritme i professionalitat sense parlar.",
                "description_ca": "Treballar contacte, ritme i professionalitat sense parlar.",
                "evidence_es": "Observació amb rúbrica.",
                "evidence_ca": "Observació amb rúbrica.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0636_C5_6",
                "title_es": "Mini protocol",
                "title_ca": "Mini protocol",
                "description_es": "Crear una seqüència curta de massatge de mans.",
                "description_ca": "Crear una seqüència curta de massatge de mans.",
                "evidence_es": "Protocol seqüenciat.",
                "evidence_ca": "Protocol seqüenciat.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0636_C5_7",
                "title_es": "Feedback respectuós",
                "title_ca": "Feedback respectuós",
                "description_es": "Donar feedback sobre pressió i postura.",
                "description_ca": "Donar feedback sobre pressió i postura.",
                "evidence_es": "Fitxa de feedback.",
                "evidence_ca": "Fitxa de feedback.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C5_8",
                "title_es": "Benestar en 3 minuts",
                "title_ca": "Benestar en 3 minuts",
                "description_es": "Dissenyar una mini experiència relaxant de cabina.",
                "description_ca": "Dissenyar una mini experiència relaxant de cabina.",
                "evidence_es": "Seqüència breu.",
                "evidence_ca": "Seqüència breu.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C5_9",
                "title_es": "Tutorial de maniobra",
                "title_ca": "Tutorial de maniobra",
                "description_es": "Gravar o guionitzar una maniobra bàsica.",
                "description_ca": "Gravar o guionitzar una maniobra bàsica.",
                "evidence_es": "Tutorial curt.",
                "evidence_ca": "Tutorial curt.",
                "diversitySupport_es": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo.",
                "diversitySupport_ca": "Es facilita un guió breu amb estructura inici-desenvolupament-tancament; es permet gravar diverses preses, treballar en parella i lliurar només àudio si no es vol aparèixer en vídeo."
              }
            ]
          }
        ]
      },
      {
        "id": "0636_RA4",
        "code": "RA4",
        "text_es": "Resultado de aprendizaje 4",
        "text_ca": "Resultat d'aprenentatge 4",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Tractaments específics de mans, peus i ungles",
            "title_ca": "Tractaments específics de mans, peus i ungles",
            "targetModuleCode": "0636",
            "targetModuleName_es": "Estética de manos y pies",
            "targetModuleName_ca": "Estètica de mans i peus",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "Els tractaments específics combinen procediments, aparatologia, cosmètics i tecnologies que poden millorar la prestació del servei.",
            "justification_ca": "Els tractaments específics combinen procediments, aparatologia, cosmètics i tecnologies que poden millorar la prestació del servei.",
            "activities": [
              {
                "id": "act_0636_C6_1",
                "title_es": "Tractament a mida",
                "title_ca": "Tractament a mida",
                "description_es": "Triar un tractament específic per a un cas de mans o peus.",
                "description_ca": "Triar un tractament específic per a un cas de mans o peus.",
                "evidence_es": "Proposta de tractament.",
                "evidence_ca": "Proposta de tractament.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0636_C6_2",
                "title_es": "Parafina segura",
                "title_ca": "Parafina segura",
                "description_es": "Crear un protocol d’ús de parafina amb precaucions.",
                "description_ca": "Crear un protocol d’ús de parafina amb precaucions.",
                "evidence_es": "Protocol visual.",
                "evidence_ca": "Protocol visual.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0636_C6_3",
                "title_es": "Aparell sí/no",
                "title_ca": "Aparell sí/no",
                "description_es": "Decidir si convé utilitzar aparatologia en diferents casos.",
                "description_ca": "Decidir si convé utilitzar aparatologia en diferents casos.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0636_C6_4",
                "title_es": "Cosmètic clau",
                "title_ca": "Cosmètic clau",
                "description_es": "Seleccionar cosmètic de tractament i explicar-ne la funció.",
                "description_ca": "Seleccionar cosmètic de tractament i explicar-ne la funció.",
                "evidence_es": "Fitxa cosmètica.",
                "evidence_ca": "Fitxa cosmètica.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C6_5",
                "title_es": "Servei premium",
                "title_ca": "Servei premium",
                "description_es": "Dissenyar un tractament de mans o peus com a experiència completa.",
                "description_ca": "Dissenyar un tractament de mans o peus com a experiència completa.",
                "evidence_es": "Carta de servei.",
                "evidence_ca": "Carta de servei.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C6_6",
                "title_es": "Tecnologia al servei",
                "title_ca": "Tecnologia al servei",
                "description_es": "Proposar una millora digital o tecnològica per al tractament.",
                "description_ca": "Proposar una millora digital o tecnològica per al tractament.",
                "evidence_es": "Proposta 4.0.",
                "evidence_ca": "Proposta 4.0.",
                "diversitySupport_es": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics.",
                "diversitySupport_ca": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics."
              },
              {
                "id": "act_0636_C6_7",
                "title_es": "Contraindicacions",
                "title_ca": "Contraindicacions",
                "description_es": "Detectar quan no s’hauria de fer un tractament específic.",
                "description_ca": "Detectar quan no s’hauria de fer un tractament específic.",
                "evidence_es": "Informe de decisió.",
                "evidence_ca": "Informe de decisió.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0636_C6_8",
                "title_es": "Estació de tractament",
                "title_ca": "Estació de tractament",
                "description_es": "Preparar materials, aparells i cosmètics per a un tractament.",
                "description_ca": "Preparar materials, aparells i cosmètics per a un tractament.",
                "evidence_es": "Estació revisada.",
                "evidence_ca": "Estació revisada.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0636_C6_9",
                "title_es": "Pitch de tractament",
                "title_ca": "Pitch de tractament",
                "description_es": "Presentar un tractament específic a una clienta jove.",
                "description_ca": "Presentar un tractament específic a una clienta jove.",
                "evidence_es": "Pitch de 60 segons.",
                "evidence_ca": "Pitch de 60 segons.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              }
            ]
          },
          {
            "title_es": "Manteniment, ús higiènic i eliminació de materials",
            "title_ca": "Manteniment, ús higiènic i eliminació de materials",
            "targetModuleCode": "0636",
            "targetModuleName_es": "Estética de manos y pies",
            "targetModuleName_ca": "Estètica de mans i peus",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "Els tractaments de mans i peus necessiten manipular cosmètics i aparells de manera segura, mantenir-los correctament i eliminar residus seguint criteris higienicosanitaris.",
            "justification_ca": "Els tractaments de mans i peus necessiten manipular cosmètics i aparells de manera segura, mantenir-los correctament i eliminar residus seguint criteris higienicosanitaris.",
            "activities": [
              {
                "id": "act_0636_C7_1",
                "title_es": "Residus de cabina",
                "title_ca": "Residus de cabina",
                "description_es": "Classificar residus generats en manicura i pedicura.",
                "description_ca": "Classificar residus generats en manicura i pedicura.",
                "evidence_es": "Taula de residus.",
                "evidence_ca": "Taula de residus.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0636_C7_2",
                "title_es": "Manteniment d’útils",
                "title_ca": "Manteniment d’útils",
                "description_es": "Crear una rutina de manteniment d’útils i aparells.",
                "description_ca": "Crear una rutina de manteniment d’útils i aparells.",
                "evidence_es": "Checklist de manteniment.",
                "evidence_ca": "Checklist de manteniment.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0636_C7_3",
                "title_es": "Cosmètic ben manipulat",
                "title_ca": "Cosmètic ben manipulat",
                "description_es": "Practicar pautes d’ús segur d’un cosmètic.",
                "description_ca": "Practicar pautes d’ús segur d’un cosmètic.",
                "evidence_es": "Fitxa d’ús segur.",
                "evidence_ca": "Fitxa d’ús segur.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0636_C7_4",
                "title_es": "Normativa visual",
                "title_ca": "Normativa visual",
                "description_es": "Convertir normes higienicosanitàries en un cartell entenedor.",
                "description_ca": "Convertir normes higienicosanitàries en un cartell entenedor.",
                "evidence_es": "Cartell normatiu.",
                "evidence_ca": "Cartell normatiu.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C7_5",
                "title_es": "Què faig amb això?",
                "title_ca": "Què faig amb això?",
                "description_es": "Decidir com eliminar o conservar materials després del servei.",
                "description_ca": "Decidir com eliminar o conservar materials després del servei.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0636_C7_6",
                "title_es": "Caducat o alterat",
                "title_ca": "Caducat o alterat",
                "description_es": "Detectar cosmètics no aptes per a l’ús.",
                "description_ca": "Detectar cosmètics no aptes per a l’ús.",
                "evidence_es": "Informe de retirada.",
                "evidence_ca": "Informe de retirada.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C7_7",
                "title_es": "Circuit net-brut",
                "title_ca": "Circuit net-brut",
                "description_es": "Dissenyar el recorregut del material brut i net dins la cabina.",
                "description_ca": "Dissenyar el recorregut del material brut i net dins la cabina.",
                "evidence_es": "Diagrama de flux.",
                "evidence_ca": "Diagrama de flux.",
                "diversitySupport_es": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net.",
                "diversitySupport_ca": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net."
              },
              {
                "id": "act_0636_C7_8",
                "title_es": "Risc i solució",
                "title_ca": "Risc i solució",
                "description_es": "Relacionar un risc amb una mesura preventiva concreta.",
                "description_ca": "Relacionar un risc amb una mesura preventiva concreta.",
                "evidence_es": "Targetes risc-solució.",
                "evidence_ca": "Targetes risc-solució.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0636_C7_9",
                "title_es": "Mini auditoria",
                "title_ca": "Mini auditoria",
                "description_es": "Revisar si un equip compleix manteniment i eliminació adequada.",
                "description_ca": "Revisar si un equip compleix manteniment i eliminació adequada.",
                "evidence_es": "Rúbrica d’auditoria.",
                "evidence_ca": "Rúbrica d’auditoria.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              }
            ]
          }
        ]
      },
      {
        "id": "0636_RA5",
        "code": "RA5",
        "text_es": "Resultado de aprendizaje 5",
        "text_ca": "Resultat d'aprenentatge 5",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Decoració d’ungles, disseny i comunicació visual",
            "title_ca": "Decoració d’ungles, disseny i comunicació visual",
            "targetModuleCode": "0636",
            "targetModuleName_es": "Estética de manos y pies",
            "targetModuleName_ca": "Estètica de mans i peus",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La decoració d’ungles combina disseny gràfic, selecció de productes decoratius, verificació del resultat segons gustos i comunicació visual o escrita del servei.",
            "justification_ca": "La decoració d’ungles combina disseny gràfic, selecció de productes decoratius, verificació del resultat segons gustos i comunicació visual o escrita del servei.",
            "activities": [
              {
                "id": "act_0636_C8_1",
                "title_es": "Moodboard d’ungles",
                "title_ca": "Moodboard d’ungles",
                "description_es": "Crear un panell d’inspiració per a dissenys d’ungles.",
                "description_ca": "Crear un panell d’inspiració per a dissenys d’ungles.",
                "evidence_es": "Moodboard.",
                "evidence_ca": "Moodboard.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C8_2",
                "title_es": "Carta de dissenys",
                "title_ca": "Carta de dissenys",
                "description_es": "Dissenyar una carta de serveis de decoració d’ungles.",
                "description_ca": "Dissenyar una carta de serveis de decoració d’ungles.",
                "evidence_es": "Carta de dissenys.",
                "evidence_ca": "Carta de dissenys.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C8_3",
                "title_es": "Esmalt i textura",
                "title_ca": "Esmalt i textura",
                "description_es": "Classificar productes decoratius segons textura i tècnica.",
                "description_ca": "Classificar productes decoratius segons textura i tècnica.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0636_C8_4",
                "title_es": "Disseny per clienta",
                "title_ca": "Disseny per clienta",
                "description_es": "Crear un disseny segons gustos i situació d’una clienta.",
                "description_ca": "Crear un disseny segons gustos i situació d’una clienta.",
                "evidence_es": "Proposta gràfica.",
                "evidence_ca": "Proposta gràfica.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0636_C8_5",
                "title_es": "Mini descripció en anglès",
                "title_ca": "Mini descripció en anglès",
                "description_es": "Redactar una frase en anglès per descriure un disseny.",
                "description_ca": "Redactar una frase en anglès per descriure un disseny.",
                "evidence_es": "Targeta bilingüe.",
                "evidence_ca": "Targeta bilingüe.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C8_6",
                "title_es": "Tendència o tècnica?",
                "title_ca": "Tendència o tècnica?",
                "description_es": "Distingir moda de xarxes i viabilitat tècnica.",
                "description_ca": "Distingir moda de xarxes i viabilitat tècnica.",
                "evidence_es": "Anàlisi de tendències.",
                "evidence_ca": "Anàlisi de tendències.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0636_C8_7",
                "title_es": "Verifica el resultat",
                "title_ca": "Verifica el resultat",
                "description_es": "Comparar resultat final amb demanda inicial.",
                "description_ca": "Comparar resultat final amb demanda inicial.",
                "evidence_es": "Fitxa de verificació.",
                "evidence_ca": "Fitxa de verificació.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0636_C8_8",
                "title_es": "Instagram simulat",
                "title_ca": "Instagram simulat",
                "description_es": "Crear un post professional d’un disseny d’ungles.",
                "description_ca": "Crear un post professional d’un disseny d’ungles.",
                "evidence_es": "Post o carrusel.",
                "evidence_ca": "Post o carrusel.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0636_C8_9",
                "title_es": "Client/a vota",
                "title_ca": "Client/a vota",
                "description_es": "Recollir preferències de dissenys i interpretar-les.",
                "description_ca": "Recollir preferències de dissenys i interpretar-les.",
                "evidence_es": "Gràfic de preferències.",
                "evidence_ca": "Gràfic de preferències.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "0638",
    "name_es": "Análisis estético",
    "name_ca": "Anàlisi estètica",
    "type": "especifico",
    "color": "#34d399",
    "icon": "book",
    "learningOutcomes": [
      {
        "id": "0638_RA1",
        "code": "RA1",
        "text_es": "Resultado de aprendizaje 1",
        "text_ca": "Resultat d'aprenentatge 1",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Tipologia cutània i elecció del servei",
            "title_ca": "Tipologia cutània i elecció del servei",
            "targetModuleCode": "0638",
            "targetModuleName_es": "Análisis estético",
            "targetModuleName_ca": "Anàlisi estètica",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "Classificar el tipus de pell i conèixer la reacció al sol és imprescindible per decidir serveis d’higiene, cosmètics adequats i explicar-los correctament a la clientela.",
            "justification_ca": "Classificar el tipus de pell i conèixer la reacció al sol és imprescindible per decidir serveis d’higiene, cosmètics adequats i explicar-los correctament a la clientela.",
            "activities": [
              {
                "id": "act_0638_C1_1",
                "title_es": "Pell en targetes",
                "title_ca": "Pell en targetes",
                "description_es": "Classificar casos de pell segons emulsió epicutània i sensibilitat solar.",
                "description_ca": "Classificar casos de pell segons emulsió epicutània i sensibilitat solar.",
                "evidence_es": "Taula de classificació.",
                "evidence_ca": "Taula de classificació.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0638_C1_2",
                "title_es": "Assessorament en 60 segons",
                "title_ca": "Assessorament en 60 segons",
                "description_es": "Explicar a una clienta el seu tipus de pell i una pauta bàsica.",
                "description_ca": "Explicar a una clienta el seu tipus de pell i una pauta bàsica.",
                "evidence_es": "Guió oral.",
                "evidence_ca": "Guió oral.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C1_3",
                "title_es": "Cosmètic coherent",
                "title_ca": "Cosmètic coherent",
                "description_es": "Triar un cosmètic d’higiene per a cada tipologia cutània.",
                "description_ca": "Triar un cosmètic d’higiene per a cada tipologia cutània.",
                "evidence_es": "Fitxa de recomanació.",
                "evidence_ca": "Fitxa de recomanació.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C1_4",
                "title_es": "Sun alert",
                "title_ca": "Sun alert",
                "description_es": "Crear frases senzilles sobre pell i sol, també en anglès funcional.",
                "description_ca": "Crear frases senzilles sobre pell i sol, també en anglès funcional.",
                "evidence_es": "Targeta bilingüe.",
                "evidence_ca": "Targeta bilingüe.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C1_5",
                "title_es": "Mite o veritat",
                "title_ca": "Mite o veritat",
                "description_es": "Desmuntar mites sobre pell greixosa, seca, mixta i sol.",
                "description_ca": "Desmuntar mites sobre pell greixosa, seca, mixta i sol.",
                "evidence_es": "Targetes mite/veritat.",
                "evidence_ca": "Targetes mite/veritat.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0638_C1_6",
                "title_es": "Mapa de pell",
                "title_ca": "Mapa de pell",
                "description_es": "Fer un mapa visual de tipus de pell i necessitats.",
                "description_ca": "Fer un mapa visual de tipus de pell i necessitats.",
                "evidence_es": "Mural de tipologies.",
                "evidence_ca": "Mural de tipologies.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0638_C1_7",
                "title_es": "Client/a influencer",
                "title_ca": "Client/a influencer",
                "description_es": "Aconsellar una persona que segueix rutines virals no adequades.",
                "description_ca": "Aconsellar una persona que segueix rutines virals no adequades.",
                "evidence_es": "Diàleg professional.",
                "evidence_ca": "Diàleg professional.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C1_8",
                "title_es": "Semàfor solar",
                "title_ca": "Semàfor solar",
                "description_es": "Classificar conductes davant el sol segons risc.",
                "description_ca": "Classificar conductes davant el sol segons risc.",
                "evidence_es": "Semàfor de consells.",
                "evidence_ca": "Semàfor de consells.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0638_C1_9",
                "title_es": "Quiz cutani",
                "title_ca": "Quiz cutani",
                "description_es": "Crear un qüestionari ràpid per repassar tipologies cutànies.",
                "description_ca": "Crear un qüestionari ràpid per repassar tipologies cutànies.",
                "evidence_es": "Quiz de classe.",
                "evidence_ca": "Quiz de classe.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              }
            ]
          }
        ]
      },
      {
        "id": "0638_RA2",
        "code": "RA2",
        "text_es": "Resultado de aprendizaje 2",
        "text_ca": "Resultat d'aprenentatge 2",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Alteracions, contraindicacions i derivació professional",
            "title_ca": "Alteracions, contraindicacions i derivació professional",
            "targetModuleCode": "0638",
            "targetModuleName_es": "Análisis estético",
            "targetModuleName_ca": "Anàlisi estètica",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "L’anàlisi estètica ha de detectar alteracions que poden condicionar o contraindicar serveis d’higiene, depilació o altres tractaments, i aplicar criteris de derivació i prevenció.",
            "justification_ca": "L’anàlisi estètica ha de detectar alteracions que poden condicionar o contraindicar serveis d’higiene, depilació o altres tractaments, i aplicar criteris de derivació i prevenció.",
            "activities": [
              {
                "id": "act_0638_C2_1",
                "title_es": "Semàfor de contraindicacions",
                "title_ca": "Semàfor de contraindicacions",
                "description_es": "Classificar casos en apte, precaució o derivació.",
                "description_ca": "Classificar casos en apte, precaució o derivació.",
                "evidence_es": "Taula semàfor.",
                "evidence_ca": "Taula semàfor.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0638_C2_2",
                "title_es": "Detectives d’alteracions",
                "title_ca": "Detectives d’alteracions",
                "description_es": "Reconèixer lesions o alteracions bàsiques en imatges didàctiques.",
                "description_ca": "Reconèixer lesions o alteracions bàsiques en imatges didàctiques.",
                "evidence_es": "Fitxa d’observació.",
                "evidence_ca": "Fitxa d’observació.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0638_C2_3",
                "title_es": "Derivar amb respecte",
                "title_ca": "Derivar amb respecte",
                "description_es": "Practicar com comunicar una derivació sense alarmar.",
                "description_ca": "Practicar com comunicar una derivació sense alarmar.",
                "evidence_es": "Guió professional.",
                "evidence_ca": "Guió professional.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C2_4",
                "title_es": "No faig el servei perquè...",
                "title_ca": "No faig el servei perquè...",
                "description_es": "Justificar tècnicament la no realització d’un servei.",
                "description_ca": "Justificar tècnicament la no realització d’un servei.",
                "evidence_es": "Informe breu.",
                "evidence_ca": "Informe breu.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0638_C2_5",
                "title_es": "Pell i depilació",
                "title_ca": "Pell i depilació",
                "description_es": "Relacionar alteracions vasculars o cutànies amb riscos en depilació.",
                "description_ca": "Relacionar alteracions vasculars o cutànies amb riscos en depilació.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0638_C2_6",
                "title_es": "Protocol d’alerta",
                "title_ca": "Protocol d’alerta",
                "description_es": "Crear un protocol senzill davant una alteració sospitosa.",
                "description_ca": "Crear un protocol senzill davant una alteració sospitosa.",
                "evidence_es": "Protocol visual.",
                "evidence_ca": "Protocol visual.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C2_7",
                "title_es": "Errors de decisió",
                "title_ca": "Errors de decisió",
                "description_es": "Analitzar decisions incorrectes davant contraindicacions.",
                "description_ca": "Analitzar decisions incorrectes davant contraindicacions.",
                "evidence_es": "Correccions argumentades.",
                "evidence_ca": "Correccions argumentades.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0638_C2_8",
                "title_es": "Dossier visual",
                "title_ca": "Dossier visual",
                "description_es": "Crear un dossier d’alteracions que afecten serveis estètics.",
                "description_ca": "Crear un dossier d’alteracions que afecten serveis estètics.",
                "evidence_es": "Dossier d’imatges comentades.",
                "evidence_ca": "Dossier d’imatges comentades.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0638_C2_9",
                "title_es": "Risc i prevenció",
                "title_ca": "Risc i prevenció",
                "description_es": "Relacionar alteració, risc i mesura preventiva.",
                "description_ca": "Relacionar alteració, risc i mesura preventiva.",
                "evidence_es": "Targetes risc-solució.",
                "evidence_ca": "Targetes risc-solució.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              }
            ]
          },
          {
            "title_es": "Anàlisi de mans, peus i ungles",
            "title_ca": "Anàlisi de mans, peus i ungles",
            "targetModuleCode": "0638",
            "targetModuleName_es": "Análisis estético",
            "targetModuleName_ca": "Anàlisi estètica",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "Les alteracions de mans, peus i ungles condicionen manicura, pedicura i altres serveis; cal observar morfologia, registrar dades i vincular-les amb anatomia bàsica.",
            "justification_ca": "Les alteracions de mans, peus i ungles condicionen manicura, pedicura i altres serveis; cal observar morfologia, registrar dades i vincular-les amb anatomia bàsica.",
            "activities": [
              {
                "id": "act_0638_C3_1",
                "title_es": "Fitxa mans-peus",
                "title_ca": "Fitxa mans-peus",
                "description_es": "Crear una fitxa específica d’anàlisi de mans, peus i ungles.",
                "description_ca": "Crear una fitxa específica d’anàlisi de mans, peus i ungles.",
                "evidence_es": "Fitxa tècnica.",
                "evidence_ca": "Fitxa tècnica.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C3_2",
                "title_es": "Observació d’ungles",
                "title_ca": "Observació d’ungles",
                "description_es": "Identificar característiques visibles que poden condicionar el servei.",
                "description_ca": "Identificar característiques visibles que poden condicionar el servei.",
                "evidence_es": "Registre d’observació.",
                "evidence_ca": "Registre d’observació.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0638_C3_3",
                "title_es": "Peu o mà?",
                "title_ca": "Peu o mà?",
                "description_es": "Relacionar morfologia amb necessitats de manicura o pedicura.",
                "description_ca": "Relacionar morfologia amb necessitats de manicura o pedicura.",
                "evidence_es": "Taula de relacions.",
                "evidence_ca": "Taula de relacions.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0638_C3_4",
                "title_es": "Cas de pedicura",
                "title_ca": "Cas de pedicura",
                "description_es": "Decidir si una pedicura és adequada segons l’observació inicial.",
                "description_ca": "Decidir si una pedicura és adequada segons l’observació inicial.",
                "evidence_es": "Decisió tècnica.",
                "evidence_ca": "Decisió tècnica.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0638_C3_5",
                "title_es": "Anatomia aplicada",
                "title_ca": "Anatomia aplicada",
                "description_es": "Assenyalar estructures de mà i peu que influeixen en el tractament.",
                "description_ca": "Assenyalar estructures de mà i peu que influeixen en el tractament.",
                "evidence_es": "Esquema anatòmic.",
                "evidence_ca": "Esquema anatòmic.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0638_C3_6",
                "title_es": "Client/a amb demanda",
                "title_ca": "Client/a amb demanda",
                "description_es": "Fer entrevista i registre per a un servei de mans o peus.",
                "description_ca": "Fer entrevista i registre per a un servei de mans o peus.",
                "evidence_es": "Fitxa completada.",
                "evidence_ca": "Fitxa completada.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C3_7",
                "title_es": "Abans de decorar",
                "title_ca": "Abans de decorar",
                "description_es": "Determinar què cal analitzar abans de decorar una ungla.",
                "description_ca": "Determinar què cal analitzar abans de decorar una ungla.",
                "evidence_es": "Checklist prèvia.",
                "evidence_ca": "Checklist prèvia.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C3_8",
                "title_es": "Alteració i adaptació",
                "title_ca": "Alteració i adaptació",
                "description_es": "Proposar adaptacions davant alteracions senzilles.",
                "description_ca": "Proposar adaptacions davant alteracions senzilles.",
                "evidence_es": "Proposta adaptada.",
                "evidence_ca": "Proposta adaptada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0638_C3_9",
                "title_es": "Revisió creuada",
                "title_ca": "Revisió creuada",
                "description_es": "Coavaluar fitxes d’anàlisi de mans i peus.",
                "description_ca": "Coavaluar fitxes d’anàlisi de mans i peus.",
                "evidence_es": "Fitxa millorada.",
                "evidence_ca": "Fitxa millorada.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              }
            ]
          }
        ]
      },
      {
        "id": "0638_RA3",
        "code": "RA3",
        "text_es": "Resultado de aprendizaje 3",
        "text_ca": "Resultat d'aprenentatge 3",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Aparatologia d’anàlisi i seguretat d’ús",
            "title_ca": "Aparatologia d’anàlisi i seguretat d’ús",
            "targetModuleCode": "0638",
            "targetModuleName_es": "Análisis estético",
            "targetModuleName_ca": "Anàlisi estètica",
            "targetRaCode": "RA3",
            "targetRaText_es": "Resultado de aprendizaje 3",
            "targetRaText_ca": "Resultat d'aprenentatge 3",
            "relationType": "tecnica",
            "justification_es": "La utilització d’equips d’anàlisi requereix classificar aparells, aplicar normes de seguretat, comprovar funcionament i entendre el paper de la tecnologia en el servei.",
            "justification_ca": "La utilització d’equips d’anàlisi requereix classificar aparells, aplicar normes de seguretat, comprovar funcionament i entendre el paper de la tecnologia en el servei.",
            "activities": [
              {
                "id": "act_0638_C4_1",
                "title_es": "Fitxa d’aparell",
                "title_ca": "Fitxa d’aparell",
                "description_es": "Crear una fitxa d’ús segur d’un equip d’anàlisi.",
                "description_ca": "Crear una fitxa d’ús segur d’un equip d’anàlisi.",
                "evidence_es": "Fitxa tècnica.",
                "evidence_ca": "Fitxa tècnica.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C4_2",
                "title_es": "Aparell misteriós",
                "title_ca": "Aparell misteriós",
                "description_es": "Identificar funció i precaucions d’un aparell a partir d’imatges.",
                "description_ca": "Identificar funció i precaucions d’un aparell a partir d’imatges.",
                "evidence_es": "Classificació d’aparells.",
                "evidence_ca": "Classificació d’aparells.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C4_3",
                "title_es": "Checklist abans d’usar",
                "title_ca": "Checklist abans d’usar",
                "description_es": "Crear una llista de comprovació de funcionament i seguretat.",
                "description_ca": "Crear una llista de comprovació de funcionament i seguretat.",
                "evidence_es": "Checklist.",
                "evidence_ca": "Checklist.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C4_4",
                "title_es": "Tecnologia útil",
                "title_ca": "Tecnologia útil",
                "description_es": "Decidir quin aparell ajuda en diferents casos de pell.",
                "description_ca": "Decidir quin aparell ajuda en diferents casos de pell.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0638_C4_5",
                "title_es": "Error d’ús",
                "title_ca": "Error d’ús",
                "description_es": "Detectar usos incorrectes d’aparatologia en una simulació.",
                "description_ca": "Detectar usos incorrectes d’aparatologia en una simulació.",
                "evidence_es": "Informe de correcció.",
                "evidence_ca": "Informe de correcció.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C4_6",
                "title_es": "Demo segura",
                "title_ca": "Demo segura",
                "description_es": "Preparar una demostració oral d’ús d’un equip.",
                "description_ca": "Preparar una demostració oral d’ús d’un equip.",
                "evidence_es": "Guió de demo.",
                "evidence_ca": "Guió de demo.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0638_C4_7",
                "title_es": "Aparell i prevenció",
                "title_ca": "Aparell i prevenció",
                "description_es": "Relacionar un risc d’aparell amb una mesura preventiva.",
                "description_ca": "Relacionar un risc d’aparell amb una mesura preventiva.",
                "evidence_es": "Targetes risc-prevenció.",
                "evidence_ca": "Targetes risc-prevenció.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0638_C4_8",
                "title_es": "Servei 4.0",
                "title_ca": "Servei 4.0",
                "description_es": "Proposar una millora digital per al servei d’anàlisi estètica.",
                "description_ca": "Proposar una millora digital per al servei d’anàlisi estètica.",
                "evidence_es": "Proposta de millora.",
                "evidence_ca": "Proposta de millora.",
                "diversitySupport_es": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics.",
                "diversitySupport_ca": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics."
              },
              {
                "id": "act_0638_C4_9",
                "title_es": "Manual jove",
                "title_ca": "Manual jove",
                "description_es": "Redactar instruccions d’ús comprensibles per a alumnat nou.",
                "description_ca": "Redactar instruccions d’ús comprensibles per a alumnat nou.",
                "evidence_es": "Mini manual visual.",
                "evidence_ca": "Mini manual visual.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              }
            ]
          },
          {
            "title_es": "Normes de seguretat, higiene i manteniment d’equips",
            "title_ca": "Normes de seguretat, higiene i manteniment d’equips",
            "targetModuleCode": "0638",
            "targetModuleName_es": "Análisis estético",
            "targetModuleName_ca": "Anàlisi estètica",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "L’ús d’aparells d’anàlisi i tractament exigeix manteniment, higiene, desinfecció i protecció de client i professional.",
            "justification_ca": "L’ús d’aparells d’anàlisi i tractament exigeix manteniment, higiene, desinfecció i protecció de client i professional.",
            "activities": [
              {
                "id": "act_0638_C7_1",
                "title_es": "Protocol neteja equip",
                "title_ca": "Protocol neteja equip",
                "description_es": "Crear un protocol de neteja i manteniment d’un aparell.",
                "description_ca": "Crear un protocol de neteja i manteniment d’un aparell.",
                "evidence_es": "Checklist de manteniment.",
                "evidence_ca": "Checklist de manteniment.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C7_2",
                "title_es": "Abans-durant-després",
                "title_ca": "Abans-durant-després",
                "description_es": "Distingir mesures de seguretat en cada moment d’ús.",
                "description_ca": "Distingir mesures de seguretat en cada moment d’ús.",
                "evidence_es": "Taula temporal.",
                "evidence_ca": "Taula temporal.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0638_C7_3",
                "title_es": "Equip segur?",
                "title_ca": "Equip segur?",
                "description_es": "Revisar si un equip està en condicions d’ús.",
                "description_ca": "Revisar si un equip està en condicions d’ús.",
                "evidence_es": "Fitxa de revisió.",
                "evidence_ca": "Fitxa de revisió.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0638_C7_4",
                "title_es": "Risc i solució",
                "title_ca": "Risc i solució",
                "description_es": "Relacionar riscos amb mesures preventives.",
                "description_ca": "Relacionar riscos amb mesures preventives.",
                "evidence_es": "Targetes risc-solució.",
                "evidence_ca": "Targetes risc-solució.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0638_C7_5",
                "title_es": "Manual d’higiene",
                "title_ca": "Manual d’higiene",
                "description_es": "Redactar instruccions visuals de desinfecció d’un equip.",
                "description_ca": "Redactar instruccions visuals de desinfecció d’un equip.",
                "evidence_es": "Manual d’higiene.",
                "evidence_ca": "Manual d’higiene.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0638_C7_6",
                "title_es": "Simulacre d’incidència",
                "title_ca": "Simulacre d’incidència",
                "description_es": "Decidir què fer si un aparell presenta una incidència.",
                "description_ca": "Decidir què fer si un aparell presenta una incidència.",
                "evidence_es": "Resposta professional.",
                "evidence_ca": "Resposta professional.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C7_7",
                "title_es": "Comparteix o no?",
                "title_ca": "Comparteix o no?",
                "description_es": "Decidir quins útils/equips requereixen desinfecció estricta.",
                "description_ca": "Decidir quins útils/equips requereixen desinfecció estricta.",
                "evidence_es": "Taula de decisió.",
                "evidence_ca": "Taula de decisió.",
                "diversitySupport_es": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació.",
                "diversitySupport_ca": "Es proporciona una taula amb categories predefinides i exemples; els equips poden usar colors, adhesius o imatges dels productes per classificar abans d’escriure la justificació."
              },
              {
                "id": "act_0638_C7_8",
                "title_es": "Inspector/a d’equips",
                "title_ca": "Inspector/a d’equips",
                "description_es": "Coavaluar manteniment i seguretat d’un equip.",
                "description_ca": "Coavaluar manteniment i seguretat d’un equip.",
                "evidence_es": "Rúbrica d’equip.",
                "evidence_ca": "Rúbrica d’equip.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C7_9",
                "title_es": "Pòster de seguretat",
                "title_ca": "Pòster de seguretat",
                "description_es": "Crear un cartell per recordar normes d’ús d’aparells.",
                "description_ca": "Crear un cartell per recordar normes d’ús d’aparells.",
                "evidence_es": "Pòster per aula.",
                "evidence_ca": "Pòster per aula.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              }
            ]
          }
        ]
      },
      {
        "id": "0638_RA4",
        "code": "RA4",
        "text_es": "Resultado de aprendizaje 4",
        "text_ca": "Resultat d'aprenentatge 4",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Entrevista, exploració i proposta d’anàlisi",
            "title_ca": "Entrevista, exploració i proposta d’anàlisi",
            "targetModuleCode": "0638",
            "targetModuleName_es": "Análisis estético",
            "targetModuleName_ca": "Anàlisi estètica",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "L’anàlisi estètica professional combina fases ordenades, entrevista, exploració i proposta d’anàlisi, amb comunicació adequada i actitud professional.",
            "justification_ca": "L’anàlisi estètica professional combina fases ordenades, entrevista, exploració i proposta d’anàlisi, amb comunicació adequada i actitud professional.",
            "activities": [
              {
                "id": "act_0638_C5_1",
                "title_es": "Entrevista professional",
                "title_ca": "Entrevista professional",
                "description_es": "Fer una entrevista inicial d’anàlisi estètica.",
                "description_ca": "Fer una entrevista inicial d’anàlisi estètica.",
                "evidence_es": "Qüestionari completat.",
                "evidence_ca": "Qüestionari completat.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C5_2",
                "title_es": "Fases desordenades",
                "title_ca": "Fases desordenades",
                "description_es": "Ordenar les fases del procediment d’anàlisi.",
                "description_ca": "Ordenar les fases del procediment d’anàlisi.",
                "evidence_es": "Seqüència correcta.",
                "evidence_ca": "Seqüència correcta.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0638_C5_3",
                "title_es": "Proposta d’anàlisi",
                "title_ca": "Proposta d’anàlisi",
                "description_es": "Redactar una proposta d’anàlisi després d’una entrevista.",
                "description_ca": "Redactar una proposta d’anàlisi després d’una entrevista.",
                "evidence_es": "Proposta escrita.",
                "evidence_ca": "Proposta escrita.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C5_4",
                "title_es": "English first contact",
                "title_ca": "English first contact",
                "description_es": "Practicar una acollida bàsica en anglès per a l’anàlisi.",
                "description_ca": "Practicar una acollida bàsica en anglès per a l’anàlisi.",
                "evidence_es": "Diàleg breu.",
                "evidence_ca": "Diàleg breu.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C5_5",
                "title_es": "Escolta activa",
                "title_ca": "Escolta activa",
                "description_es": "Reformular la demanda de la clientela amb llenguatge professional.",
                "description_ca": "Reformular la demanda de la clientela amb llenguatge professional.",
                "evidence_es": "Registre de demanda.",
                "evidence_ca": "Registre de demanda.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C5_6",
                "title_es": "Fitxa millorada",
                "title_ca": "Fitxa millorada",
                "description_es": "Redissenyar una fitxa d’entrevista perquè sigui útil i clara.",
                "description_ca": "Redissenyar una fitxa d’entrevista perquè sigui útil i clara.",
                "evidence_es": "Fitxa d’entrevista.",
                "evidence_ca": "Fitxa d’entrevista.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C5_7",
                "title_es": "Cas complet",
                "title_ca": "Cas complet",
                "description_es": "Analitzar un cas i proposar els passos d’exploració.",
                "description_ca": "Analitzar un cas i proposar els passos d’exploració.",
                "evidence_es": "Pla d’anàlisi.",
                "evidence_ca": "Pla d’anàlisi.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0638_C5_8",
                "title_es": "Actitud professional",
                "title_ca": "Actitud professional",
                "description_es": "Detectar conductes adequades o inadequades en l’entrevista.",
                "description_ca": "Detectar conductes adequades o inadequades en l’entrevista.",
                "evidence_es": "Llista de conductes.",
                "evidence_ca": "Llista de conductes.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C5_9",
                "title_es": "Briefing d’anàlisi",
                "title_ca": "Briefing d’anàlisi",
                "description_es": "Explicar en 60 segons què es farà i per què.",
                "description_ca": "Explicar en 60 segons què es farà i per què.",
                "evidence_es": "Guió oral.",
                "evidence_ca": "Guió oral.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              }
            ]
          }
        ]
      },
      {
        "id": "0638_RA5",
        "code": "RA5",
        "text_es": "Resultado de aprendizaje 5",
        "text_ca": "Resultat d'aprenentatge 5",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Aparatologia de tractaments bàsics",
            "title_ca": "Aparatologia de tractaments bàsics",
            "targetModuleCode": "0638",
            "targetModuleName_es": "Análisis estético",
            "targetModuleName_ca": "Anàlisi estètica",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "L’alumnat ha de reconèixer aparells emprats en higiene, depilació i mans-peus, entendre’n l’ús i seleccionar l’equip adequat segons el tractament.",
            "justification_ca": "L’alumnat ha de reconèixer aparells emprats en higiene, depilació i mans-peus, entendre’n l’ús i seleccionar l’equip adequat segons el tractament.",
            "activities": [
              {
                "id": "act_0638_C6_1",
                "title_es": "Galeria d’aparells",
                "title_ca": "Galeria d’aparells",
                "description_es": "Classificar aparells segons servei: higiene, depilació o mans-peus.",
                "description_ca": "Classificar aparells segons servei: higiene, depilació o mans-peus.",
                "evidence_es": "Galeria comentada.",
                "evidence_ca": "Galeria comentada.",
                "diversitySupport_es": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses.",
                "diversitySupport_ca": "Es faciliten exemples visuals, banc d’icones i una graella de disseny; es permet repartir rols entre redacció, dibuix, maquetació i revisió perquè cada alumne/a contribueixi segons les seves fortaleses."
              },
              {
                "id": "act_0638_C6_2",
                "title_es": "Quin aparell triaries?",
                "title_ca": "Quin aparell triaries?",
                "description_es": "Seleccionar equip per a un tractament concret.",
                "description_ca": "Seleccionar equip per a un tractament concret.",
                "evidence_es": "Decisió tècnica.",
                "evidence_ca": "Decisió tècnica.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0638_C6_3",
                "title_es": "Fitxa comparativa",
                "title_ca": "Fitxa comparativa",
                "description_es": "Comparar dos aparells pel seu ús, efectes i precaucions.",
                "description_ca": "Comparar dos aparells pel seu ús, efectes i precaucions.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C6_4",
                "title_es": "Aparell i tractament",
                "title_ca": "Aparell i tractament",
                "description_es": "Relacionar aparatologia amb el resultat esperat.",
                "description_ca": "Relacionar aparatologia amb el resultat esperat.",
                "evidence_es": "Targetes aparell-resultat.",
                "evidence_ca": "Targetes aparell-resultat.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              },
              {
                "id": "act_0638_C6_5",
                "title_es": "Mini fira d’equips",
                "title_ca": "Mini fira d’equips",
                "description_es": "Cada equip presenta un aparell a la resta de la classe.",
                "description_ca": "Cada equip presenta un aparell a la resta de la classe.",
                "evidence_es": "Microstand.",
                "evidence_ca": "Microstand.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C6_6",
                "title_es": "Selecció impossible",
                "title_ca": "Selecció impossible",
                "description_es": "Detectar aparells inadequats per a un cas concret.",
                "description_ca": "Detectar aparells inadequats per a un cas concret.",
                "evidence_es": "Informe de descart.",
                "evidence_ca": "Informe de descart.",
                "diversitySupport_es": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa.",
                "diversitySupport_ca": "Els casos es presenten amb informació graduada i ressaltada; l’alumnat disposa d’un arbre de decisió i pot justificar amb paraules clau abans de redactar la resposta completa."
              },
              {
                "id": "act_0638_C6_7",
                "title_es": "Protocol d’equip",
                "title_ca": "Protocol d’equip",
                "description_es": "Redactar un protocol bàsic d’ús d’un aparell.",
                "description_ca": "Redactar un protocol bàsic d’ús d’un aparell.",
                "evidence_es": "Protocol breu.",
                "evidence_ca": "Protocol breu.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C6_8",
                "title_es": "Mapa de cabina",
                "title_ca": "Mapa de cabina",
                "description_es": "Ubicar aparells en una cabina segons servei i seguretat.",
                "description_ca": "Ubicar aparells en una cabina segons servei i seguretat.",
                "evidence_es": "Plànol de cabina.",
                "evidence_ca": "Plànol de cabina.",
                "diversitySupport_es": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net.",
                "diversitySupport_ca": "Es dona un esquema parcialment completat i paraules clau per col·locar; l’alumnat pot construir el mapa amb retalls, adhesius o format digital abans de passar-lo a net."
              },
              {
                "id": "act_0638_C6_9",
                "title_es": "Quiz d’aparells",
                "title_ca": "Quiz d’aparells",
                "description_es": "Crear preguntes tipus quiz per repassar aparatologia.",
                "description_ca": "Crear preguntes tipus quiz per repassar aparatologia.",
                "evidence_es": "Quiz cooperatiu.",
                "evidence_ca": "Quiz cooperatiu.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              }
            ]
          }
        ]
      },
      {
        "id": "0638_RA6",
        "code": "RA6",
        "text_es": "Resultado de aprendizaje 6",
        "text_ca": "Resultat d'aprenentatge 6",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Deontologia, protecció de dades i relació professional",
            "title_ca": "Deontologia, protecció de dades i relació professional",
            "targetModuleCode": "0638",
            "targetModuleName_es": "Análisis estético",
            "targetModuleName_ca": "Anàlisi estètica",
            "targetRaCode": "RA6",
            "targetRaText_es": "Resultado de aprendizaje 6",
            "targetRaText_ca": "Resultat d'aprenentatge 6",
            "relationType": "tecnica",
            "justification_es": "La professió estètica implica deontologia, secret professional, protecció de dades i comunicació escrita responsable, també quan es digitalitzen fitxes o es redacten missatges a la clientela.",
            "justification_ca": "La professió estètica implica deontologia, secret professional, protecció de dades i comunicació escrita responsable, també quan es digitalitzen fitxes o es redacten missatges a la clientela.",
            "activities": [
              {
                "id": "act_0638_C8_1",
                "title_es": "Cas de confidencialitat",
                "title_ca": "Cas de confidencialitat",
                "description_es": "Decidir si es pot compartir una informació de client/a.",
                "description_ca": "Decidir si es pot compartir una informació de client/a.",
                "evidence_es": "Decisió argumentada.",
                "evidence_ca": "Decisió argumentada.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C8_2",
                "title_es": "Decàleg deontològic",
                "title_ca": "Decàleg deontològic",
                "description_es": "Crear deu normes de conducta professional en cabina.",
                "description_ca": "Crear deu normes de conducta professional en cabina.",
                "evidence_es": "Decàleg.",
                "evidence_ca": "Decàleg.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C8_3",
                "title_es": "Dades sensibles",
                "title_ca": "Dades sensibles",
                "description_es": "Identificar dades personals que cal protegir en una fitxa.",
                "description_ca": "Identificar dades personals que cal protegir en una fitxa.",
                "evidence_es": "Llista de dades sensibles.",
                "evidence_ca": "Llista de dades sensibles.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C8_4",
                "title_es": "Missatge correcte",
                "title_ca": "Missatge correcte",
                "description_es": "Redactar un missatge professional sense vulnerar privacitat.",
                "description_ca": "Redactar un missatge professional sense vulnerar privacitat.",
                "evidence_es": "Missatge model.",
                "evidence_ca": "Missatge model.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C8_5",
                "title_es": "Fitxa digital segura",
                "title_ca": "Fitxa digital segura",
                "description_es": "Proposar mesures per protegir fitxes digitals.",
                "description_ca": "Proposar mesures per protegir fitxes digitals.",
                "evidence_es": "Protocol bàsic.",
                "evidence_ca": "Protocol bàsic.",
                "diversitySupport_es": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes.",
                "diversitySupport_ca": "Es proporciona una plantilla amb camps obligatoris marcats, un exemple ja emplenat i una versió amb pictogrames; l’alumnat amb dificultats d’escriptura pot dictar les respostes o completar només paraules clau abans de redactar frases completes."
              },
              {
                "id": "act_0638_C8_6",
                "title_es": "Què faria jo?",
                "title_ca": "Què faria jo?",
                "description_es": "Resoldre dilemes deontològics senzills.",
                "description_ca": "Resoldre dilemes deontològics senzills.",
                "evidence_es": "Solució consensuada.",
                "evidence_ca": "Solució consensuada.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0638_C8_7",
                "title_es": "Secreto profesional",
                "title_ca": "Secreto profesional",
                "description_es": "Explicar el secret professional amb exemples reals de cabina.",
                "description_ca": "Explicar el secret professional amb exemples reals de cabina.",
                "evidence_es": "Exemples comentats.",
                "evidence_ca": "Exemples comentats.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0638_C8_8",
                "title_es": "Normes en anglès",
                "title_ca": "Normes en anglès",
                "description_es": "Redactar dues normes bàsiques de privacitat en anglès senzill.",
                "description_ca": "Redactar dues normes bàsiques de privacitat en anglès senzill.",
                "evidence_es": "Targeta bilingüe.",
                "evidence_ca": "Targeta bilingüe.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C8_9",
                "title_es": "Semàfor ètic",
                "title_ca": "Semàfor ètic",
                "description_es": "Classificar conductes professionals com a correctes, dubtoses o incorrectes.",
                "description_ca": "Classificar conductes professionals com a correctes, dubtoses o incorrectes.",
                "evidence_es": "Mural semàfor.",
                "evidence_ca": "Mural semàfor.",
                "diversitySupport_es": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual.",
                "diversitySupport_ca": "Les normes del joc es presenten oralment i per escrit, amb una ronda de prova; les targetes incorporen colors i icones, i es permet respondre en equip per reduir la pressió individual."
              }
            ]
          },
          {
            "title_es": "Qualitat, actitud professional i millora contínua",
            "title_ca": "Qualitat, actitud professional i millora contínua",
            "targetModuleCode": "0638",
            "targetModuleName_es": "Análisis estético",
            "targetModuleName_ca": "Anàlisi estètica",
            "targetRaCode": "RA6",
            "targetRaText_es": "Resultado de aprendizaje 6",
            "targetRaText_ca": "Resultat d'aprenentatge 6",
            "relationType": "tecnica",
            "justification_es": "L’actitud professional, el respecte a les persones, la qualitat percebuda i el pla de millora personal connecten l’anàlisi estètica amb l’ocupabilitat i la satisfacció de la clientela.",
            "justification_ca": "L’actitud professional, el respecte a les persones, la qualitat percebuda i el pla de millora personal connecten l’anàlisi estètica amb l’ocupabilitat i la satisfacció de la clientela.",
            "activities": [
              {
                "id": "act_0638_C9_1",
                "title_es": "Professional ideal",
                "title_ca": "Professional ideal",
                "description_es": "Definir qualitats d’un/a professional d’estètica.",
                "description_ca": "Definir qualitats d’un/a professional d’estètica.",
                "evidence_es": "Perfil professional.",
                "evidence_ca": "Perfil professional.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0638_C9_2",
                "title_es": "Enquesta de respecte",
                "title_ca": "Enquesta de respecte",
                "description_es": "Crear ítems per valorar tracte, respecte i confiança.",
                "description_ca": "Crear ítems per valorar tracte, respecte i confiança.",
                "evidence_es": "Enquesta breu.",
                "evidence_ca": "Enquesta breu.",
                "diversitySupport_es": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics.",
                "diversitySupport_ca": "Es dona una plantilla digital ja creada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un company/a tutor i se centra en introduir dades i interpretar resultats bàsics."
              },
              {
                "id": "act_0638_C9_3",
                "title_es": "Feedback amable",
                "title_ca": "Feedback amable",
                "description_es": "Practicar com donar i rebre feedback professional.",
                "description_ca": "Practicar com donar i rebre feedback professional.",
                "evidence_es": "Guió de feedback.",
                "evidence_ca": "Guió de feedback.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C9_4",
                "title_es": "DAFO professional",
                "title_ca": "DAFO professional",
                "description_es": "Identificar fortaleses i millores personals en cabina.",
                "description_ca": "Identificar fortaleses i millores personals en cabina.",
                "evidence_es": "Mini DAFO.",
                "evidence_ca": "Mini DAFO.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C9_5",
                "title_es": "Client/a satisfet/a",
                "title_ca": "Client/a satisfet/a",
                "description_es": "Relacionar actitud professional amb satisfacció del client.",
                "description_ca": "Relacionar actitud professional amb satisfacció del client.",
                "evidence_es": "Informe breu.",
                "evidence_ca": "Informe breu.",
                "diversitySupport_es": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, guions amb frases iniciadores i temps d’assaig previ; qui tingui ansietat davant el grup pot representar-ho en parella, gravar un àudio o fer el rol d’observador/a amb rúbrica."
              },
              {
                "id": "act_0638_C9_6",
                "title_es": "Pla de millora",
                "title_ca": "Pla de millora",
                "description_es": "Triar una millora personal i planificar-la.",
                "description_ca": "Triar una millora personal i planificar-la.",
                "evidence_es": "Pla d’acció.",
                "evidence_ca": "Pla d’acció.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C9_7",
                "title_es": "Conducta correcta?",
                "title_ca": "Conducta correcta?",
                "description_es": "Analitzar situacions de respecte o manca de respecte.",
                "description_ca": "Analitzar situacions de respecte o manca de respecte.",
                "evidence_es": "Correcció proposada.",
                "evidence_ca": "Correcció proposada.",
                "diversitySupport_es": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat.",
                "diversitySupport_ca": "La tasca es divideix en passos visibles a la pissarra, amb model de producte final i opcions de resposta oral, escrita o visual; l’avaluació prioritza l’aplicació professional del criteri treballat."
              },
              {
                "id": "act_0638_C9_8",
                "title_es": "Portafoli d’actitud",
                "title_ca": "Portafoli d’actitud",
                "description_es": "Recollir evidències d’actitud professional al llarg d’una pràctica.",
                "description_ca": "Recollir evidències d’actitud professional al llarg d’una pràctica.",
                "evidence_es": "Entrada de portafoli.",
                "evidence_ca": "Entrada de portafoli.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia; es fan parelles de suport i es valora la millora progressiva, no només el resultat final de la tècnica."
              },
              {
                "id": "act_0638_C9_9",
                "title_es": "Pitch professional",
                "title_ca": "Pitch professional",
                "description_es": "Presentar-se com a futur/a professional d’estètica.",
                "description_ca": "Presentar-se com a futur/a professional d’estètica.",
                "evidence_es": "Pitch de 60 segons.",
                "evidence_ca": "Pitch de 60 segons.",
                "diversitySupport_es": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es lliura una estructura de parla de tres parts i targetes de suport; es pot presentar assegut/uda, en parella o amb suport visual per reduir la càrrega memorística."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "0640",
    "name_es": "Imagen corporal y hábitos saludables",
    "name_ca": "Imatge corporal i hàbits saludables",
    "type": "especifico",
    "color": "#38bdf8",
    "icon": "book",
    "learningOutcomes": [
      {
        "id": "0640_RA1",
        "code": "RA1",
        "text_es": "Resultado de aprendizaje 1",
        "text_ca": "Resultat d'aprenentatge 1",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Llenguatge anatòmic, zones corporals i comunicació professional",
            "title_ca": "Llenguatge anatòmic, zones corporals i comunicació professional",
            "targetModuleCode": "0640",
            "targetModuleName_es": "Imagen corporal y hábitos saludables",
            "targetModuleName_ca": "Imatge corporal i hàbits saludables",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "La imatge personal necessita un llenguatge anatòmic precís per descriure zones corporals, aplicar tècniques estètiques i comunicar-se amb la clientela de manera professional, també en anglès funcional.",
            "justification_ca": "La imatge personal necessita un llenguatge anatòmic precís per descriure zones corporals, aplicar tècniques estètiques i comunicar-se amb la clientela de manera professional, també en anglès funcional.",
            "activities": [
              {
                "id": "act_0640_C1_1",
                "title_es": "Mapa anatòmic de cabina",
                "title_ca": "Mapa anatòmic de cabina",
                "description_es": "Situar zones corporals i termes de localització en un mapa visual aplicat a serveis d’estètica.",
                "description_ca": "Situar zones corporals i termes de localització en un mapa visual aplicat a serveis d’estètica.",
                "evidence_es": "Mapa anatòmic etiquetat.",
                "evidence_ca": "Mapa anatòmic etiquetat.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C1_2",
                "title_es": "Client/a pregunta on",
                "title_ca": "Client/a pregunta on",
                "description_es": "Explicar a una clienta on s’aplicarà una maniobra o producte utilitzant terminologia senzilla.",
                "description_ca": "Explicar a una clienta on s’aplicarà una maniobra o producte utilitzant terminologia senzilla.",
                "evidence_es": "Diàleg professional.",
                "evidence_ca": "Diàleg professional.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C1_3",
                "title_es": "Eixos i plans amb el cos",
                "title_ca": "Eixos i plans amb el cos",
                "description_es": "Representar eixos i plans anatòmics amb posicions corporals controlades.",
                "description_ca": "Representar eixos i plans anatòmics amb posicions corporals controlades.",
                "evidence_es": "Seqüència de fotos o esquema.",
                "evidence_ca": "Seqüència de fotos o esquema.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C1_4",
                "title_es": "Diccionari exprés",
                "title_ca": "Diccionari exprés",
                "description_es": "Crear un glossari bàsic de termes anatòmics útils en estètica.",
                "description_ca": "Crear un glossari bàsic de termes anatòmics útils en estètica.",
                "evidence_es": "Glossari visual.",
                "evidence_ca": "Glossari visual.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              },
              {
                "id": "act_0640_C1_5",
                "title_es": "Anatomy in English",
                "title_ca": "Anatomy in English",
                "description_es": "Preparar cinc frases bàsiques en anglès sobre zones corporals.",
                "description_ca": "Preparar cinc frases bàsiques en anglès sobre zones corporals.",
                "evidence_es": "Targetes bilingües.",
                "evidence_ca": "Targetes bilingües.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              },
              {
                "id": "act_0640_C1_6",
                "title_es": "Error de comunicació",
                "title_ca": "Error de comunicació",
                "description_es": "Detectar confusions possibles quan no s’usen termes anatòmics precisos.",
                "description_ca": "Detectar confusions possibles quan no s’usen termes anatòmics precisos.",
                "evidence_es": "Correcció del missatge.",
                "evidence_ca": "Correcció del missatge.",
                "diversitySupport_es": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final.",
                "diversitySupport_ca": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final."
              },
              {
                "id": "act_0640_C1_7",
                "title_es": "Massatge localitzat",
                "title_ca": "Massatge localitzat",
                "description_es": "Relacionar una zona anatòmica amb una maniobra estètica adequada.",
                "description_ca": "Relacionar una zona anatòmica amb una maniobra estètica adequada.",
                "evidence_es": "Taula zona-maniobra.",
                "evidence_ca": "Taula zona-maniobra.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica."
              },
              {
                "id": "act_0640_C1_8",
                "title_es": "Briefing tècnic",
                "title_ca": "Briefing tècnic",
                "description_es": "Fer una explicació breu abans d’un servei utilitzant vocabulari correcte.",
                "description_ca": "Fer una explicació breu abans d’un servei utilitzant vocabulari correcte.",
                "evidence_es": "Guió de 60 segons.",
                "evidence_ca": "Guió de 60 segons.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0640_C1_9",
                "title_es": "Pictionary anatòmic",
                "title_ca": "Pictionary anatòmic",
                "description_es": "Endevinar i explicar zones corporals mitjançant dibuixos ràpids.",
                "description_ca": "Endevinar i explicar zones corporals mitjançant dibuixos ràpids.",
                "evidence_es": "Targetes de repàs.",
                "evidence_ca": "Targetes de repàs.",
                "diversitySupport_es": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar.",
                "diversitySupport_ca": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar."
              }
            ]
          },
          {
            "title_es": "Proporcions corporals i facials aplicades a l’assessorament",
            "title_ca": "Proporcions corporals i facials aplicades a l’assessorament",
            "targetModuleCode": "0640",
            "targetModuleName_es": "Imagen corporal y hábitos saludables",
            "targetModuleName_ca": "Imatge corporal i hàbits saludables",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "L’estudi de proporcions corporals, facials, mans i peus ajuda a orientar serveis estètics respectuosos, adaptats a la morfologia i comunicats de manera clara.",
            "justification_ca": "L’estudi de proporcions corporals, facials, mans i peus ajuda a orientar serveis estètics respectuosos, adaptats a la morfologia i comunicats de manera clara.",
            "activities": [
              {
                "id": "act_0640_C2_1",
                "title_es": "Rostres i faccions",
                "title_ca": "Rostres i faccions",
                "description_es": "Identificar tipus de rostre i faccions en exemples didàctics sense emetre judicis de valor.",
                "description_ca": "Identificar tipus de rostre i faccions en exemples didàctics sense emetre judicis de valor.",
                "evidence_es": "Fitxa de morfologia facial.",
                "evidence_ca": "Fitxa de morfologia facial.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C2_2",
                "title_es": "Assessorament respectuós",
                "title_ca": "Assessorament respectuós",
                "description_es": "Transformar frases poc adequades en recomanacions professionals i positives.",
                "description_ca": "Transformar frases poc adequades en recomanacions professionals i positives.",
                "evidence_es": "Guió de comunicació.",
                "evidence_ca": "Guió de comunicació.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C2_3",
                "title_es": "Mans, peus i proporció",
                "title_ca": "Mans, peus i proporció",
                "description_es": "Relacionar morfologia de mans i peus amb adaptacions en manicura i pedicura.",
                "description_ca": "Relacionar morfologia de mans i peus amb adaptacions en manicura i pedicura.",
                "evidence_es": "Proposta adaptada.",
                "evidence_ca": "Proposta adaptada.",
                "diversitySupport_es": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final.",
                "diversitySupport_ca": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final."
              },
              {
                "id": "act_0640_C2_4",
                "title_es": "Fitxa de proporcions",
                "title_ca": "Fitxa de proporcions",
                "description_es": "Dissenyar una fitxa per registrar proporcions facials o corporals rellevants.",
                "description_ca": "Dissenyar una fitxa per registrar proporcions facials o corporals rellevants.",
                "evidence_es": "Fitxa tècnica.",
                "evidence_ca": "Fitxa tècnica.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C2_5",
                "title_es": "Beauty without stereotypes",
                "title_ca": "Beauty without stereotypes",
                "description_es": "Redactar dues frases en anglès que evitin estereotips corporals.",
                "description_ca": "Redactar dues frases en anglès que evitin estereotips corporals.",
                "evidence_es": "Targeta bilingüe.",
                "evidence_ca": "Targeta bilingüe.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              },
              {
                "id": "act_0640_C2_6",
                "title_es": "Abans de recomanar",
                "title_ca": "Abans de recomanar",
                "description_es": "Decidir quina informació morfològica cal recollir abans d’un assessorament.",
                "description_ca": "Decidir quina informació morfològica cal recollir abans d’un assessorament.",
                "evidence_es": "Checklist prèvia.",
                "evidence_ca": "Checklist prèvia.",
                "diversitySupport_es": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final.",
                "diversitySupport_ca": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final."
              },
              {
                "id": "act_0640_C2_7",
                "title_es": "Cas de client/a",
                "title_ca": "Cas de client/a",
                "description_es": "Proposar un servei estètic tenint en compte morfologia i gustos.",
                "description_ca": "Proposar un servei estètic tenint en compte morfologia i gustos.",
                "evidence_es": "Recomanació justificada.",
                "evidence_ca": "Recomanació justificada.",
                "diversitySupport_es": "S’ofereixen targetes de rol amb frases inicials i opcions de resposta; es permet assajar en parella, fer el paper d’observador/a o gravar l’escena en àudio si parlar davant el grup genera inseguretat.",
                "diversitySupport_ca": "S’ofereixen targetes de rol amb frases inicials i opcions de resposta; es permet assajar en parella, fer el paper d’observador/a o gravar l’escena en àudio si parlar davant el grup genera inseguretat."
              },
              {
                "id": "act_0640_C2_8",
                "title_es": "Semàfor de llenguatge",
                "title_ca": "Semàfor de llenguatge",
                "description_es": "Classificar expressions com a adequades, dubtoses o inadequades.",
                "description_ca": "Classificar expressions com a adequades, dubtoses o inadequades.",
                "evidence_es": "Mural semàfor.",
                "evidence_ca": "Mural semàfor.",
                "diversitySupport_es": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar.",
                "diversitySupport_ca": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar."
              },
              {
                "id": "act_0640_C2_9",
                "title_es": "Mini portafoli morfològic",
                "title_ca": "Mini portafoli morfològic",
                "description_es": "Crear una entrada de portafoli amb un exemple d’assessorament respectuós.",
                "description_ca": "Crear una entrada de portafoli amb un exemple d’assessorament respectuós.",
                "evidence_es": "Entrada reflexiva.",
                "evidence_ca": "Entrada reflexiva.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              }
            ]
          }
        ]
      },
      {
        "id": "0640_RA2",
        "code": "RA2",
        "text_es": "Resultado de aprendizaje 2",
        "text_ca": "Resultat d'aprenentatge 2",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Sistemes circulatori, limfàtic i respiratori en serveis estètics",
            "title_ca": "Sistemes circulatori, limfàtic i respiratori en serveis estètics",
            "targetModuleCode": "0640",
            "targetModuleName_es": "Imagen corporal y hábitos saludables",
            "targetModuleName_ca": "Imatge corporal i hàbits saludables",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "Els serveis d’higiene, massatge i aparatologia poden relacionar-se amb circulació, limfa i respiració; cal entendre’n la base per actuar amb seguretat i prevenció.",
            "justification_ca": "Els serveis d’higiene, massatge i aparatologia poden relacionar-se amb circulació, limfa i respiració; cal entendre’n la base per actuar amb seguretat i prevenció.",
            "activities": [
              {
                "id": "act_0640_C3_1",
                "title_es": "Ruta de la circulació",
                "title_ca": "Ruta de la circulació",
                "description_es": "Representar de manera simple el recorregut de sang i limfa vinculat al massatge estètic.",
                "description_ca": "Representar de manera simple el recorregut de sang i limfa vinculat al massatge estètic.",
                "evidence_es": "Esquema circulatori.",
                "evidence_ca": "Esquema circulatori.",
                "diversitySupport_es": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit.",
                "diversitySupport_ca": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit."
              },
              {
                "id": "act_0640_C3_2",
                "title_es": "Massatge i efectes",
                "title_ca": "Massatge i efectes",
                "description_es": "Relacionar maniobres suaus amb possibles efectes sobre circulació i benestar.",
                "description_ca": "Relacionar maniobres suaus amb possibles efectes sobre circulació i benestar.",
                "evidence_es": "Taula maniobra-efecte.",
                "evidence_ca": "Taula maniobra-efecte.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica."
              },
              {
                "id": "act_0640_C3_3",
                "title_es": "Respira abans del servei",
                "title_ca": "Respira abans del servei",
                "description_es": "Dissenyar una mini rutina de respiració per millorar confort de client/a.",
                "description_ca": "Dissenyar una mini rutina de respiració per millorar confort de client/a.",
                "evidence_es": "Protocol de benvinguda.",
                "evidence_ca": "Protocol de benvinguda.",
                "diversitySupport_es": "S’ofereixen targetes de rol amb frases inicials i opcions de resposta; es permet assajar en parella, fer el paper d’observador/a o gravar l’escena en àudio si parlar davant el grup genera inseguretat.",
                "diversitySupport_ca": "S’ofereixen targetes de rol amb frases inicials i opcions de resposta; es permet assajar en parella, fer el paper d’observador/a o gravar l’escena en àudio si parlar davant el grup genera inseguretat."
              },
              {
                "id": "act_0640_C3_4",
                "title_es": "Aparell i precaució",
                "title_ca": "Aparell i precaució",
                "description_es": "Decidir precaucions d’ús d’un aparell segons un cas senzill.",
                "description_ca": "Decidir precaucions d’ús d’un aparell segons un cas senzill.",
                "evidence_es": "Decisió preventiva.",
                "evidence_ca": "Decisió preventiva.",
                "diversitySupport_es": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final.",
                "diversitySupport_ca": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final."
              },
              {
                "id": "act_0640_C3_5",
                "title_es": "Contraindicació?",
                "title_ca": "Contraindicació?",
                "description_es": "Identificar situacions on cal evitar o adaptar un servei estètic.",
                "description_ca": "Identificar situacions on cal evitar o adaptar un servei estètic.",
                "evidence_es": "Informe breu.",
                "evidence_ca": "Informe breu.",
                "diversitySupport_es": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final.",
                "diversitySupport_ca": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final."
              },
              {
                "id": "act_0640_C3_6",
                "title_es": "Sistema en targetes",
                "title_ca": "Sistema en targetes",
                "description_es": "Crear targetes de repàs sobre funcions de sang, limfa i respiració.",
                "description_ca": "Crear targetes de repàs sobre funcions de sang, limfa i respiració.",
                "evidence_es": "Targetes didàctiques.",
                "evidence_ca": "Targetes didàctiques.",
                "diversitySupport_es": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar.",
                "diversitySupport_ca": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar."
              },
              {
                "id": "act_0640_C3_7",
                "title_es": "Cliente marejada",
                "title_ca": "Cliente marejada",
                "description_es": "Simular una resposta professional davant malestar lleu durant un servei.",
                "description_ca": "Simular una resposta professional davant malestar lleu durant un servei.",
                "evidence_es": "Guió d’actuació.",
                "evidence_ca": "Guió d’actuació.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C3_8",
                "title_es": "Mapa de riscos",
                "title_ca": "Mapa de riscos",
                "description_es": "Relacionar riscos del servei amb mesures preventives.",
                "description_ca": "Relacionar riscos del servei amb mesures preventives.",
                "evidence_es": "Targetes risc-solució.",
                "evidence_ca": "Targetes risc-solució.",
                "diversitySupport_es": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar.",
                "diversitySupport_ca": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar."
              },
              {
                "id": "act_0640_C3_9",
                "title_es": "Explicació sense tecnicismes",
                "title_ca": "Explicació sense tecnicismes",
                "description_es": "Explicar a una clienta per què es treballa amb moviments suaus.",
                "description_ca": "Explicar a una clienta per què es treballa amb moviments suaus.",
                "evidence_es": "Guió oral.",
                "evidence_ca": "Guió oral.",
                "diversitySupport_es": "S’ofereixen targetes de rol amb frases inicials i opcions de resposta; es permet assajar en parella, fer el paper d’observador/a o gravar l’escena en àudio si parlar davant el grup genera inseguretat.",
                "diversitySupport_ca": "S’ofereixen targetes de rol amb frases inicials i opcions de resposta; es permet assajar en parella, fer el paper d’observador/a o gravar l’escena en àudio si parlar davant el grup genera inseguretat."
              }
            ]
          },
          {
            "title_es": "Sistema múscul-esquelètic, postura i ergonomia professional",
            "title_ca": "Sistema múscul-esquelètic, postura i ergonomia professional",
            "targetModuleCode": "0640",
            "targetModuleName_es": "Imagen corporal y hábitos saludables",
            "targetModuleName_ca": "Imatge corporal i hàbits saludables",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "Conèixer ossos, músculs, moviments i postura ajuda a aplicar massatges, cuidar mans i peus i prevenir riscos laborals en cabina.",
            "justification_ca": "Conèixer ossos, músculs, moviments i postura ajuda a aplicar massatges, cuidar mans i peus i prevenir riscos laborals en cabina.",
            "activities": [
              {
                "id": "act_0640_C4_1",
                "title_es": "Postura de cabina",
                "title_ca": "Postura de cabina",
                "description_es": "Detectar postures de risc en manicura, pedicura o higiene facial.",
                "description_ca": "Detectar postures de risc en manicura, pedicura o higiene facial.",
                "evidence_es": "Checklist postural.",
                "evidence_ca": "Checklist postural.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C4_2",
                "title_es": "Músculs en moviment",
                "title_ca": "Músculs en moviment",
                "description_es": "Relacionar grups musculars amb moviments bàsics del servei.",
                "description_ca": "Relacionar grups musculars amb moviments bàsics del servei.",
                "evidence_es": "Esquema moviment-múscul.",
                "evidence_ca": "Esquema moviment-múscul.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              },
              {
                "id": "act_0640_C4_3",
                "title_es": "Ergonomia express",
                "title_ca": "Ergonomia express",
                "description_es": "Redissenyar una posició de treball perquè sigui més saludable.",
                "description_ca": "Redissenyar una posició de treball perquè sigui més saludable.",
                "evidence_es": "Foto o dibuix abans/després.",
                "evidence_ca": "Foto o dibuix abans/després.",
                "diversitySupport_es": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata.",
                "diversitySupport_ca": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata."
              },
              {
                "id": "act_0640_C4_4",
                "title_es": "Massatge amb sentit",
                "title_ca": "Massatge amb sentit",
                "description_es": "Justificar una maniobra de massatge segons zona muscular.",
                "description_ca": "Justificar una maniobra de massatge segons zona muscular.",
                "evidence_es": "Fitxa de maniobra.",
                "evidence_ca": "Fitxa de maniobra.",
                "diversitySupport_es": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata.",
                "diversitySupport_ca": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata."
              },
              {
                "id": "act_0640_C4_5",
                "title_es": "Pausa activa",
                "title_ca": "Pausa activa",
                "description_es": "Crear una pausa activa curta per a professionals d’estètica.",
                "description_ca": "Crear una pausa activa curta per a professionals d’estètica.",
                "evidence_es": "Rutina de 3 minuts.",
                "evidence_ca": "Rutina de 3 minuts.",
                "diversitySupport_es": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata.",
                "diversitySupport_ca": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata."
              },
              {
                "id": "act_0640_C4_6",
                "title_es": "Risc múscul-esquelètic",
                "title_ca": "Risc múscul-esquelètic",
                "description_es": "Relacionar accidents o molèsties amb causes posturals.",
                "description_ca": "Relacionar accidents o molèsties amb causes posturals.",
                "evidence_es": "Taula causa-prevenció.",
                "evidence_ca": "Taula causa-prevenció.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C4_7",
                "title_es": "Instructor/a de postura",
                "title_ca": "Instructor/a de postura",
                "description_es": "Donar feedback respectuós sobre postura durant una pràctica.",
                "description_ca": "Donar feedback respectuós sobre postura durant una pràctica.",
                "evidence_es": "Fitxa de feedback.",
                "evidence_ca": "Fitxa de feedback.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C4_8",
                "title_es": "Manual visual",
                "title_ca": "Manual visual",
                "description_es": "Crear instruccions visuals sobre ergonomia al taller.",
                "description_ca": "Crear instruccions visuals sobre ergonomia al taller.",
                "evidence_es": "Cartell ergonòmic.",
                "evidence_ca": "Cartell ergonòmic.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C4_9",
                "title_es": "Compromís saludable",
                "title_ca": "Compromís saludable",
                "description_es": "Definir un objectiu personal per millorar la postura professional.",
                "description_ca": "Definir un objectiu personal per millorar la postura professional.",
                "evidence_es": "Compromís escrit.",
                "evidence_ca": "Compromís escrit.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              }
            ]
          }
        ]
      },
      {
        "id": "0640_RA3",
        "code": "RA3",
        "text_es": "Resultado de aprendizaje 3",
        "text_ca": "Resultat d'aprenentatge 3",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Nutrició, hidratació i pell",
            "title_ca": "Nutrició, hidratació i pell",
            "targetModuleCode": "0640",
            "targetModuleName_es": "Imagen corporal y hábitos saludables",
            "targetModuleName_ca": "Imatge corporal i hàbits saludables",
            "targetRaCode": "RA3",
            "targetRaText_es": "Resultado de aprendizaje 3",
            "targetRaText_ca": "Resultat d'aprenentatge 3",
            "relationType": "tecnica",
            "justification_es": "La imatge corporal i la pell estan relacionades amb alimentació, dieta equilibrada, hidratació i comunicació responsable d’hàbits saludables, també en entorns digitals.",
            "justification_ca": "La imatge corporal i la pell estan relacionades amb alimentació, dieta equilibrada, hidratació i comunicació responsable d’hàbits saludables, també en entorns digitals.",
            "activities": [
              {
                "id": "act_0640_C5_1",
                "title_es": "Alimentació o nutrició",
                "title_ca": "Alimentació o nutrició",
                "description_es": "Distingir alimentació i nutrició amb exemples propers.",
                "description_ca": "Distingir alimentació i nutrició amb exemples propers.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica."
              },
              {
                "id": "act_0640_C5_2",
                "title_es": "Pell hidratada",
                "title_ca": "Pell hidratada",
                "description_es": "Relacionar hidratació, tipus de pell i recomanacions cosmètiques bàsiques.",
                "description_ca": "Relacionar hidratació, tipus de pell i recomanacions cosmètiques bàsiques.",
                "evidence_es": "Consell personalitzat.",
                "evidence_ca": "Consell personalitzat.",
                "diversitySupport_es": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata.",
                "diversitySupport_ca": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata."
              },
              {
                "id": "act_0640_C5_3",
                "title_es": "Mite nutricional",
                "title_ca": "Mite nutricional",
                "description_es": "Analitzar un mite viral sobre dieta i pell.",
                "description_ca": "Analitzar un mite viral sobre dieta i pell.",
                "evidence_es": "Fitxa mite/realitat.",
                "evidence_ca": "Fitxa mite/realitat.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              },
              {
                "id": "act_0640_C5_4",
                "title_es": "Piràmide saludable",
                "title_ca": "Piràmide saludable",
                "description_es": "Crear una versió visual de la piràmide alimentària connectada amb imatge personal.",
                "description_ca": "Crear una versió visual de la piràmide alimentària connectada amb imatge personal.",
                "evidence_es": "Infografia.",
                "evidence_ca": "Infografia.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C5_5",
                "title_es": "Post responsable",
                "title_ca": "Post responsable",
                "description_es": "Dissenyar un post que promogui hàbits saludables sense promeses falses.",
                "description_ca": "Dissenyar un post que promogui hàbits saludables sense promeses falses.",
                "evidence_es": "Post o carrusel.",
                "evidence_ca": "Post o carrusel.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C5_6",
                "title_es": "Client/a pregunta per acne",
                "title_ca": "Client/a pregunta per acne",
                "description_es": "Responder con prudencia sobre hábitos y derivación si procede.",
                "description_ca": "Responder con prudencia sobre hábitos y derivación si procede.",
                "evidence_es": "Diàleg professional.",
                "evidence_ca": "Diàleg professional.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C5_7",
                "title_es": "Hidratació en cabina",
                "title_ca": "Hidratació en cabina",
                "description_es": "Crear un recordatori de consells d’hidratació postservei.",
                "description_ca": "Crear un recordatori de consells d’hidratació postservei.",
                "evidence_es": "Targeta de consells.",
                "evidence_ca": "Targeta de consells.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C5_8",
                "title_es": "Dieta equilibrada",
                "title_ca": "Dieta equilibrada",
                "description_es": "Relacionar hàbits alimentaris generals amb benestar i imatge.",
                "description_ca": "Relacionar hàbits alimentaris generals amb benestar i imatge.",
                "evidence_es": "Conclusió de grup.",
                "evidence_ca": "Conclusió de grup.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0640_C5_9",
                "title_es": "Semàfor de consells",
                "title_ca": "Semàfor de consells",
                "description_es": "Classificar consells com a fiables, dubtosos o falsos.",
                "description_ca": "Classificar consells com a fiables, dubtosos o falsos.",
                "evidence_es": "Mural semàfor.",
                "evidence_ca": "Mural semàfor.",
                "diversitySupport_es": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar.",
                "diversitySupport_ca": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar."
              }
            ]
          }
        ]
      },
      {
        "id": "0640_RA4",
        "code": "RA4",
        "text_es": "Resultado de aprendizaje 4",
        "text_ca": "Resultat d'aprenentatge 4",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Hàbits de vida saludable, pell i imatge personal",
            "title_ca": "Hàbits de vida saludable, pell i imatge personal",
            "targetModuleCode": "0640",
            "targetModuleName_es": "Imagen corporal y hábitos saludables",
            "targetModuleName_ca": "Imatge corporal i hàbits saludables",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "El son, l’exercici, el consum de tabac o alcohol i altres hàbits influeixen en la pell i la imatge personal; l’alumnat ha de saber comunicar recomanacions realistes i saludables.",
            "justification_ca": "El son, l’exercici, el consum de tabac o alcohol i altres hàbits influeixen en la pell i la imatge personal; l’alumnat ha de saber comunicar recomanacions realistes i saludables.",
            "activities": [
              {
                "id": "act_0640_C6_1",
                "title_es": "Rutina saludable",
                "title_ca": "Rutina saludable",
                "description_es": "Dissenyar una rutina setmanal de son, moviment i cura de la pell.",
                "description_ca": "Dissenyar una rutina setmanal de son, moviment i cura de la pell.",
                "evidence_es": "Pla setmanal.",
                "evidence_ca": "Pla setmanal.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              },
              {
                "id": "act_0640_C6_2",
                "title_es": "Pell i tabac",
                "title_ca": "Pell i tabac",
                "description_es": "Relacionar efectes del tabac i alcohol amb possibles canvis en la pell.",
                "description_ca": "Relacionar efectes del tabac i alcohol amb possibles canvis en la pell.",
                "evidence_es": "Mapa d’efectes.",
                "evidence_ca": "Mapa d’efectes.",
                "diversitySupport_es": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final.",
                "diversitySupport_ca": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final."
              },
              {
                "id": "act_0640_C6_3",
                "title_es": "Consell sense jutjar",
                "title_ca": "Consell sense jutjar",
                "description_es": "Practicar recomanacions professionals sense moralitzar.",
                "description_ca": "Practicar recomanacions professionals sense moralitzar.",
                "evidence_es": "Guió respectuós.",
                "evidence_ca": "Guió respectuós.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C6_4",
                "title_es": "Healthy tips",
                "title_ca": "Healthy tips",
                "description_es": "Redactar quatre consells saludables en anglès senzill.",
                "description_ca": "Redactar quatre consells saludables en anglès senzill.",
                "evidence_es": "Targetes en anglès.",
                "evidence_ca": "Targetes en anglès.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              },
              {
                "id": "act_0640_C6_5",
                "title_es": "Abans i després realista",
                "title_ca": "Abans i després realista",
                "description_es": "Distingir millores possibles de promeses exagerades en xarxes.",
                "description_ca": "Distingir millores possibles de promeses exagerades en xarxes.",
                "evidence_es": "Anàlisi de missatges.",
                "evidence_ca": "Anàlisi de missatges.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              },
              {
                "id": "act_0640_C6_6",
                "title_es": "Son i imatge",
                "title_ca": "Son i imatge",
                "description_es": "Crear una infografia sobre son i aspecte personal.",
                "description_ca": "Crear una infografia sobre son i aspecte personal.",
                "evidence_es": "Infografia.",
                "evidence_ca": "Infografia.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C6_7",
                "title_es": "Assessorament postservei",
                "title_ca": "Assessorament postservei",
                "description_es": "Preparar consells posttractament relacionats amb hàbits saludables.",
                "description_ca": "Preparar consells posttractament relacionats amb hàbits saludables.",
                "evidence_es": "Full de recomanacions.",
                "evidence_ca": "Full de recomanacions.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C6_8",
                "title_es": "Debat hàbits joves",
                "title_ca": "Debat hàbits joves",
                "description_es": "Identificar barreres reals perquè adolescents mantinguin hàbits saludables.",
                "description_ca": "Identificar barreres reals perquè adolescents mantinguin hàbits saludables.",
                "evidence_es": "Llista de barreres i solucions.",
                "evidence_ca": "Llista de barreres i solucions.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_0640_C6_9",
                "title_es": "Microcampanya",
                "title_ca": "Microcampanya",
                "description_es": "Crear una campanya positiva de salut i imatge personal.",
                "description_ca": "Crear una campanya positiva de salut i imatge personal.",
                "evidence_es": "Eslògan i cartell.",
                "evidence_ca": "Eslògan i cartell.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              }
            ]
          }
        ]
      },
      {
        "id": "0640_RA5",
        "code": "RA5",
        "text_es": "Resultado de aprendizaje 5",
        "text_ca": "Resultat d'aprenentatge 5",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Microorganismes, infeccions i higiene professional",
            "title_ca": "Microorganismes, infeccions i higiene professional",
            "targetModuleCode": "0640",
            "targetModuleName_es": "Imagen corporal y hábitos saludables",
            "targetModuleName_ca": "Imatge corporal i hàbits saludables",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La prevenció d’infeccions i infestacions és comuna als serveis d’higiene facial, mans-peus i depilació; cal entendre microorganismes i aplicar higiene professional.",
            "justification_ca": "La prevenció d’infeccions i infestacions és comuna als serveis d’higiene facial, mans-peus i depilació; cal entendre microorganismes i aplicar higiene professional.",
            "activities": [
              {
                "id": "act_0640_C7_1",
                "title_es": "Microorganismes en escena",
                "title_ca": "Microorganismes en escena",
                "description_es": "Classificar microorganismes i riscos en serveis d’imatge personal.",
                "description_ca": "Classificar microorganismes i riscos en serveis d’imatge personal.",
                "evidence_es": "Taula de microorganismes.",
                "evidence_ca": "Taula de microorganismes.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C7_2",
                "title_es": "Cadena epidemiològica",
                "title_ca": "Cadena epidemiològica",
                "description_es": "Representar les etapes de transmissió en un servei estètic.",
                "description_ca": "Representar les etapes de transmissió en un servei estètic.",
                "evidence_es": "Diagrama de cadena.",
                "evidence_ca": "Diagrama de cadena.",
                "diversitySupport_es": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit.",
                "diversitySupport_ca": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit."
              },
              {
                "id": "act_0640_C7_3",
                "title_es": "Infecció o infestació",
                "title_ca": "Infecció o infestació",
                "description_es": "Distingir conceptes amb exemples de cabina.",
                "description_ca": "Distingir conceptes amb exemples de cabina.",
                "evidence_es": "Targetes concepte-exemple.",
                "evidence_ca": "Targetes concepte-exemple.",
                "diversitySupport_es": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar.",
                "diversitySupport_ca": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar."
              },
              {
                "id": "act_0640_C7_4",
                "title_es": "Taula segura",
                "title_ca": "Taula segura",
                "description_es": "Detectar elements que poden afavorir contaminació creuada.",
                "description_ca": "Detectar elements que poden afavorir contaminació creuada.",
                "evidence_es": "Checklist de riscos.",
                "evidence_ca": "Checklist de riscos.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C7_5",
                "title_es": "Desinfecció adequada",
                "title_ca": "Desinfecció adequada",
                "description_es": "Triar mètode de neteja, desinfecció o esterilització segons material.",
                "description_ca": "Triar mètode de neteja, desinfecció o esterilització segons material.",
                "evidence_es": "Taula material-mètode.",
                "evidence_ca": "Taula material-mètode.",
                "diversitySupport_es": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final.",
                "diversitySupport_ca": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final."
              },
              {
                "id": "act_0640_C7_6",
                "title_es": "Depilació i risc",
                "title_ca": "Depilació i risc",
                "description_es": "Identificar riscos higiènics concrets en depilació mecànica.",
                "description_ca": "Identificar riscos higiènics concrets en depilació mecànica.",
                "evidence_es": "Mesures preventives.",
                "evidence_ca": "Mesures preventives.",
                "diversitySupport_es": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata.",
                "diversitySupport_ca": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata."
              },
              {
                "id": "act_0640_C7_7",
                "title_es": "Mans i peus segurs",
                "title_ca": "Mans i peus segurs",
                "description_es": "Crear normes d’higiene per a manicura i pedicura.",
                "description_ca": "Crear normes d’higiene per a manicura i pedicura.",
                "evidence_es": "Cartell normatiu.",
                "evidence_ca": "Cartell normatiu.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C7_8",
                "title_es": "Protocol ràpid",
                "title_ca": "Protocol ràpid",
                "description_es": "Redactar un protocol d’actuació davant material contaminat.",
                "description_ca": "Redactar un protocol d’actuació davant material contaminat.",
                "evidence_es": "Protocol breu.",
                "evidence_ca": "Protocol breu.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C7_9",
                "title_es": "Escape infeccions",
                "title_ca": "Escape infeccions",
                "description_es": "Resoldre pistes sobre higiene, microorganismes i prevenció.",
                "description_ca": "Resoldre pistes sobre higiene, microorganismes i prevenció.",
                "evidence_es": "Codi final amb mesures.",
                "evidence_ca": "Codi final amb mesures.",
                "diversitySupport_es": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar.",
                "diversitySupport_ca": "Les normes es presenten amb una ronda de prova i targetes amb colors/icones; les respostes poden ser per equip i es dona temps extra per llegir els casos o conceptes abans de jugar."
              }
            ]
          },
          {
            "title_es": "Residus, neteja, desinfecció i esterilització",
            "title_ca": "Residus, neteja, desinfecció i esterilització",
            "targetModuleCode": "0640",
            "targetModuleName_es": "Imagen corporal y hábitos saludables",
            "targetModuleName_ca": "Imatge corporal i hàbits saludables",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La seguretat dels serveis d’estètica depèn de l’ordre, neteja, desinfecció, esterilització, tractament de residus i manteniment adequat d’equips i cosmètics.",
            "justification_ca": "La seguretat dels serveis d’estètica depèn de l’ordre, neteja, desinfecció, esterilització, tractament de residus i manteniment adequat d’equips i cosmètics.",
            "activities": [
              {
                "id": "act_0640_C8_1",
                "title_es": "Circuit net-brut",
                "title_ca": "Circuit net-brut",
                "description_es": "Dissenyar el recorregut segur del material abans i després del servei.",
                "description_ca": "Dissenyar el recorregut segur del material abans i després del servei.",
                "evidence_es": "Diagrama net-brut.",
                "evidence_ca": "Diagrama net-brut.",
                "diversitySupport_es": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit.",
                "diversitySupport_ca": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit."
              },
              {
                "id": "act_0640_C8_2",
                "title_es": "Residus de taller",
                "title_ca": "Residus de taller",
                "description_es": "Classificar residus segons risc i tractament adequat.",
                "description_ca": "Classificar residus segons risc i tractament adequat.",
                "evidence_es": "Taula de residus.",
                "evidence_ca": "Taula de residus.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica."
              },
              {
                "id": "act_0640_C8_3",
                "title_es": "Mètode correcte",
                "title_ca": "Mètode correcte",
                "description_es": "Seleccionar neteja, desinfecció o esterilització segons cas.",
                "description_ca": "Seleccionar neteja, desinfecció o esterilització segons cas.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final.",
                "diversitySupport_ca": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final."
              },
              {
                "id": "act_0640_C8_4",
                "title_es": "Auditoria d’ordre",
                "title_ca": "Auditoria d’ordre",
                "description_es": "Revisar l’ordre i la neteja d’una estació de treball.",
                "description_ca": "Revisar l’ordre i la neteja d’una estació de treball.",
                "evidence_es": "Rúbrica d’auditoria.",
                "evidence_ca": "Rúbrica d’auditoria.",
                "diversitySupport_es": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut.",
                "diversitySupport_ca": "La tasca es presenta amb passos visibles, producte model i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual sempre que es mantingui el rigor professional del contingut."
              },
              {
                "id": "act_0640_C8_5",
                "title_es": "Aparell protegit",
                "title_ca": "Aparell protegit",
                "description_es": "Crear pautes de manteniment higiènic d’un equip d’estètica.",
                "description_ca": "Crear pautes de manteniment higiènic d’un equip d’estètica.",
                "evidence_es": "Checklist d’equip.",
                "evidence_ca": "Checklist d’equip.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C8_6",
                "title_es": "Cosmètic i residu",
                "title_ca": "Cosmètic i residu",
                "description_es": "Relacionar cosmètics, envasos i eliminació responsable.",
                "description_ca": "Relacionar cosmètics, envasos i eliminació responsable.",
                "evidence_es": "Fitxa d’eliminació.",
                "evidence_ca": "Fitxa d’eliminació.",
                "diversitySupport_es": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata.",
                "diversitySupport_ca": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata."
              },
              {
                "id": "act_0640_C8_7",
                "title_es": "Cartell 3 passos",
                "title_ca": "Cartell 3 passos",
                "description_es": "Fer un cartell clar sobre netejar, desinfectar i esterilitzar.",
                "description_ca": "Fer un cartell clar sobre netejar, desinfectar i esterilitzar.",
                "evidence_es": "Cartell didàctic.",
                "evidence_ca": "Cartell didàctic.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C8_8",
                "title_es": "Error greu",
                "title_ca": "Error greu",
                "description_es": "Analitzar una situació on s’ha trencat la cadena d’higiene.",
                "description_ca": "Analitzar una situació on s’ha trencat la cadena d’higiene.",
                "evidence_es": "Informe de millora.",
                "evidence_ca": "Informe de millora.",
                "diversitySupport_es": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit.",
                "diversitySupport_ca": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit."
              },
              {
                "id": "act_0640_C8_9",
                "title_es": "Compromís de cabina",
                "title_ca": "Compromís de cabina",
                "description_es": "Crear normes d’aula-taller per minimitzar riscos biològics.",
                "description_ca": "Crear normes d’aula-taller per minimitzar riscos biològics.",
                "evidence_es": "Decàleg d’aula.",
                "evidence_ca": "Decàleg d’aula.",
                "diversitySupport_es": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata.",
                "diversitySupport_ca": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata."
              }
            ]
          }
        ]
      },
      {
        "id": "0640_RA6",
        "code": "RA6",
        "text_es": "Resultado de aprendizaje 6",
        "text_ca": "Resultat d'aprenentatge 6",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Seguretat, EPI, primers auxilis i prevenció professional",
            "title_ca": "Seguretat, EPI, primers auxilis i prevenció professional",
            "targetModuleCode": "0640",
            "targetModuleName_es": "Imagen corporal y hábitos saludables",
            "targetModuleName_ca": "Imatge corporal i hàbits saludables",
            "targetRaCode": "RA6",
            "targetRaText_es": "Resultado de aprendizaje 6",
            "targetRaText_ca": "Resultat d'aprenentatge 6",
            "relationType": "tecnica",
            "justification_es": "Els serveis d’imatge personal requereixen identificar riscos, utilitzar EPI, protegir client i professional i actuar davant reaccions adverses o accidents.",
            "justification_ca": "Els serveis d’imatge personal requereixen identificar riscos, utilitzar EPI, protegir client i professional i actuar davant reaccions adverses o accidents.",
            "activities": [
              {
                "id": "act_0640_C9_1",
                "title_es": "Mapa de riscos",
                "title_ca": "Mapa de riscos",
                "description_es": "Identificar riscos d’una cabina d’estètica i la malaltia o accident associat.",
                "description_ca": "Identificar riscos d’una cabina d’estètica i la malaltia o accident associat.",
                "evidence_es": "Mapa de riscos.",
                "evidence_ca": "Mapa de riscos.",
                "diversitySupport_es": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit.",
                "diversitySupport_ca": "S’entrega un esquema base parcialment completat i peces retallables amb paraules clau; l’alumnat pot construir-lo manipulativament abans de passar-lo a format digital o escrit."
              },
              {
                "id": "act_0640_C9_2",
                "title_es": "EPI adequat",
                "title_ca": "EPI adequat",
                "description_es": "Seleccionar equips de protecció per a depilació, higiene o aparatologia.",
                "description_ca": "Seleccionar equips de protecció per a depilació, higiene o aparatologia.",
                "evidence_es": "Taula servei-EPI.",
                "evidence_ca": "Taula servei-EPI.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar colors, adhesius o imatges per classificar abans de redactar la justificació tècnica."
              },
              {
                "id": "act_0640_C9_3",
                "title_es": "Client/a protegit/da",
                "title_ca": "Client/a protegit/da",
                "description_es": "Planificar mesures de protecció del client durant un servei.",
                "description_ca": "Planificar mesures de protecció del client durant un servei.",
                "evidence_es": "Checklist de protecció.",
                "evidence_ca": "Checklist de protecció.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C9_4",
                "title_es": "Reacció adversa",
                "title_ca": "Reacció adversa",
                "description_es": "Simular l’actuació davant una reacció adversa lleu.",
                "description_ca": "Simular l’actuació davant una reacció adversa lleu.",
                "evidence_es": "Protocol d’actuació.",
                "evidence_ca": "Protocol d’actuació.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              },
              {
                "id": "act_0640_C9_5",
                "title_es": "Farmaciola de taller",
                "title_ca": "Farmaciola de taller",
                "description_es": "Revisar què hauria de tenir una farmaciola bàsica d’aula-taller.",
                "description_ca": "Revisar què hauria de tenir una farmaciola bàsica d’aula-taller.",
                "evidence_es": "Inventari justificat.",
                "evidence_ca": "Inventari justificat.",
                "diversitySupport_es": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata.",
                "diversitySupport_ca": "La pràctica es divideix en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar en parelles de suport i valorar la progressió individual més que la perfecció immediata."
              },
              {
                "id": "act_0640_C9_6",
                "title_es": "Accident amb aparell",
                "title_ca": "Accident amb aparell",
                "description_es": "Decidir mesures davant una incidència amb aparatologia.",
                "description_ca": "Decidir mesures davant una incidència amb aparatologia.",
                "evidence_es": "Decisió segura.",
                "evidence_ca": "Decisió segura.",
                "diversitySupport_es": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final.",
                "diversitySupport_ca": "El cas es dona en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar la resposta final."
              },
              {
                "id": "act_0640_C9_7",
                "title_es": "Senyalització útil",
                "title_ca": "Senyalització útil",
                "description_es": "Crear senyals visuals per recordar riscos i EPI.",
                "description_ca": "Crear senyals visuals per recordar riscos i EPI.",
                "evidence_es": "Senyals d’aula.",
                "evidence_ca": "Senyals d’aula.",
                "diversitySupport_es": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es donen exemples visuals, icones i una graella de composició; els rols es reparteixen entre disseny, text, revisió tècnica i presentació perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_0640_C9_8",
                "title_es": "Simulacre PAS",
                "title_ca": "Simulacre PAS",
                "description_es": "Practicar protegir, avisar i socórrer en situacions senzilles.",
                "description_ca": "Practicar protegir, avisar i socórrer en situacions senzilles.",
                "evidence_es": "Rúbrica d’actuació.",
                "evidence_ca": "Rúbrica d’actuació.",
                "diversitySupport_es": "S’ofereixen targetes de rol amb frases inicials i opcions de resposta; es permet assajar en parella, fer el paper d’observador/a o gravar l’escena en àudio si parlar davant el grup genera inseguretat.",
                "diversitySupport_ca": "S’ofereixen targetes de rol amb frases inicials i opcions de resposta; es permet assajar en parella, fer el paper d’observador/a o gravar l’escena en àudio si parlar davant el grup genera inseguretat."
              },
              {
                "id": "act_0640_C9_9",
                "title_es": "Pla personal de prevenció",
                "title_ca": "Pla personal de prevenció",
                "description_es": "Definir hàbits propis per treballar amb seguretat.",
                "description_ca": "Definir hàbits propis per treballar amb seguretat.",
                "evidence_es": "Pla preventiu personal.",
                "evidence_ca": "Pla preventiu personal.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja seqüenciats, exemple model i vocabulari clau; l’alumnat pot completar primer amb paraules o icones i després convertir-ho en frases professionals."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "0641",
    "name_es": "Cosmetología para estética y belleza",
    "name_ca": "Cosmetologia per a estètica i bellesa",
    "type": "especifico",
    "color": "#818cf8",
    "icon": "book",
    "learningOutcomes": [
      {
        "id": "0641_RA1",
        "code": "RA1",
        "text_es": "Resultado de aprendizaje 1",
        "text_ca": "Resultat d'aprenentatge 1",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Cosmètic, medicament, etiqueta i normativa",
            "title_ca": "Cosmètic, medicament, etiqueta i normativa",
            "targetModuleCode": "0641",
            "targetModuleName_es": "Cosmetología para estética y belleza",
            "targetModuleName_ca": "Cosmetologia per a estètica i bellesa",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "L’alumnat ha de diferenciar cosmètic i medicament, interpretar envasos, etiquetes i informació del fabricant, protegir dades i comunicar informació responsable en entorns físics i digitals.",
            "justification_ca": "L’alumnat ha de diferenciar cosmètic i medicament, interpretar envasos, etiquetes i informació del fabricant, protegir dades i comunicar informació responsable en entorns físics i digitals.",
            "activities": [
              {
                "id": "act_0641_C1_1",
                "title_es": "Etiqueta detective",
                "title_ca": "Etiqueta detective",
                "description_es": "Analitzar l’etiqueta d’un cosmètic real i comprovar si inclou informació obligatòria.",
                "description_ca": "Analitzar l’etiqueta d’un cosmètic real i comprovar si inclou informació obligatòria.",
                "evidence_es": "Fitxa d’anàlisi d’etiqueta.",
                "evidence_ca": "Fitxa d’anàlisi d’etiqueta.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C1_2",
                "title_es": "Cosmètic o medicament?",
                "title_ca": "Cosmètic o medicament?",
                "description_es": "Classificar exemples i justificar si són cosmètics o medicaments.",
                "description_ca": "Classificar exemples i justificar si són cosmètics o medicaments.",
                "evidence_es": "Targetes classificades.",
                "evidence_ca": "Targetes classificades.",
                "diversitySupport_es": "Les regles es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les.",
                "diversitySupport_ca": "Les regles es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les."
              },
              {
                "id": "act_0641_C1_3",
                "title_es": "Traducció útil",
                "title_ca": "Traducció útil",
                "description_es": "Redactar en anglès senzill tres indicacions bàsiques d’una etiqueta cosmètica.",
                "description_ca": "Redactar en anglès senzill tres indicacions bàsiques d’una etiqueta cosmètica.",
                "evidence_es": "Targeta bilingüe.",
                "evidence_ca": "Targeta bilingüe.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C1_4",
                "title_es": "PAO i caducitat",
                "title_ca": "PAO i caducitat",
                "description_es": "Explicar a una clienta què significa el símbol PAO i per què és important.",
                "description_ca": "Explicar a una clienta què significa el símbol PAO i per què és important.",
                "evidence_es": "Diàleg professional.",
                "evidence_ca": "Diàleg professional.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final."
              },
              {
                "id": "act_0641_C1_5",
                "title_es": "Etiqueta fake",
                "title_ca": "Etiqueta fake",
                "description_es": "Detectar errors en una etiqueta simulada amb informació incompleta o enganyosa.",
                "description_ca": "Detectar errors en una etiqueta simulada amb informació incompleta o enganyosa.",
                "evidence_es": "Etiqueta corregida.",
                "evidence_ca": "Etiqueta corregida.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C1_6",
                "title_es": "Dades i cosmètics",
                "title_ca": "Dades i cosmètics",
                "description_es": "Relacionar fitxes de producte i protecció de dades en la gestió digital del saló.",
                "description_ca": "Relacionar fitxes de producte i protecció de dades en la gestió digital del saló.",
                "evidence_es": "Decisió argumentada.",
                "evidence_ca": "Decisió argumentada.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C1_7",
                "title_es": "Infografia normativa",
                "title_ca": "Infografia normativa",
                "description_es": "Convertir requisits d’etiquetatge en una infografia clara per l’aula.",
                "description_ca": "Convertir requisits d’etiquetatge en una infografia clara per l’aula.",
                "evidence_es": "Infografia.",
                "evidence_ca": "Infografia.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C1_8",
                "title_es": "Comparativa de marques",
                "title_ca": "Comparativa de marques",
                "description_es": "Comparar dues etiquetes del mateix tipus de cosmètic.",
                "description_ca": "Comparar dues etiquetes del mateix tipus de cosmètic.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica.",
                "diversitySupport_ca": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica."
              },
              {
                "id": "act_0641_C1_9",
                "title_es": "Consell responsable",
                "title_ca": "Consell responsable",
                "description_es": "Redactar un missatge per xarxes sense prometre efectes no demostrats.",
                "description_ca": "Redactar un missatge per xarxes sense prometre efectes no demostrats.",
                "evidence_es": "Post responsable.",
                "evidence_ca": "Post responsable.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un/a company/a tutor/a i se centra en la qualitat tècnica del missatge.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un/a company/a tutor/a i se centra en la qualitat tècnica del missatge."
              }
            ]
          },
          {
            "title_es": "Components interns i funció cosmètica",
            "title_ca": "Components interns i funció cosmètica",
            "targetModuleCode": "0641",
            "targetModuleName_es": "Cosmetología para estética y belleza",
            "targetModuleName_ca": "Cosmetologia per a estètica i bellesa",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "Conèixer principis actius, excipients, additius i correctius permet entendre com actuen els cosmètics sobre la pell i explicar-ho amb vocabulari professional comprensible.",
            "justification_ca": "Conèixer principis actius, excipients, additius i correctius permet entendre com actuen els cosmètics sobre la pell i explicar-ho amb vocabulari professional comprensible.",
            "activities": [
              {
                "id": "act_0641_C2_1",
                "title_es": "Ingredient amb funció",
                "title_ca": "Ingredient amb funció",
                "description_es": "Relacionar components d’un cosmètic amb la funció que realitzen.",
                "description_ca": "Relacionar components d’un cosmètic amb la funció que realitzen.",
                "evidence_es": "Taula component-funció.",
                "evidence_ca": "Taula component-funció.",
                "diversitySupport_es": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica.",
                "diversitySupport_ca": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica."
              },
              {
                "id": "act_0641_C2_2",
                "title_es": "INCI sense por",
                "title_ca": "INCI sense por",
                "description_es": "Buscar ingredients repetits en diferents cosmètics i interpretar-ne el paper bàsic.",
                "description_ca": "Buscar ingredients repetits en diferents cosmètics i interpretar-ne el paper bàsic.",
                "evidence_es": "Llista comentada.",
                "evidence_ca": "Llista comentada.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C2_3",
                "title_es": "Actiu protagonista",
                "title_ca": "Actiu protagonista",
                "description_es": "Triar un principi actiu i explicar-ne la funció cosmètica.",
                "description_ca": "Triar un principi actiu i explicar-ne la funció cosmètica.",
                "evidence_es": "Fitxa d’actiu.",
                "evidence_ca": "Fitxa d’actiu.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat."
              },
              {
                "id": "act_0641_C2_4",
                "title_es": "Excipients invisibles",
                "title_ca": "Excipients invisibles",
                "description_es": "Identificar per què un cosmètic necessita excipients i no només principis actius.",
                "description_ca": "Identificar per què un cosmètic necessita excipients i no només principis actius.",
                "evidence_es": "Conclusió de grup.",
                "evidence_ca": "Conclusió de grup.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat."
              },
              {
                "id": "act_0641_C2_5",
                "title_es": "Cosmetic ingredients",
                "title_ca": "Cosmetic ingredients",
                "description_es": "Preparar una explicació curta en anglès sobre active ingredient i base.",
                "description_ca": "Preparar una explicació curta en anglès sobre active ingredient i base.",
                "evidence_es": "Guió bilingüe.",
                "evidence_ca": "Guió bilingüe.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C2_6",
                "title_es": "Pell i component",
                "title_ca": "Pell i component",
                "description_es": "Relacionar una necessitat cutània amb el tipus de component cosmètic adequat.",
                "description_ca": "Relacionar una necessitat cutània amb el tipus de component cosmètic adequat.",
                "evidence_es": "Recomanació justificada.",
                "evidence_ca": "Recomanació justificada.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C2_7",
                "title_es": "Puzzle cosmètic",
                "title_ca": "Puzzle cosmètic",
                "description_es": "Construir la composició bàsica d’un cosmètic amb targetes de components.",
                "description_ca": "Construir la composició bàsica d’un cosmètic amb targetes de components.",
                "evidence_es": "Composició ordenada.",
                "evidence_ca": "Composició ordenada.",
                "diversitySupport_es": "Les regles es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les.",
                "diversitySupport_ca": "Les regles es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les."
              },
              {
                "id": "act_0641_C2_8",
                "title_es": "Funció nutrició-pell",
                "title_ca": "Funció nutrició-pell",
                "description_es": "Connectar nutrients, pell i acció cosmètica sense confondre salut i cosmètica.",
                "description_ca": "Connectar nutrients, pell i acció cosmètica sense confondre salut i cosmètica.",
                "evidence_es": "Mapa relacional.",
                "evidence_ca": "Mapa relacional.",
                "diversitySupport_es": "S’entrega un esquema base i peces retallables amb conceptes cosmètics; l’alumnat pot construir-lo de manera manipulativa i després passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega un esquema base i peces retallables amb conceptes cosmètics; l’alumnat pot construir-lo de manera manipulativa i després passar-lo a format escrit o digital."
              },
              {
                "id": "act_0641_C2_9",
                "title_es": "Mini glossari",
                "title_ca": "Mini glossari",
                "description_es": "Crear un glossari visual de termes de composició cosmètica.",
                "description_ca": "Crear un glossari visual de termes de composició cosmètica.",
                "evidence_es": "Glossari visual.",
                "evidence_ca": "Glossari visual.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              }
            ]
          }
        ]
      },
      {
        "id": "0641_RA2",
        "code": "RA2",
        "text_es": "Resultado de aprendizaje 2",
        "text_ca": "Resultat d'aprenentatge 2",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Laboratori cosmètic, formes fisicoquímiques i fitxa d’elaboració",
            "title_ca": "Laboratori cosmètic, formes fisicoquímiques i fitxa d’elaboració",
            "targetModuleCode": "0641",
            "targetModuleName_es": "Cosmetología para estética y belleza",
            "targetModuleName_ca": "Cosmetologia per a estètica i bellesa",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "La preparació bàsica de cosmètics requereix distingir sistemes, seleccionar material, executar operacions elementals i registrar el procés amb seguretat i suport tecnològic.",
            "justification_ca": "La preparació bàsica de cosmètics requereix distingir sistemes, seleccionar material, executar operacions elementals i registrar el procés amb seguretat i suport tecnològic.",
            "activities": [
              {
                "id": "act_0641_C3_1",
                "title_es": "Laboratori segur",
                "title_ca": "Laboratori segur",
                "description_es": "Identificar material de laboratori i EPI abans d’elaborar un cosmètic senzill.",
                "description_ca": "Identificar material de laboratori i EPI abans d’elaborar un cosmètic senzill.",
                "evidence_es": "Checklist de preparació.",
                "evidence_ca": "Checklist de preparació.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal."
              },
              {
                "id": "act_0641_C3_2",
                "title_es": "Gel o emulsió?",
                "title_ca": "Gel o emulsió?",
                "description_es": "Distingir formes fisicoquímiques amb mostres o imatges didàctiques.",
                "description_ca": "Distingir formes fisicoquímiques amb mostres o imatges didàctiques.",
                "evidence_es": "Taula de formes.",
                "evidence_ca": "Taula de formes.",
                "diversitySupport_es": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica.",
                "diversitySupport_ca": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica."
              },
              {
                "id": "act_0641_C3_3",
                "title_es": "Fitxa d’elaboració",
                "title_ca": "Fitxa d’elaboració",
                "description_es": "Completar una fitxa de preparació cosmètica amb components i modus operandi.",
                "description_ca": "Completar una fitxa de preparació cosmètica amb components i modus operandi.",
                "evidence_es": "Fitxa d’elaboració.",
                "evidence_ca": "Fitxa d’elaboració.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final."
              },
              {
                "id": "act_0641_C3_4",
                "title_es": "Operació pas a pas",
                "title_ca": "Operació pas a pas",
                "description_es": "Ordenar les operacions físiques d’una preparació cosmètica senzilla.",
                "description_ca": "Ordenar les operacions físiques d’una preparació cosmètica senzilla.",
                "evidence_es": "Protocol visual.",
                "evidence_ca": "Protocol visual.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal."
              },
              {
                "id": "act_0641_C3_5",
                "title_es": "Error al laboratori",
                "title_ca": "Error al laboratori",
                "description_es": "Detectar riscos o errors en una preparació simulada.",
                "description_ca": "Detectar riscos o errors en una preparació simulada.",
                "evidence_es": "Informe de correcció.",
                "evidence_ca": "Informe de correcció.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal."
              },
              {
                "id": "act_0641_C3_6",
                "title_es": "Dades del lot",
                "title_ca": "Dades del lot",
                "description_es": "Registrar resultats bàsics i observacions d’una elaboració en format digital.",
                "description_ca": "Registrar resultats bàsics i observacions d’una elaboració en format digital.",
                "evidence_es": "Registre digital.",
                "evidence_ca": "Registre digital.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un/a company/a tutor/a i se centra en la qualitat tècnica del missatge.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb un/a company/a tutor/a i se centra en la qualitat tècnica del missatge."
              },
              {
                "id": "act_0641_C3_7",
                "title_es": "Sistemes homogenis",
                "title_ca": "Sistemes homogenis",
                "description_es": "Comparar una dissolució i una emulsió amb exemples cosmètics.",
                "description_ca": "Comparar una dissolució i una emulsió amb exemples cosmètics.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica.",
                "diversitySupport_ca": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica."
              },
              {
                "id": "act_0641_C3_8",
                "title_es": "Briefing de seguretat",
                "title_ca": "Briefing de seguretat",
                "description_es": "Explicar normes de laboratori abans de començar la pràctica.",
                "description_ca": "Explicar normes de laboratori abans de començar la pràctica.",
                "evidence_es": "Guió de seguretat.",
                "evidence_ca": "Guió de seguretat.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal."
              },
              {
                "id": "act_0641_C3_9",
                "title_es": "Millora 4.0",
                "title_ca": "Millora 4.0",
                "description_es": "Proposar una eina digital per controlar receptes, lots o estoc de laboratori.",
                "description_ca": "Proposar una eina digital per controlar receptes, lots o estoc de laboratori.",
                "evidence_es": "Proposta tecnològica.",
                "evidence_ca": "Proposta tecnològica.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal."
              }
            ]
          }
        ]
      },
      {
        "id": "0641_RA3",
        "code": "RA3",
        "text_es": "Resultado de aprendizaje 3",
        "text_ca": "Resultat d'aprenentatge 3",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Formes cosmètiques, penetració i qualitat del producte",
            "title_ca": "Formes cosmètiques, penetració i qualitat del producte",
            "targetModuleCode": "0641",
            "targetModuleName_es": "Cosmetología para estética y belleza",
            "targetModuleName_ca": "Cosmetologia per a estètica i bellesa",
            "targetRaCode": "RA3",
            "targetRaText_es": "Resultado de aprendizaje 3",
            "targetRaText_ca": "Resultat d'aprenentatge 3",
            "relationType": "tecnica",
            "justification_es": "La forma cosmètica, la penetració i la qualitat condicionen la selecció del producte segons tipologia cutània, servei d’higiene i perfil professional del sector.",
            "justification_ca": "La forma cosmètica, la penetració i la qualitat condicionen la selecció del producte segons tipologia cutània, servei d’higiene i perfil professional del sector.",
            "activities": [
              {
                "id": "act_0641_C4_1",
                "title_es": "Forma cosmètica ideal",
                "title_ca": "Forma cosmètica ideal",
                "description_es": "Triar la forma cosmètica més adequada per a diferents tipus de pell.",
                "description_ca": "Triar la forma cosmètica més adequada per a diferents tipus de pell.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C4_2",
                "title_es": "Crema, gel o sèrum",
                "title_ca": "Crema, gel o sèrum",
                "description_es": "Comparar avantatges i inconvenients de formes cosmètiques habituals.",
                "description_ca": "Comparar avantatges i inconvenients de formes cosmètiques habituals.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica.",
                "diversitySupport_ca": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica."
              },
              {
                "id": "act_0641_C4_3",
                "title_es": "Penetració en capes",
                "title_ca": "Penetració en capes",
                "description_es": "Representar com pot penetrar un cosmètic en la pell de forma simplificada.",
                "description_ca": "Representar com pot penetrar un cosmètic en la pell de forma simplificada.",
                "evidence_es": "Esquema de penetració.",
                "evidence_ca": "Esquema de penetració.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C4_4",
                "title_es": "Factors que influeixen",
                "title_ca": "Factors que influeixen",
                "description_es": "Identificar factors que afavoreixen o limiten l’acció cosmètica.",
                "description_ca": "Identificar factors que afavoreixen o limiten l’acció cosmètica.",
                "evidence_es": "Targetes factor-efecte.",
                "evidence_ca": "Targetes factor-efecte.",
                "diversitySupport_es": "Les regles es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les.",
                "diversitySupport_ca": "Les regles es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les."
              },
              {
                "id": "act_0641_C4_5",
                "title_es": "Qualitat percebuda",
                "title_ca": "Qualitat percebuda",
                "description_es": "Relacionar textura, envàs, olor i eficàcia percebuda amb qualitat.",
                "description_ca": "Relacionar textura, envàs, olor i eficàcia percebuda amb qualitat.",
                "evidence_es": "Rúbrica de qualitat.",
                "evidence_ca": "Rúbrica de qualitat.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat."
              },
              {
                "id": "act_0641_C4_6",
                "title_es": "Servei d’higiene",
                "title_ca": "Servei d’higiene",
                "description_es": "Seleccionar forma cosmètica per a una higiene facial segons cas.",
                "description_ca": "Seleccionar forma cosmètica per a una higiene facial segons cas.",
                "evidence_es": "Fitxa de recomanació.",
                "evidence_ca": "Fitxa de recomanació.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C4_7",
                "title_es": "Perfil professional",
                "title_ca": "Perfil professional",
                "description_es": "Explicar com la selecció cosmètica influeix en la imatge professional.",
                "description_ca": "Explicar com la selecció cosmètica influeix en la imatge professional.",
                "evidence_es": "Entrada de portafoli.",
                "evidence_ca": "Entrada de portafoli.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat."
              },
              {
                "id": "act_0641_C4_8",
                "title_es": "Mapa de formes",
                "title_ca": "Mapa de formes",
                "description_es": "Crear un mural de formes cosmètiques i usos principals.",
                "description_ca": "Crear un mural de formes cosmètiques i usos principals.",
                "evidence_es": "Mural didàctic.",
                "evidence_ca": "Mural didàctic.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C4_9",
                "title_es": "Pitch de producte",
                "title_ca": "Pitch de producte",
                "description_es": "Presentar una forma cosmètica a una clienta amb llenguatge clar.",
                "description_ca": "Presentar una forma cosmètica a una clienta amb llenguatge clar.",
                "evidence_es": "Pitch de 60 segons.",
                "evidence_ca": "Pitch de 60 segons.",
                "diversitySupport_es": "S’ofereixen targetes de rol amb frases d’inici, vocabulari tècnic i possibles respostes; es permet assajar en parella, gravar àudio o assumir el rol d’observador/a tècnic/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol amb frases d’inici, vocabulari tècnic i possibles respostes; es permet assajar en parella, gravar àudio o assumir el rol d’observador/a tècnic/a amb rúbrica."
              }
            ]
          }
        ]
      },
      {
        "id": "0641_RA4",
        "code": "RA4",
        "text_es": "Resultado de aprendizaje 4",
        "text_ca": "Resultat d'aprenentatge 4",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Cosmètics d’higiene facial i corporal",
            "title_ca": "Cosmètics d’higiene facial i corporal",
            "targetModuleCode": "0641",
            "targetModuleName_es": "Cosmetología para estética y belleza",
            "targetModuleName_ca": "Cosmetologia per a estètica i bellesa",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "Els cosmètics d’higiene, exfoliants i mascarilles s’han de seleccionar segons la pell, el protocol de cabina i les normes d’higiene i prevenció del servei.",
            "justification_ca": "Els cosmètics d’higiene, exfoliants i mascarilles s’han de seleccionar segons la pell, el protocol de cabina i les normes d’higiene i prevenció del servei.",
            "activities": [
              {
                "id": "act_0641_C5_1",
                "title_es": "Netejador adequat",
                "title_ca": "Netejador adequat",
                "description_es": "Seleccionar un netejador facial o corporal segons un cas de pell.",
                "description_ca": "Seleccionar un netejador facial o corporal segons un cas de pell.",
                "evidence_es": "Fitxa de selecció.",
                "evidence_ca": "Fitxa de selecció.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C5_2",
                "title_es": "Exfoliant sense risc",
                "title_ca": "Exfoliant sense risc",
                "description_es": "Classificar exfoliants segons mecanisme d’acció i precaucions.",
                "description_ca": "Classificar exfoliants segons mecanisme d’acció i precaucions.",
                "evidence_es": "Taula d’exfoliants.",
                "evidence_ca": "Taula d’exfoliants.",
                "diversitySupport_es": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica.",
                "diversitySupport_ca": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica."
              },
              {
                "id": "act_0641_C5_3",
                "title_es": "Mascareta a mida",
                "title_ca": "Mascareta a mida",
                "description_es": "Relacionar principis actius de mascarilles amb necessitats cutànies.",
                "description_ca": "Relacionar principis actius de mascarilles amb necessitats cutànies.",
                "evidence_es": "Proposta de mascarilla.",
                "evidence_ca": "Proposta de mascarilla.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C5_4",
                "title_es": "Protocol d’higiene",
                "title_ca": "Protocol d’higiene",
                "description_es": "Integrar un cosmètic d’higiene dins un protocol facial senzill.",
                "description_ca": "Integrar un cosmètic d’higiene dins un protocol facial senzill.",
                "evidence_es": "Protocol pas a pas.",
                "evidence_ca": "Protocol pas a pas.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final."
              },
              {
                "id": "act_0641_C5_5",
                "title_es": "Tònic explicat",
                "title_ca": "Tònic explicat",
                "description_es": "Explicar a una clienta per què s’utilitza un tònic facial.",
                "description_ca": "Explicar a una clienta per què s’utilitza un tònic facial.",
                "evidence_es": "Diàleg professional.",
                "evidence_ca": "Diàleg professional.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final."
              },
              {
                "id": "act_0641_C5_6",
                "title_es": "Higiene i microorganismes",
                "title_ca": "Higiene i microorganismes",
                "description_es": "Relacionar ús correcte del cosmètic amb prevenció de contaminació.",
                "description_ca": "Relacionar ús correcte del cosmètic amb prevenció de contaminació.",
                "evidence_es": "Mesures preventives.",
                "evidence_ca": "Mesures preventives.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C5_7",
                "title_es": "Comparativa de netejadors",
                "title_ca": "Comparativa de netejadors",
                "description_es": "Comparar dos productes netejadors per composició i ús.",
                "description_ca": "Comparar dos productes netejadors per composició i ús.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica.",
                "diversitySupport_ca": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica."
              },
              {
                "id": "act_0641_C5_8",
                "title_es": "Cartell de cabina",
                "title_ca": "Cartell de cabina",
                "description_es": "Crear un cartell sobre ús higiènic de cosmètics d’higiene.",
                "description_ca": "Crear un cartell sobre ús higiènic de cosmètics d’higiene.",
                "evidence_es": "Cartell normatiu.",
                "evidence_ca": "Cartell normatiu.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C5_9",
                "title_es": "Ressenya professional",
                "title_ca": "Ressenya professional",
                "description_es": "Redactar una ressenya tècnica breu d’un producte d’higiene.",
                "description_ca": "Redactar una ressenya tècnica breu d’un producte d’higiene.",
                "evidence_es": "Ressenya tècnica.",
                "evidence_ca": "Ressenya tècnica.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              }
            ]
          }
        ]
      },
      {
        "id": "0641_RA5",
        "code": "RA5",
        "text_es": "Resultado de aprendizaje 5",
        "text_ca": "Resultat d'aprenentatge 5",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Hidratació, manteniment i fotoprotecció",
            "title_ca": "Hidratació, manteniment i fotoprotecció",
            "targetModuleCode": "0641",
            "targetModuleName_es": "Cosmetología para estética y belleza",
            "targetModuleName_ca": "Cosmetologia per a estètica i bellesa",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La hidratació cutània i la fotoprotecció exigeixen seleccionar principis actius, adaptar-los al tipus de pell i comunicar pautes saludables de protecció solar.",
            "justification_ca": "La hidratació cutània i la fotoprotecció exigeixen seleccionar principis actius, adaptar-los al tipus de pell i comunicar pautes saludables de protecció solar.",
            "activities": [
              {
                "id": "act_0641_C6_1",
                "title_es": "Hidratant segons pell",
                "title_ca": "Hidratant segons pell",
                "description_es": "Triar actius hidratants per a casos de pell seca, mixta o sensible.",
                "description_ca": "Triar actius hidratants per a casos de pell seca, mixta o sensible.",
                "evidence_es": "Recomanació justificada.",
                "evidence_ca": "Recomanació justificada.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C6_2",
                "title_es": "SPF sense embolics",
                "title_ca": "SPF sense embolics",
                "description_es": "Explicar de manera senzilla què indica un fotoprotector i la resistència a l’aigua.",
                "description_ca": "Explicar de manera senzilla què indica un fotoprotector i la resistència a l’aigua.",
                "evidence_es": "Guió divulgatiu.",
                "evidence_ca": "Guió divulgatiu.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat."
              },
              {
                "id": "act_0641_C6_3",
                "title_es": "After sun",
                "title_ca": "After sun",
                "description_es": "Relacionar composició d’un producte postsolar amb la seva funció.",
                "description_ca": "Relacionar composició d’un producte postsolar amb la seva funció.",
                "evidence_es": "Fitxa postsolar.",
                "evidence_ca": "Fitxa postsolar.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C6_4",
                "title_es": "Consells en anglès",
                "title_ca": "Consells en anglès",
                "description_es": "Redactar consells bàsics de sun protection en anglès funcional.",
                "description_ca": "Redactar consells bàsics de sun protection en anglès funcional.",
                "evidence_es": "Targeta bilingüe.",
                "evidence_ca": "Targeta bilingüe.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C6_5",
                "title_es": "Mite solar",
                "title_ca": "Mite solar",
                "description_es": "Detectar mites sobre bronzejat i protecció solar.",
                "description_ca": "Detectar mites sobre bronzejat i protecció solar.",
                "evidence_es": "Fitxa mite/realitat.",
                "evidence_ca": "Fitxa mite/realitat.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C6_6",
                "title_es": "Routine card",
                "title_ca": "Routine card",
                "description_es": "Crear una targeta de rutina hidratant i solar per a clientela jove.",
                "description_ca": "Crear una targeta de rutina hidratant i solar per a clientela jove.",
                "evidence_es": "Targeta de rutina.",
                "evidence_ca": "Targeta de rutina.",
                "diversitySupport_es": "S’ofereixen targetes de rol amb frases d’inici, vocabulari tècnic i possibles respostes; es permet assajar en parella, gravar àudio o assumir el rol d’observador/a tècnic/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol amb frases d’inici, vocabulari tècnic i possibles respostes; es permet assajar en parella, gravar àudio o assumir el rol d’observador/a tècnic/a amb rúbrica."
              },
              {
                "id": "act_0641_C6_7",
                "title_es": "Aigua i pell",
                "title_ca": "Aigua i pell",
                "description_es": "Relacionar hidratació corporal, pell i cosmètics hidratants sense exageracions.",
                "description_ca": "Relacionar hidratació corporal, pell i cosmètics hidratants sense exageracions.",
                "evidence_es": "Conclusió de grup.",
                "evidence_ca": "Conclusió de grup.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat."
              },
              {
                "id": "act_0641_C6_8",
                "title_es": "Fotoprotector ideal",
                "title_ca": "Fotoprotector ideal",
                "description_es": "Seleccionar fotoprotector segons activitat, pell i moment d’aplicació.",
                "description_ca": "Seleccionar fotoprotector segons activitat, pell i moment d’aplicació.",
                "evidence_es": "Fitxa de selecció.",
                "evidence_ca": "Fitxa de selecció.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C6_9",
                "title_es": "Campanya solar",
                "title_ca": "Campanya solar",
                "description_es": "Dissenyar una mini campanya positiva de fotoprotecció.",
                "description_ca": "Dissenyar una mini campanya positiva de fotoprotecció.",
                "evidence_es": "Cartell o post.",
                "evidence_ca": "Cartell o post.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              }
            ]
          }
        ]
      },
      {
        "id": "0641_RA6",
        "code": "RA6",
        "text_es": "Resultado de aprendizaje 6",
        "text_ca": "Resultat d'aprenentatge 6",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Cosmètics decoratius i innovació",
            "title_ca": "Cosmètics decoratius i innovació",
            "targetModuleCode": "0641",
            "targetModuleName_es": "Cosmetología para estética y belleza",
            "targetModuleName_ca": "Cosmetologia per a estètica i bellesa",
            "targetRaCode": "RA6",
            "targetRaText_es": "Resultado de aprendizaje 6",
            "targetRaText_ca": "Resultat d'aprenentatge 6",
            "relationType": "tecnica",
            "justification_es": "Els cosmètics decoratius connecten composició, zona d’aplicació, maquillatge d’ungles, aparatologia i innovacions que es difonen sovint en canals digitals.",
            "justification_ca": "Els cosmètics decoratius connecten composició, zona d’aplicació, maquillatge d’ungles, aparatologia i innovacions que es difonen sovint en canals digitals.",
            "activities": [
              {
                "id": "act_0641_C7_1",
                "title_es": "Carta decorativa",
                "title_ca": "Carta decorativa",
                "description_es": "Classificar cosmètics decoratius segons zona d’aplicació.",
                "description_ca": "Classificar cosmètics decoratius segons zona d’aplicació.",
                "evidence_es": "Carta de productes.",
                "evidence_ca": "Carta de productes.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C7_2",
                "title_es": "Ungles i composició",
                "title_ca": "Ungles i composició",
                "description_es": "Relacionar cosmètics de maquillatge d’ungles amb la seva composició bàsica.",
                "description_ca": "Relacionar cosmètics de maquillatge d’ungles amb la seva composició bàsica.",
                "evidence_es": "Fitxa d’ungles.",
                "evidence_ca": "Fitxa d’ungles.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C7_3",
                "title_es": "Innovació real?",
                "title_ca": "Innovació real?",
                "description_es": "Analitzar una notícia o dossier sobre innovació en cosmètica decorativa.",
                "description_ca": "Analitzar una notícia o dossier sobre innovació en cosmètica decorativa.",
                "evidence_es": "Resum valoratiu.",
                "evidence_ca": "Resum valoratiu.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C7_4",
                "title_es": "Moodboard responsable",
                "title_ca": "Moodboard responsable",
                "description_es": "Crear un moodboard de maquillatge sense estereotips ni promeses falses.",
                "description_ca": "Crear un moodboard de maquillatge sense estereotips ni promeses falses.",
                "evidence_es": "Moodboard.",
                "evidence_ca": "Moodboard.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C7_5",
                "title_es": "Producte viral",
                "title_ca": "Producte viral",
                "description_es": "Avaluar si un cosmètic decoratiu viral és coherent amb criteris professionals.",
                "description_ca": "Avaluar si un cosmètic decoratiu viral és coherent amb criteris professionals.",
                "evidence_es": "Informe breu.",
                "evidence_ca": "Informe breu.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C7_6",
                "title_es": "Aparell i decoració",
                "title_ca": "Aparell i decoració",
                "description_es": "Relacionar un equip estètic amb serveis on es poden usar cosmètics decoratius.",
                "description_ca": "Relacionar un equip estètic amb serveis on es poden usar cosmètics decoratius.",
                "evidence_es": "Esquema servei-equip.",
                "evidence_ca": "Esquema servei-equip.",
                "diversitySupport_es": "S’entrega un esquema base i peces retallables amb conceptes cosmètics; l’alumnat pot construir-lo de manera manipulativa i després passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega un esquema base i peces retallables amb conceptes cosmètics; l’alumnat pot construir-lo de manera manipulativa i després passar-lo a format escrit o digital."
              },
              {
                "id": "act_0641_C7_7",
                "title_es": "Post professional",
                "title_ca": "Post professional",
                "description_es": "Crear un post digital d’un cosmètic decoratiu amb informació tècnica correcta.",
                "description_ca": "Crear un post digital d’un cosmètic decoratiu amb informació tècnica correcta.",
                "evidence_es": "Post o carrusel.",
                "evidence_ca": "Post o carrusel.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C7_8",
                "title_es": "Disseny d’ungla",
                "title_ca": "Disseny d’ungla",
                "description_es": "Dissenyar una ungla i justificar el cosmètic decoratiu utilitzat.",
                "description_ca": "Dissenyar una ungla i justificar el cosmètic decoratiu utilitzat.",
                "evidence_es": "Disseny justificat.",
                "evidence_ca": "Disseny justificat.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal."
              },
              {
                "id": "act_0641_C7_9",
                "title_es": "Pitch d’innovació",
                "title_ca": "Pitch d’innovació",
                "description_es": "Presentar una innovació cosmètica decorativa a la classe.",
                "description_ca": "Presentar una innovació cosmètica decorativa a la classe.",
                "evidence_es": "Pitch de 60 segons.",
                "evidence_ca": "Pitch de 60 segons.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat."
              }
            ]
          }
        ]
      },
      {
        "id": "0641_RA7",
        "code": "RA7",
        "text_es": "Resultado de aprendizaje 7",
        "text_ca": "Resultat d'aprenentatge 7",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Cosmètics per a annexos: depilació, decoloració, mans i peus",
            "title_ca": "Cosmètics per a annexos: depilació, decoloració, mans i peus",
            "targetModuleCode": "0641",
            "targetModuleName_es": "Cosmetología para estética y belleza",
            "targetModuleName_ca": "Cosmetologia per a estètica i bellesa",
            "targetRaCode": "RA7",
            "targetRaText_es": "Resultado de aprendizaje 7",
            "targetRaText_ca": "Resultat d'aprenentatge 7",
            "relationType": "tecnica",
            "justification_es": "Els cosmètics de depilació, decoloració, manicura i pedicura s’han de seleccionar segons composició, efectes, servei estètic i possibles alteracions de mans, peus o pell.",
            "justification_ca": "Els cosmètics de depilació, decoloració, manicura i pedicura s’han de seleccionar segons composició, efectes, servei estètic i possibles alteracions de mans, peus o pell.",
            "activities": [
              {
                "id": "act_0641_C8_1",
                "title_es": "Cera adequada",
                "title_ca": "Cera adequada",
                "description_es": "Seleccionar tipus de cera segons zona, pell i servei.",
                "description_ca": "Seleccionar tipus de cera segons zona, pell i servei.",
                "evidence_es": "Fitxa de selecció.",
                "evidence_ca": "Fitxa de selecció.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C8_2",
                "title_es": "Pre i post depilació",
                "title_ca": "Pre i post depilació",
                "description_es": "Relacionar cosmètics pre i post depilatoris amb efectes i ús.",
                "description_ca": "Relacionar cosmètics pre i post depilatoris amb efectes i ús.",
                "evidence_es": "Taula pre/post.",
                "evidence_ca": "Taula pre/post.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C8_3",
                "title_es": "Decolorant amb precaució",
                "title_ca": "Decolorant amb precaució",
                "description_es": "Explicar com actua un cosmètic decolorant i quines precaucions exigeix.",
                "description_ca": "Explicar com actua un cosmètic decolorant i quines precaucions exigeix.",
                "evidence_es": "Guió tècnic.",
                "evidence_ca": "Guió tècnic.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, banc de paraules i targetes de suport; es pot presentar en parella o amb suport visual per reduir la càrrega memorística i l’ansietat."
              },
              {
                "id": "act_0641_C8_4",
                "title_es": "Mans i peus",
                "title_ca": "Mans i peus",
                "description_es": "Triar cosmètics per a un tractament de mans o peus segons cas.",
                "description_ca": "Triar cosmètics per a un tractament de mans o peus segons cas.",
                "evidence_es": "Proposta de tractament.",
                "evidence_ca": "Proposta de tractament.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C8_5",
                "title_es": "Alteració visible",
                "title_ca": "Alteració visible",
                "description_es": "Decidir si un cosmètic és adequat quan hi ha una alteració en ungles o pell.",
                "description_ca": "Decidir si un cosmètic és adequat quan hi ha una alteració en ungles o pell.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C8_6",
                "title_es": "Comparativa de ceres",
                "title_ca": "Comparativa de ceres",
                "description_es": "Comparar dos tipus de cera per composició, ús i avantatges.",
                "description_ca": "Comparar dos tipus de cera per composició, ús i avantatges.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica.",
                "diversitySupport_ca": "Es dona una taula amb categories definides i un exemple resolt; es permet treballar amb envasos o imatges reals dels cosmètics abans d’escriure la justificació tècnica."
              },
              {
                "id": "act_0641_C8_7",
                "title_es": "Protocol cosmètic",
                "title_ca": "Protocol cosmètic",
                "description_es": "Integrar cosmètics d’annexos dins un servei de depilació o pedicura.",
                "description_ca": "Integrar cosmètics d’annexos dins un servei de depilació o pedicura.",
                "evidence_es": "Protocol visual.",
                "evidence_ca": "Protocol visual.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final."
              },
              {
                "id": "act_0641_C8_8",
                "title_es": "Cartell de precaucions",
                "title_ca": "Cartell de precaucions",
                "description_es": "Crear un cartell amb precaucions d’ús per decolorants o ceres.",
                "description_ca": "Crear un cartell amb precaucions d’ús per decolorants o ceres.",
                "evidence_es": "Cartell de seguretat.",
                "evidence_ca": "Cartell de seguretat.",
                "diversitySupport_es": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa.",
                "diversitySupport_ca": "Es proporcionen exemples visuals, icones de cosmètics i una graella de composició; els rols es reparteixen entre recerca, redacció, disseny i revisió tècnica per garantir participació diversa."
              },
              {
                "id": "act_0641_C8_9",
                "title_es": "Role-play assessor",
                "title_ca": "Role-play assessor",
                "description_es": "Recomanar a una clienta un cosmètic postdepilatori o de mans-peus.",
                "description_ca": "Recomanar a una clienta un cosmètic postdepilatori o de mans-peus.",
                "evidence_es": "Diàleg professional.",
                "evidence_ca": "Diàleg professional.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final."
              }
            ]
          }
        ]
      },
      {
        "id": "0641_RA8",
        "code": "RA8",
        "text_es": "Resultado de aprendizaje 8",
        "text_ca": "Resultat d'aprenentatge 8",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Emmagatzematge, manipulació, alteracions i reaccions adverses",
            "title_ca": "Emmagatzematge, manipulació, alteracions i reaccions adverses",
            "targetModuleCode": "0641",
            "targetModuleName_es": "Cosmetología para estética y belleza",
            "targetModuleName_ca": "Cosmetologia per a estètica i bellesa",
            "targetRaCode": "RA8",
            "targetRaText_es": "Resultado de aprendizaje 8",
            "targetRaText_ca": "Resultat d'aprenentatge 8",
            "relationType": "tecnica",
            "justification_es": "La seguretat cosmètica exigeix conservar i manipular productes adequadament, prevenir reaccions adverses i saber actuar davant accidents o incidències professionals.",
            "justification_ca": "La seguretat cosmètica exigeix conservar i manipular productes adequadament, prevenir reaccions adverses i saber actuar davant accidents o incidències professionals.",
            "activities": [
              {
                "id": "act_0641_C9_1",
                "title_es": "Magatzem segur",
                "title_ca": "Magatzem segur",
                "description_es": "Organitzar un espai d’emmagatzematge cosmètic segons condicions òptimes.",
                "description_ca": "Organitzar un espai d’emmagatzematge cosmètic segons condicions òptimes.",
                "evidence_es": "Plànol de magatzem.",
                "evidence_ca": "Plànol de magatzem.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C9_2",
                "title_es": "Cosmètic alterat",
                "title_ca": "Cosmètic alterat",
                "description_es": "Detectar canvis organolèptics que indiquen que un producte no és apte.",
                "description_ca": "Detectar canvis organolèptics que indiquen que un producte no és apte.",
                "evidence_es": "Informe de retirada.",
                "evidence_ca": "Informe de retirada.",
                "diversitySupport_es": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal.",
                "diversitySupport_ca": "La pràctica es fragmenta en passos curts amb demostració prèvia i normes de seguretat visibles; es permet observar primer, treballar amb parella tutora i repetir la fase manipulativa si cal."
              },
              {
                "id": "act_0641_C9_3",
                "title_es": "Manipulació higiènica",
                "title_ca": "Manipulació higiènica",
                "description_es": "Crear pautes de manipulació de cosmètics durant un servei.",
                "description_ca": "Crear pautes de manipulació de cosmètics durant un servei.",
                "evidence_es": "Checklist d’ús.",
                "evidence_ca": "Checklist d’ús.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final."
              },
              {
                "id": "act_0641_C9_4",
                "title_es": "Reacció adversa",
                "title_ca": "Reacció adversa",
                "description_es": "Simular l’actuació professional davant una reacció adversa a un cosmètic.",
                "description_ca": "Simular l’actuació professional davant una reacció adversa a un cosmètic.",
                "evidence_es": "Protocol d’actuació.",
                "evidence_ca": "Protocol d’actuació.",
                "diversitySupport_es": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla específica amb apartats ja ordenats, vocabulari cosmètic clau i un exemple parcialment completat; l’alumnat pot començar amb paraules, icones o codis de color abans de redactar la versió final."
              },
              {
                "id": "act_0641_C9_5",
                "title_es": "Recollida responsable",
                "title_ca": "Recollida responsable",
                "description_es": "Decidir què fer amb productes contaminats o caducats.",
                "description_ca": "Decidir què fer amb productes contaminats o caducats.",
                "evidence_es": "Decisió ambiental i sanitària.",
                "evidence_ca": "Decisió ambiental i sanitària.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; l’alumnat utilitza un arbre de decisió i pot justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_0641_C9_6",
                "title_es": "Risc professional",
                "title_ca": "Risc professional",
                "description_es": "Relacionar manipulació incorrecta amb riscos o malalties professionals.",
                "description_ca": "Relacionar manipulació incorrecta amb riscos o malalties professionals.",
                "evidence_es": "Targetes risc-prevenció.",
                "evidence_ca": "Targetes risc-prevenció.",
                "diversitySupport_es": "Les regles es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les.",
                "diversitySupport_ca": "Les regles es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les."
              },
              {
                "id": "act_0641_C9_7",
                "title_es": "Auditoria d’armari",
                "title_ca": "Auditoria d’armari",
                "description_es": "Revisar un armari cosmètic simulat i proposar millores.",
                "description_ca": "Revisar un armari cosmètic simulat i proposar millores.",
                "evidence_es": "Rúbrica d’auditoria.",
                "evidence_ca": "Rúbrica d’auditoria.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              },
              {
                "id": "act_0641_C9_8",
                "title_es": "Accident amb producte",
                "title_ca": "Accident amb producte",
                "description_es": "Aplicar passos bàsics davant una incidència amb cosmètics.",
                "description_ca": "Aplicar passos bàsics davant una incidència amb cosmètics.",
                "evidence_es": "Resposta PAS adaptada.",
                "evidence_ca": "Resposta PAS adaptada.",
                "diversitySupport_es": "S’ofereixen targetes de rol amb frases d’inici, vocabulari tècnic i possibles respostes; es permet assajar en parella, gravar àudio o assumir el rol d’observador/a tècnic/a amb rúbrica.",
                "diversitySupport_ca": "S’ofereixen targetes de rol amb frases d’inici, vocabulari tècnic i possibles respostes; es permet assajar en parella, gravar àudio o assumir el rol d’observador/a tècnic/a amb rúbrica."
              },
              {
                "id": "act_0641_C9_9",
                "title_es": "Decàleg cosmètic",
                "title_ca": "Decàleg cosmètic",
                "description_es": "Crear normes d’aula per conservar, manipular i retirar cosmètics.",
                "description_ca": "Crear normes d’aula per conservar, manipular i retirar cosmètics.",
                "evidence_es": "Decàleg de seguretat.",
                "evidence_ca": "Decàleg de seguretat.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir entre resposta oral, escrita o visual mantenint el rigor cosmètic del contingut."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "1664",
    "name_es": "Digitalización aplicada a los sectores productivos",
    "name_ca": "Digitalització aplicada als sectors productius",
    "type": "especifico",
    "color": "#a78bfa",
    "icon": "book",
    "learningOutcomes": [
      {
        "id": "1664_RA1",
        "code": "RA1",
        "text_es": "Resultado de aprendizaje 1",
        "text_ca": "Resultat d'aprenentatge 1",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Economia circular, residus i sostenibilitat en el saló d’estètica",
            "title_ca": "Economia circular, residus i sostenibilitat en el saló d’estètica",
            "targetModuleCode": "1664",
            "targetModuleName_es": "Digitalización aplicada a los sectores productivos",
            "targetModuleName_ca": "Digitalització aplicada als sectors productius",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "La digitalització del sector ha d’anar lligada a la sostenibilitat: gestió de residus, reducció d’impacte ambiental, traçabilitat de productes i millora de la qualitat del servei.",
            "justification_ca": "La digitalització del sector ha d’anar lligada a la sostenibilitat: gestió de residus, reducció d’impacte ambiental, traçabilitat de productes i millora de la qualitat del servei.",
            "activities": [
              {
                "id": "act_1664_C1_1",
                "title_es": "Del lineal al circular",
                "title_ca": "Del lineal al circular",
                "description_es": "Comparar el recorregut d’un cosmètic en un model lineal i en un model circular.",
                "description_ca": "Comparar el recorregut d’un cosmètic en un model lineal i en un model circular.",
                "evidence_es": "Diagrama EL/EC.",
                "evidence_ca": "Diagrama EL/EC.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              },
              {
                "id": "act_1664_C1_2",
                "title_es": "Residus de cabina",
                "title_ca": "Residus de cabina",
                "description_es": "Classificar residus d’un servei d’higiene facial segons risc i possibilitat de reducció.",
                "description_ca": "Classificar residus d’un servei d’higiene facial segons risc i possibilitat de reducció.",
                "evidence_es": "Taula de residus.",
                "evidence_ca": "Taula de residus.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica."
              },
              {
                "id": "act_1664_C1_3",
                "title_es": "Ecoauditoria del taller",
                "title_ca": "Ecoauditoria del taller",
                "description_es": "Detectar pràctiques de consum i residus millorables en l’aula-taller.",
                "description_ca": "Detectar pràctiques de consum i residus millorables en l’aula-taller.",
                "evidence_es": "Informe d’ecoauditoria.",
                "evidence_ca": "Informe d’ecoauditoria.",
                "diversitySupport_es": "La tasca es fragmenta en passos curts amb demostració prèvia; es pot observar abans d’executar, treballar amb parella de suport i lliurar un prototip senzill en lloc d’un producte complet.",
                "diversitySupport_ca": "La tasca es fragmenta en passos curts amb demostració prèvia; es pot observar abans d’executar, treballar amb parella de suport i lliurar un prototip senzill en lloc d’un producte complet."
              },
              {
                "id": "act_1664_C1_4",
                "title_es": "ODS en estètica",
                "title_ca": "ODS en estètica",
                "description_es": "Relacionar accions d’un saló amb ODS concrets i impacte ambiental.",
                "description_ca": "Relacionar accions d’un saló amb ODS concrets i impacte ambiental.",
                "evidence_es": "Mural ODS.",
                "evidence_ca": "Mural ODS.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C1_5",
                "title_es": "Cosmètic contaminat",
                "title_ca": "Cosmètic contaminat",
                "description_es": "Decidir què fer amb productes alterats o contaminats respectant normativa i medi ambient.",
                "description_ca": "Decidir què fer amb productes alterats o contaminats respectant normativa i medi ambient.",
                "evidence_es": "Decisió justificada.",
                "evidence_ca": "Decisió justificada.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1664_C1_6",
                "title_es": "Indicador verd",
                "title_ca": "Indicador verd",
                "description_es": "Crear un indicador senzill per mesurar reducció de residus al taller.",
                "description_ca": "Crear un indicador senzill per mesurar reducció de residus al taller.",
                "evidence_es": "Indicador i fórmula.",
                "evidence_ca": "Indicador i fórmula.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica."
              },
              {
                "id": "act_1664_C1_7",
                "title_es": "Cartell circular",
                "title_ca": "Cartell circular",
                "description_es": "Dissenyar un cartell per promoure pràctiques sostenibles en cabina.",
                "description_ca": "Dissenyar un cartell per promoure pràctiques sostenibles en cabina.",
                "evidence_es": "Cartell de sostenibilitat.",
                "evidence_ca": "Cartell de sostenibilitat.",
                "diversitySupport_es": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses.",
                "diversitySupport_ca": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses."
              },
              {
                "id": "act_1664_C1_8",
                "title_es": "Abans i després sostenible",
                "title_ca": "Abans i després sostenible",
                "description_es": "Redissenyar un servei perquè generi menys residus sense perdre qualitat.",
                "description_ca": "Redissenyar un servei perquè generi menys residus sense perdre qualitat.",
                "evidence_es": "Servei redissenyat.",
                "evidence_ca": "Servei redissenyat.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C1_9",
                "title_es": "Pitch eco-saló",
                "title_ca": "Pitch eco-saló",
                "description_es": "Presentar una proposta de saló més circular i professional.",
                "description_ca": "Presentar una proposta de saló més circular i professional.",
                "evidence_es": "Pitch de 60 segons.",
                "evidence_ca": "Pitch de 60 segons.",
                "diversitySupport_es": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses.",
                "diversitySupport_ca": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses."
              }
            ]
          }
        ]
      },
      {
        "id": "1664_RA2",
        "code": "RA2",
        "text_es": "Resultado de aprendizaje 2",
        "text_ca": "Resultat d'aprenentatge 2",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Experiència de clientela 4.0 i atenció professional",
            "title_ca": "Experiència de clientela 4.0 i atenció professional",
            "targetModuleCode": "1664",
            "targetModuleName_es": "Digitalización aplicada a los sectores productivos",
            "targetModuleName_ca": "Digitalització aplicada als sectors productius",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "La quarta revolució industrial transforma l’atenció a la clientela: cites digitals, fitxes, comunicació multicanal, serveis més personalitzats i nous perfils professionals.",
            "justification_ca": "La quarta revolució industrial transforma l’atenció a la clientela: cites digitals, fitxes, comunicació multicanal, serveis més personalitzats i nous perfils professionals.",
            "activities": [
              {
                "id": "act_1664_C2_1",
                "title_es": "Customer journey 4.0",
                "title_ca": "Customer journey 4.0",
                "description_es": "Dibuixar el recorregut d’una clienta des de la reserva online fins al seguiment postservei.",
                "description_ca": "Dibuixar el recorregut d’una clienta des de la reserva online fins al seguiment postservei.",
                "evidence_es": "Customer journey.",
                "evidence_ca": "Customer journey.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C2_2",
                "title_es": "Reserva digital",
                "title_ca": "Reserva digital",
                "description_es": "Simular una reserva i recollida de dades bàsiques per a un servei estètic.",
                "description_ca": "Simular una reserva i recollida de dades bàsiques per a un servei estètic.",
                "evidence_es": "Flux de reserva.",
                "evidence_ca": "Flux de reserva.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C2_3",
                "title_es": "Atenció bilingüe",
                "title_ca": "Atenció bilingüe",
                "description_es": "Practicar un missatge breu en anglès per confirmar una cita.",
                "description_ca": "Practicar un missatge breu en anglès per confirmar una cita.",
                "evidence_es": "Missatge bilingüe.",
                "evidence_ca": "Missatge bilingüe.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C2_4",
                "title_es": "Clienta omnicanal",
                "title_ca": "Clienta omnicanal",
                "description_es": "Decidir quin canal usar segons situació: telèfon, app, xarxa o presencial.",
                "description_ca": "Decidir quin canal usar segons situació: telèfon, app, xarxa o presencial.",
                "evidence_es": "Taula canal-situació.",
                "evidence_ca": "Taula canal-situació.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C2_5",
                "title_es": "Fitxa més útil",
                "title_ca": "Fitxa més útil",
                "description_es": "Redissenyar una fitxa d’entrevista perquè sigui clara en format digital.",
                "description_ca": "Redissenyar una fitxa d’entrevista perquè sigui clara en format digital.",
                "evidence_es": "Fitxa digital prototip.",
                "evidence_ca": "Fitxa digital prototip.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              },
              {
                "id": "act_1664_C2_6",
                "title_es": "Avantatges 4.0",
                "title_ca": "Avantatges 4.0",
                "description_es": "Comparar avantatges de digitalitzar l’atenció per empresa i clientela.",
                "description_ca": "Comparar avantatges de digitalitzar l’atenció per empresa i clientela.",
                "evidence_es": "Llista argumentada.",
                "evidence_ca": "Llista argumentada.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C2_7",
                "title_es": "Perfil professional",
                "title_ca": "Perfil professional",
                "description_es": "Relacionar competències digitals amb ocupabilitat en estètica.",
                "description_ca": "Relacionar competències digitals amb ocupabilitat en estètica.",
                "evidence_es": "Mini perfil competencial.",
                "evidence_ca": "Mini perfil competencial.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C2_8",
                "title_es": "Error de comunicació",
                "title_ca": "Error de comunicació",
                "description_es": "Corregir un missatge digital poc professional enviat a una clienta.",
                "description_ca": "Corregir un missatge digital poc professional enviat a una clienta.",
                "evidence_es": "Missatge corregit.",
                "evidence_ca": "Missatge corregit.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C2_9",
                "title_es": "Mini demo de servei",
                "title_ca": "Mini demo de servei",
                "description_es": "Presentar com funcionaria una cita digital en un saló 4.0.",
                "description_ca": "Presentar com funcionaria una cita digital en un saló 4.0.",
                "evidence_es": "Guió de demostració.",
                "evidence_ca": "Guió de demostració.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              }
            ]
          }
        ]
      },
      {
        "id": "1664_RA3",
        "code": "RA3",
        "text_es": "Resultado de aprendizaje 3",
        "text_ca": "Resultat d'aprenentatge 3",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Núvol, fitxes digitals i registre segur de serveis",
            "title_ca": "Núvol, fitxes digitals i registre segur de serveis",
            "targetModuleCode": "1664",
            "targetModuleName_es": "Digitalización aplicada a los sectores productivos",
            "targetModuleName_ca": "Digitalització aplicada als sectors productius",
            "targetRaCode": "RA3",
            "targetRaText_es": "Resultado de aprendizaje 3",
            "targetRaText_ca": "Resultat d'aprenentatge 3",
            "relationType": "tecnica",
            "justification_es": "Els sistemes en núvol permeten registrar i compartir informació de serveis, però exigeixen organització, criteri professional i protecció de dades de la clientela.",
            "justification_ca": "Els sistemes en núvol permeten registrar i compartir informació de serveis, però exigeixen organització, criteri professional i protecció de dades de la clientela.",
            "activities": [
              {
                "id": "act_1664_C3_1",
                "title_es": "Què va al núvol?",
                "title_ca": "Què va al núvol?",
                "description_es": "Identificar quina informació d’una fitxa de clienta podria guardar-se en un sistema cloud.",
                "description_ca": "Identificar quina informació d’una fitxa de clienta podria guardar-se en un sistema cloud.",
                "evidence_es": "Taula de dades.",
                "evidence_ca": "Taula de dades.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              },
              {
                "id": "act_1664_C3_2",
                "title_es": "Fitxa facial digital",
                "title_ca": "Fitxa facial digital",
                "description_es": "Transformar una fitxa d’higiene facial en un formulari digital senzill.",
                "description_ca": "Transformar una fitxa d’higiene facial en un formulari digital senzill.",
                "evidence_es": "Formulari prototip.",
                "evidence_ca": "Formulari prototip.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              },
              {
                "id": "act_1664_C3_3",
                "title_es": "Fitxa mans-peus",
                "title_ca": "Fitxa mans-peus",
                "description_es": "Crear camps digitals per registrar un servei de manicura o pedicura.",
                "description_ca": "Crear camps digitals per registrar un servei de manicura o pedicura.",
                "evidence_es": "Fitxa digital.",
                "evidence_ca": "Fitxa digital.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              },
              {
                "id": "act_1664_C3_4",
                "title_es": "Nivells cloud",
                "title_ca": "Nivells cloud",
                "description_es": "Representar de manera visual nivells bàsics de núvol i funcions.",
                "description_ca": "Representar de manera visual nivells bàsics de núvol i funcions.",
                "evidence_es": "Esquema cloud.",
                "evidence_ca": "Esquema cloud.",
                "diversitySupport_es": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses.",
                "diversitySupport_ca": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses."
              },
              {
                "id": "act_1664_C3_5",
                "title_es": "Dada sensible",
                "title_ca": "Dada sensible",
                "description_es": "Detectar dades personals o sensibles en una fitxa estètica.",
                "description_ca": "Detectar dades personals o sensibles en una fitxa estètica.",
                "evidence_es": "Llista de dades protegides.",
                "evidence_ca": "Llista de dades protegides.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              },
              {
                "id": "act_1664_C3_6",
                "title_es": "Avantatge o risc",
                "title_ca": "Avantatge o risc",
                "description_es": "Comparar avantatges i riscos de compartir fitxes al núvol.",
                "description_ca": "Comparar avantatges i riscos de compartir fitxes al núvol.",
                "evidence_es": "Taula pros/contres.",
                "evidence_ca": "Taula pros/contres.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica."
              },
              {
                "id": "act_1664_C3_7",
                "title_es": "Permisos d’accés",
                "title_ca": "Permisos d’accés",
                "description_es": "Decidir qui pot veure o editar diferents dades d’un saló.",
                "description_ca": "Decidir qui pot veure o editar diferents dades d’un saló.",
                "evidence_es": "Matriz de permisos.",
                "evidence_ca": "Matriz de permisos.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C3_8",
                "title_es": "Backup de cabina",
                "title_ca": "Backup de cabina",
                "description_es": "Dissenyar una rutina senzilla de còpia de seguretat de fitxes.",
                "description_ca": "Dissenyar una rutina senzilla de còpia de seguretat de fitxes.",
                "evidence_es": "Checklist de backup.",
                "evidence_ca": "Checklist de backup.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              },
              {
                "id": "act_1664_C3_9",
                "title_es": "Explica-ho fàcil",
                "title_ca": "Explica-ho fàcil",
                "description_es": "Explicar a una clienta per què es guarden dades i com es protegeixen.",
                "description_ca": "Explicar a una clienta per què es guarden dades i com es protegeixen.",
                "evidence_es": "Guió informatiu.",
                "evidence_ca": "Guió informatiu.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              }
            ]
          }
        ]
      },
      {
        "id": "1664_RA4",
        "code": "RA4",
        "text_es": "Resultado de aprendizaje 4",
        "text_ca": "Resultat d'aprenentatge 4",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Tecnologies habilitadores aplicades a cabina i aparatologia",
            "title_ca": "Tecnologies habilitadores aplicades a cabina i aparatologia",
            "targetModuleCode": "1664",
            "targetModuleName_es": "Digitalización aplicada a los sectores productivos",
            "targetModuleName_ca": "Digitalització aplicada als sectors productius",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "IoT, IA, Big Data, ciberseguretat, realitat virtual o sensors poden millorar serveis d’higiene, depilació i anàlisi, sempre que es relacionin amb necessitats reals del sector.",
            "justification_ca": "IoT, IA, Big Data, ciberseguretat, realitat virtual o sensors poden millorar serveis d’higiene, depilació i anàlisi, sempre que es relacionin amb necessitats reals del sector.",
            "activities": [
              {
                "id": "act_1664_C4_1",
                "title_es": "THD en estètica",
                "title_ca": "THD en estètica",
                "description_es": "Relacionar tecnologies habilitadores amb serveis concrets d’un saló.",
                "description_ca": "Relacionar tecnologies habilitadores amb serveis concrets d’un saló.",
                "evidence_es": "Taula tecnologia-servei.",
                "evidence_ca": "Taula tecnologia-servei.",
                "diversitySupport_es": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses.",
                "diversitySupport_ca": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses."
              },
              {
                "id": "act_1664_C4_2",
                "title_es": "Aparell connectat",
                "title_ca": "Aparell connectat",
                "description_es": "Imaginar un aparell d’higiene facial amb sensors i dades útils.",
                "description_ca": "Imaginar un aparell d’higiene facial amb sensors i dades útils.",
                "evidence_es": "Prototip descriptiu.",
                "evidence_ca": "Prototip descriptiu.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C4_3",
                "title_es": "Depilació amb dades",
                "title_ca": "Depilació amb dades",
                "description_es": "Proposar com registrar paràmetres d’un servei de depilació per millorar-lo.",
                "description_ca": "Proposar com registrar paràmetres d’un servei de depilació per millorar-lo.",
                "evidence_es": "Fitxa de dades.",
                "evidence_ca": "Fitxa de dades.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C4_4",
                "title_es": "IA o no IA",
                "title_ca": "IA o no IA",
                "description_es": "Distingir usos realistes i exagerats de la IA en estètica.",
                "description_ca": "Distingir usos realistes i exagerats de la IA en estètica.",
                "evidence_es": "Mural realista/exagerat.",
                "evidence_ca": "Mural realista/exagerat.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C4_5",
                "title_es": "Realitat virtual",
                "title_ca": "Realitat virtual",
                "description_es": "Dissenyar una activitat de formació amb realitat virtual per practicar un servei.",
                "description_ca": "Dissenyar una activitat de formació amb realitat virtual per practicar un servei.",
                "evidence_es": "Guió de simulació.",
                "evidence_ca": "Guió de simulació.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C4_6",
                "title_es": "Ciberseguretat bàsica",
                "title_ca": "Ciberseguretat bàsica",
                "description_es": "Relacionar una tecnologia amb una mesura de protecció necessària.",
                "description_ca": "Relacionar una tecnologia amb una mesura de protecció necessària.",
                "evidence_es": "Targetes tecnologia-risc.",
                "evidence_ca": "Targetes tecnologia-risc.",
                "diversitySupport_es": "Les normes es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les.",
                "diversitySupport_ca": "Les normes es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les."
              },
              {
                "id": "act_1664_C4_7",
                "title_es": "Mapa de cabina 4.0",
                "title_ca": "Mapa de cabina 4.0",
                "description_es": "Ubicar tecnologies digitals en una cabina d’estètica.",
                "description_ca": "Ubicar tecnologies digitals en una cabina d’estètica.",
                "evidence_es": "Plànol de cabina.",
                "evidence_ca": "Plànol de cabina.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format digital o escrit.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format digital o escrit."
              },
              {
                "id": "act_1664_C4_8",
                "title_es": "Tecnologia disruptiva",
                "title_ca": "Tecnologia disruptiva",
                "description_es": "Analitzar una tecnologia nova i una aplicació possible en bellesa.",
                "description_ca": "Analitzar una tecnologia nova i una aplicació possible en bellesa.",
                "evidence_es": "Fitxa d’innovació.",
                "evidence_ca": "Fitxa d’innovació.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C4_9",
                "title_es": "Fira THD",
                "title_ca": "Fira THD",
                "description_es": "Presentar una tecnologia habilitadora a la resta de la classe.",
                "description_ca": "Presentar una tecnologia habilitadora a la resta de la classe.",
                "evidence_es": "Microstand tecnològic.",
                "evidence_ca": "Microstand tecnològic.",
                "diversitySupport_es": "La tasca es fragmenta en passos curts amb demostració prèvia; es pot observar abans d’executar, treballar amb parella de suport i lliurar un prototip senzill en lloc d’un producte complet.",
                "diversitySupport_ca": "La tasca es fragmenta en passos curts amb demostració prèvia; es pot observar abans d’executar, treballar amb parella de suport i lliurar un prototip senzill en lloc d’un producte complet."
              }
            ]
          },
          {
            "title_es": "Dades, IA i recomanacions cosmètiques responsables",
            "title_ca": "Dades, IA i recomanacions cosmètiques responsables",
            "targetModuleCode": "1664",
            "targetModuleName_es": "Digitalización aplicada a los sectores productivos",
            "targetModuleName_ca": "Digitalització aplicada als sectors productius",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "L’anàlisi de dades i la IA poden ajudar a formular recomanacions, però cal interpretar resultats amb prudència, seleccionar cosmètics adequats i comunicar sense promeses falses.",
            "justification_ca": "L’anàlisi de dades i la IA poden ajudar a formular recomanacions, però cal interpretar resultats amb prudència, seleccionar cosmètics adequats i comunicar sense promeses falses.",
            "activities": [
              {
                "id": "act_1664_C5_1",
                "title_es": "Dades de pell",
                "title_ca": "Dades de pell",
                "description_es": "Triar quines dades són útils per recomanar un hidratant.",
                "description_ca": "Triar quines dades són útils per recomanar un hidratant.",
                "evidence_es": "Llista de dades útils.",
                "evidence_ca": "Llista de dades útils.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica."
              },
              {
                "id": "act_1664_C5_2",
                "title_es": "Recomanador senzill",
                "title_ca": "Recomanador senzill",
                "description_es": "Crear una regla si/aleshores per recomanar un cosmètic segons tipus de pell.",
                "description_ca": "Crear una regla si/aleshores per recomanar un cosmètic segons tipus de pell.",
                "evidence_es": "Arbre de decisió.",
                "evidence_ca": "Arbre de decisió.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C5_3",
                "title_es": "IA crítica",
                "title_ca": "IA crítica",
                "description_es": "Analitzar una recomanació generada per IA i detectar possibles errors.",
                "description_ca": "Analitzar una recomanació generada per IA i detectar possibles errors.",
                "evidence_es": "Informe de revisió.",
                "evidence_ca": "Informe de revisió.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C5_4",
                "title_es": "No prometre miracles",
                "title_ca": "No prometre miracles",
                "description_es": "Redactar un text digital responsable sobre un cosmètic hidratant.",
                "description_ca": "Redactar un text digital responsable sobre un cosmètic hidratant.",
                "evidence_es": "Text revisat.",
                "evidence_ca": "Text revisat.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C5_5",
                "title_es": "Dades en anglès",
                "title_ca": "Dades en anglès",
                "description_es": "Escriure frases curtes en anglès per explicar una recomanació cosmètica.",
                "description_ca": "Escriure frases curtes en anglès per explicar una recomanació cosmètica.",
                "evidence_es": "Targeta bilingüe.",
                "evidence_ca": "Targeta bilingüe.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C5_6",
                "title_es": "Gràfic de preferències",
                "title_ca": "Gràfic de preferències",
                "description_es": "Interpretar dades senzilles de preferències de clientela.",
                "description_ca": "Interpretar dades senzilles de preferències de clientela.",
                "evidence_es": "Gràfic comentat.",
                "evidence_ca": "Gràfic comentat.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C5_7",
                "title_es": "Cas pell sensible",
                "title_ca": "Cas pell sensible",
                "description_es": "Fer una recomanació amb dades incompletes i decidir què falta preguntar.",
                "description_ca": "Fer una recomanació amb dades incompletes i decidir què falta preguntar.",
                "evidence_es": "Preguntes pendents.",
                "evidence_ca": "Preguntes pendents.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C5_8",
                "title_es": "Sistema millorat",
                "title_ca": "Sistema millorat",
                "description_es": "Proposar una millora en la recollida de dades per evitar errors.",
                "description_ca": "Proposar una millora en la recollida de dades per evitar errors.",
                "evidence_es": "Proposta de millora.",
                "evidence_ca": "Proposta de millora.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C5_9",
                "title_es": "Pitch IA responsable",
                "title_ca": "Pitch IA responsable",
                "description_es": "Presentar com usar IA en estètica sense substituir el criteri professional.",
                "description_ca": "Presentar com usar IA en estètica sense substituir el criteri professional.",
                "evidence_es": "Pitch de 60 segons.",
                "evidence_ca": "Pitch de 60 segons.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir càrrega memorística."
              }
            ]
          },
          {
            "title_es": "Comunicació digital, xarxes i marca professional",
            "title_ca": "Comunicació digital, xarxes i marca professional",
            "targetModuleCode": "1664",
            "targetModuleName_es": "Digitalización aplicada a los sectores productivos",
            "targetModuleName_ca": "Digitalització aplicada als sectors productius",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La transformació digital inclou comunicació professional en xarxes, presentació de serveis, verificació de resultats i difusió d’innovacions amb criteri ètic i tècnic.",
            "justification_ca": "La transformació digital inclou comunicació professional en xarxes, presentació de serveis, verificació de resultats i difusió d’innovacions amb criteri ètic i tècnic.",
            "activities": [
              {
                "id": "act_1664_C6_1",
                "title_es": "Post d’ungles",
                "title_ca": "Post d’ungles",
                "description_es": "Crear un post professional d’un disseny d’ungles amb informació clara.",
                "description_ca": "Crear un post professional d’un disseny d’ungles amb informació clara.",
                "evidence_es": "Post o carrusel.",
                "evidence_ca": "Post o carrusel.",
                "diversitySupport_es": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses.",
                "diversitySupport_ca": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses."
              },
              {
                "id": "act_1664_C6_2",
                "title_es": "Innovació cosmètica",
                "title_ca": "Innovació cosmètica",
                "description_es": "Resumir una innovació de cosmètica decorativa per a xarxes.",
                "description_ca": "Resumir una innovació de cosmètica decorativa per a xarxes.",
                "evidence_es": "Mini dossier digital.",
                "evidence_ca": "Mini dossier digital.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C6_3",
                "title_es": "Abans de publicar",
                "title_ca": "Abans de publicar",
                "description_es": "Verificar si una imatge o text respecta clientela i qualitat professional.",
                "description_ca": "Verificar si una imatge o text respecta clientela i qualitat professional.",
                "evidence_es": "Checklist de publicació.",
                "evidence_ca": "Checklist de publicació.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C6_4",
                "title_es": "Hashtags amb criteri",
                "title_ca": "Hashtags amb criteri",
                "description_es": "Triar etiquetes digitals adequades per a un servei estètic.",
                "description_ca": "Triar etiquetes digitals adequades per a un servei estètic.",
                "evidence_es": "Llista justificada.",
                "evidence_ca": "Llista justificada.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C6_5",
                "title_es": "Caption in English",
                "title_ca": "Caption in English",
                "description_es": "Redactar una descripció breu en anglès d’un servei o disseny.",
                "description_ca": "Redactar una descripció breu en anglès d’un servei o disseny.",
                "evidence_es": "Peu de foto bilingüe.",
                "evidence_ca": "Peu de foto bilingüe.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1664_C6_6",
                "title_es": "Marca personal",
                "title_ca": "Marca personal",
                "description_es": "Definir tres valors professionals per a una futura marca d’estètica.",
                "description_ca": "Definir tres valors professionals per a una futura marca d’estètica.",
                "evidence_es": "Mini guia de marca.",
                "evidence_ca": "Mini guia de marca.",
                "diversitySupport_es": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses.",
                "diversitySupport_ca": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses."
              },
              {
                "id": "act_1664_C6_7",
                "title_es": "Viral o professional",
                "title_ca": "Viral o professional",
                "description_es": "Comparar una publicació viral amb una publicació professional.",
                "description_ca": "Comparar una publicació viral amb una publicació professional.",
                "evidence_es": "Taula comparativa.",
                "evidence_ca": "Taula comparativa.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica."
              },
              {
                "id": "act_1664_C6_8",
                "title_es": "Calendari digital",
                "title_ca": "Calendari digital",
                "description_es": "Planificar una setmana de publicacions d’un saló fictici.",
                "description_ca": "Planificar una setmana de publicacions d’un saló fictici.",
                "evidence_es": "Calendari editorial.",
                "evidence_ca": "Calendari editorial.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C6_9",
                "title_es": "Feedback de clienta",
                "title_ca": "Feedback de clienta",
                "description_es": "Responder digitalment a una valoració positiva o negativa.",
                "description_ca": "Responder digitalment a una valoració positiva o negativa.",
                "evidence_es": "Resposta professional.",
                "evidence_ca": "Resposta professional.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              }
            ]
          },
          {
            "title_es": "Privacitat, ciberseguretat i ús ètic de dades",
            "title_ca": "Privacitat, ciberseguretat i ús ètic de dades",
            "targetModuleCode": "1664",
            "targetModuleName_es": "Digitalización aplicada a los sectores productivos",
            "targetModuleName_ca": "Digitalització aplicada als sectors productius",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La digitalització del saló obliga a protegir fitxes, imatges, dades personals i informació professional, aplicant deontologia, privacitat i criteris bàsics de ciberseguretat.",
            "justification_ca": "La digitalització del saló obliga a protegir fitxes, imatges, dades personals i informació professional, aplicant deontologia, privacitat i criteris bàsics de ciberseguretat.",
            "activities": [
              {
                "id": "act_1664_C7_1",
                "title_es": "Contrasenya segura",
                "title_ca": "Contrasenya segura",
                "description_es": "Crear criteris per valorar si una contrasenya és segura.",
                "description_ca": "Crear criteris per valorar si una contrasenya és segura.",
                "evidence_es": "Rúbrica de contrasenyes.",
                "evidence_ca": "Rúbrica de contrasenyes.",
                "diversitySupport_es": "Les normes es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les.",
                "diversitySupport_ca": "Les normes es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les."
              },
              {
                "id": "act_1664_C7_2",
                "title_es": "Foto amb permís",
                "title_ca": "Foto amb permís",
                "description_es": "Decidir quan es pot publicar una imatge d’un treball realitzat.",
                "description_ca": "Decidir quan es pot publicar una imatge d’un treball realitzat.",
                "evidence_es": "Decisió ètica.",
                "evidence_ca": "Decisió ètica.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1664_C7_3",
                "title_es": "Dades mínimes",
                "title_ca": "Dades mínimes",
                "description_es": "Reduir una fitxa digital perquè només reculli dades necessàries.",
                "description_ca": "Reduir una fitxa digital perquè només reculli dades necessàries.",
                "evidence_es": "Fitxa depurada.",
                "evidence_ca": "Fitxa depurada.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              },
              {
                "id": "act_1664_C7_4",
                "title_es": "Phishing al saló",
                "title_ca": "Phishing al saló",
                "description_es": "Detectar un missatge fraudulent relacionat amb una reserva o pagament.",
                "description_ca": "Detectar un missatge fraudulent relacionat amb una reserva o pagament.",
                "evidence_es": "Missatge senyalat.",
                "evidence_ca": "Missatge senyalat.",
                "diversitySupport_es": "Les normes es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les.",
                "diversitySupport_ca": "Les normes es presenten amb demostració i una ronda de prova; les targetes inclouen colors i pictogrames, i les respostes poden consensuar-se en equip abans de verbalitzar-les."
              },
              {
                "id": "act_1664_C7_5",
                "title_es": "Secret professional digital",
                "title_ca": "Secret professional digital",
                "description_es": "Relacionar situacions digitals amb el secret professional.",
                "description_ca": "Relacionar situacions digitals amb el secret professional.",
                "evidence_es": "Decàleg digital.",
                "evidence_ca": "Decàleg digital.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C7_6",
                "title_es": "Permís informat",
                "title_ca": "Permís informat",
                "description_es": "Redactar una autorització senzilla per usar fotos de resultats.",
                "description_ca": "Redactar una autorització senzilla per usar fotos de resultats.",
                "evidence_es": "Model d’autorització.",
                "evidence_ca": "Model d’autorització.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              },
              {
                "id": "act_1664_C7_7",
                "title_es": "Mapa de riscos digitals",
                "title_ca": "Mapa de riscos digitals",
                "description_es": "Identificar riscos digitals d’un saló i mesures preventives.",
                "description_ca": "Identificar riscos digitals d’un saló i mesures preventives.",
                "evidence_es": "Taula risc-mesura.",
                "evidence_ca": "Taula risc-mesura.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format digital o escrit.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format digital o escrit."
              },
              {
                "id": "act_1664_C7_8",
                "title_es": "Cas conflictiu",
                "title_ca": "Cas conflictiu",
                "description_es": "Resoldre un dilema sobre comentaris, dades o imatges de clientela.",
                "description_ca": "Resoldre un dilema sobre comentaris, dades o imatges de clientela.",
                "evidence_es": "Resposta argumentada.",
                "evidence_ca": "Resposta argumentada.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C7_9",
                "title_es": "Checklist cibersegura",
                "title_ca": "Checklist cibersegura",
                "description_es": "Crear una llista d’hàbits digitals segurs per a l’aula-taller.",
                "description_ca": "Crear una llista d’hàbits digitals segurs per a l’aula-taller.",
                "evidence_es": "Checklist de ciberseguretat.",
                "evidence_ca": "Checklist de ciberseguretat.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              }
            ]
          },
          {
            "title_es": "Millora digital de processos, qualitat i seguiment del servei",
            "title_ca": "Millora digital de processos, qualitat i seguiment del servei",
            "targetModuleCode": "1664",
            "targetModuleName_es": "Digitalización aplicada a los sectores productivos",
            "targetModuleName_ca": "Digitalització aplicada als sectors productius",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "La digitalització ha de millorar productivitat, eficiència, reducció de costos, gestió de residus i satisfacció de la clientela en serveis d’higiene, depilació i mans-peus.",
            "justification_ca": "La digitalització ha de millorar productivitat, eficiència, reducció de costos, gestió de residus i satisfacció de la clientela en serveis d’higiene, depilació i mans-peus.",
            "activities": [
              {
                "id": "act_1664_C9_1",
                "title_es": "Indicador de qualitat",
                "title_ca": "Indicador de qualitat",
                "description_es": "Crear un indicador digital per valorar satisfacció en un servei estètic.",
                "description_ca": "Crear un indicador digital per valorar satisfacció en un servei estètic.",
                "evidence_es": "Indicador i formulari.",
                "evidence_ca": "Indicador i formulari.",
                "diversitySupport_es": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definides i un exemple resolt; es permet usar adhesius, colors o imatges per ordenar idees abans d’afegir la justificació tècnica."
              },
              {
                "id": "act_1664_C9_2",
                "title_es": "Temps de servei",
                "title_ca": "Temps de servei",
                "description_es": "Registrar temps de diferents fases d’un servei per detectar millores.",
                "description_ca": "Registrar temps de diferents fases d’un servei per detectar millores.",
                "evidence_es": "Taula de temps.",
                "evidence_ca": "Taula de temps.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C9_3",
                "title_es": "Cost i residu",
                "title_ca": "Cost i residu",
                "description_es": "Relacionar una millora digital amb reducció de costos o residus.",
                "description_ca": "Relacionar una millora digital amb reducció de costos o residus.",
                "evidence_es": "Informe breu.",
                "evidence_ca": "Informe breu.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C9_4",
                "title_es": "Feedback digital",
                "title_ca": "Feedback digital",
                "description_es": "Dissenyar una enquesta curta postservei per higiene, depilació o mans-peus.",
                "description_ca": "Dissenyar una enquesta curta postservei per higiene, depilació o mans-peus.",
                "evidence_es": "Enquesta digital.",
                "evidence_ca": "Enquesta digital.",
                "diversitySupport_es": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses.",
                "diversitySupport_ca": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses."
              },
              {
                "id": "act_1664_C9_5",
                "title_es": "Resultat i gustos",
                "title_ca": "Resultat i gustos",
                "description_es": "Registrar si el resultat d’ungles respon als gustos de la clienta.",
                "description_ca": "Registrar si el resultat d’ungles respon als gustos de la clienta.",
                "evidence_es": "Fitxa de verificació.",
                "evidence_ca": "Fitxa de verificació.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; qui tingui dificultat per parlar davant el grup pot fer el rol d’observador/a, gravar un àudio o entregar la resposta escrita."
              },
              {
                "id": "act_1664_C9_6",
                "title_es": "Millora contínua",
                "title_ca": "Millora contínua",
                "description_es": "Proposar una acció de millora a partir de dades de satisfacció.",
                "description_ca": "Proposar una acció de millora a partir de dades de satisfacció.",
                "evidence_es": "Pla de millora.",
                "evidence_ca": "Pla de millora.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C9_7",
                "title_es": "Automatitzar sense perdre tracte",
                "title_ca": "Automatitzar sense perdre tracte",
                "description_es": "Debatre què es pot automatitzar i què ha de continuar sent personal.",
                "description_ca": "Debatre què es pot automatitzar i què ha de continuar sent personal.",
                "evidence_es": "Conclusions argumentades.",
                "evidence_ca": "Conclusions argumentades.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir càrrega memorística."
              },
              {
                "id": "act_1664_C9_8",
                "title_es": "Quadre de comandament",
                "title_ca": "Quadre de comandament",
                "description_es": "Crear un mini dashboard en paper amb indicadors d’un saló.",
                "description_ca": "Crear un mini dashboard en paper amb indicadors d’un saló.",
                "evidence_es": "Quadre de comandament.",
                "evidence_ca": "Quadre de comandament.",
                "diversitySupport_es": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses.",
                "diversitySupport_ca": "Es donen exemples visuals, banc d’icones i una graella de disseny; els rols es reparteixen entre recerca, redacció, maquetació i revisió tècnica perquè totes les aportacions siguin valuoses."
              },
              {
                "id": "act_1664_C9_9",
                "title_es": "Informe final 4.0",
                "title_ca": "Informe final 4.0",
                "description_es": "Redactar un informe de millores digitals aplicables als serveis de primer curs.",
                "description_ca": "Redactar un informe de millores digitals aplicables als serveis de primer curs.",
                "evidence_es": "Informe final.",
                "evidence_ca": "Informe final.",
                "diversitySupport_es": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar.",
                "diversitySupport_ca": "Es facilita una plantilla amb camps concrets, exemple parcialment completat i vocabulari digital/professional; l’alumnat pot emplenar primer amb paraules clau, icones o codis de color abans de redactar."
              }
            ]
          }
        ]
      },
      {
        "id": "1664_RA5",
        "code": "RA5",
        "text_es": "Resultado de aprendizaje 5",
        "text_ca": "Resultat d'aprenentatge 5",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Pla de transformació digital d’un saló d’estètica",
            "title_ca": "Pla de transformació digital d’un saló d’estètica",
            "targetModuleCode": "1664",
            "targetModuleName_es": "Digitalización aplicada a los sectores productivos",
            "targetModuleName_ca": "Digitalització aplicada als sectors productius",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "El mòdul culmina amb un pla de transformació d’una empresa clàssica cap a un saló 4.0, identificant etapes digitalitzables, recursos humans, espais segurs i organització del magatzem cosmètic.",
            "justification_ca": "El mòdul culmina amb un pla de transformació d’una empresa clàssica cap a un saló 4.0, identificant etapes digitalitzables, recursos humans, espais segurs i organització del magatzem cosmètic.",
            "activities": [
              {
                "id": "act_1664_C8_1",
                "title_es": "Saló clàssic",
                "title_ca": "Saló clàssic",
                "description_es": "Dibuixar el diagrama de funcionament d’un saló tradicional.",
                "description_ca": "Dibuixar el diagrama de funcionament d’un saló tradicional.",
                "evidence_es": "Diagrama inicial.",
                "evidence_ca": "Diagrama inicial.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format digital o escrit.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format digital o escrit."
              },
              {
                "id": "act_1664_C8_2",
                "title_es": "Què digitalitzam?",
                "title_ca": "Què digitalitzam?",
                "description_es": "Identificar etapes d’un saló que es poden digitalitzar.",
                "description_ca": "Identificar etapes d’un saló que es poden digitalitzar.",
                "evidence_es": "Llista d’etapes.",
                "evidence_ca": "Llista d’etapes.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C8_3",
                "title_es": "Magatzem intel·ligent",
                "title_ca": "Magatzem intel·ligent",
                "description_es": "Proposar una millora digital per controlar estoc i conservació de cosmètics.",
                "description_ca": "Proposar una millora digital per controlar estoc i conservació de cosmètics.",
                "evidence_es": "Proposta d’estoc digital.",
                "evidence_ca": "Proposta d’estoc digital.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C8_4",
                "title_es": "Espai segur",
                "title_ca": "Espai segur",
                "description_es": "Relacionar digitalització i condicions de treball segures.",
                "description_ca": "Relacionar digitalització i condicions de treball segures.",
                "evidence_es": "Checklist d’espai.",
                "evidence_ca": "Checklist d’espai.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C8_5",
                "title_es": "Diagrama 4.0",
                "title_ca": "Diagrama 4.0",
                "description_es": "Elaborar el diagrama de blocs d’un saló digitalitzat.",
                "description_ca": "Elaborar el diagrama de blocs d’un saló digitalitzat.",
                "evidence_es": "Diagrama 4.0.",
                "evidence_ca": "Diagrama 4.0.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format digital o escrit.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format digital o escrit."
              },
              {
                "id": "act_1664_C8_6",
                "title_es": "Recursos humans",
                "title_ca": "Recursos humans",
                "description_es": "Analitzar com canvien tasques i competències del personal.",
                "description_ca": "Analitzar com canvien tasques i competències del personal.",
                "evidence_es": "Taula abans/després.",
                "evidence_ca": "Taula abans/després.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir càrrega memorística."
              },
              {
                "id": "act_1664_C8_7",
                "title_es": "Seqüència del pla",
                "title_ca": "Seqüència del pla",
                "description_es": "Ordenar les fases d’un pla de transformació digital.",
                "description_ca": "Ordenar les fases d’un pla de transformació digital.",
                "evidence_es": "Cronograma bàsic.",
                "evidence_ca": "Cronograma bàsic.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C8_8",
                "title_es": "Viabilitat express",
                "title_ca": "Viabilitat express",
                "description_es": "Valorar si una millora digital és viable en un saló petit.",
                "description_ca": "Valorar si una millora digital és viable en un saló petit.",
                "evidence_es": "Fitxa de viabilitat.",
                "evidence_ca": "Fitxa de viabilitat.",
                "diversitySupport_es": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació.",
                "diversitySupport_ca": "S’ofereix una plantilla digital ja preparada i una alternativa en paper; l’alumnat amb menys competència digital treballa amb parella tutora i se centra en comprendre el flux d’informació."
              },
              {
                "id": "act_1664_C8_9",
                "title_es": "Presentació al claustre",
                "title_ca": "Presentació al claustre",
                "description_es": "Presentar el pla de transformació com si fos a un equip de centre o empresa.",
                "description_ca": "Presentar el pla de transformació com si fos a un equip de centre o empresa.",
                "evidence_es": "Presentació breu.",
                "evidence_ca": "Presentació breu.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella, assegut/uda o amb suport visual per reduir càrrega memorística."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "code": "1709",
    "name_es": "Itinerario personal para la empleabilidad I",
    "name_ca": "Itinerari personal per a l’ocupabilitat I",
    "type": "especifico",
    "color": "#f472b6",
    "icon": "book",
    "learningOutcomes": [
      {
        "id": "1709_RA1",
        "code": "RA1",
        "text_es": "Resultado de aprendizaje 1",
        "text_ca": "Resultat d'aprenentatge 1",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Sector professional, llocs de treball i serveis d’estètica",
            "title_ca": "Sector professional, llocs de treball i serveis d’estètica",
            "targetModuleCode": "1709",
            "targetModuleName_es": "Itinerario personal para la empleabilidad I",
            "targetModuleName_ca": "Itinerari personal per a l’ocupabilitat I",
            "targetRaCode": "RA1",
            "targetRaText_es": "Resultado de aprendizaje 1",
            "targetRaText_ca": "Resultat d'aprenentatge 1",
            "relationType": "tecnica",
            "justification_es": "L’alumnat ha de conèixer les oportunitats laborals del sector, els llocs de treball i les actituds professionals vinculades a la qualitat del servei, la imatge del professional i les obligacions deontològiques.",
            "justification_ca": "L’alumnat ha de conèixer les oportunitats laborals del sector, els llocs de treball i les actituds professionals vinculades a la qualitat del servei, la imatge del professional i les obligacions deontològiques.",
            "activities": [
              {
                "id": "act_1709_C1_1",
                "title_es": "Mapa d’ocupacions",
                "title_ca": "Mapa d’ocupacions",
                "description_es": "Identificar llocs de treball del sector d’estètica i bellesa i serveis associats.",
                "description_ca": "Identificar llocs de treball del sector d’estètica i bellesa i serveis associats.",
                "evidence_es": "Mapa d’ocupacions.",
                "evidence_ca": "Mapa d’ocupacions.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital."
              },
              {
                "id": "act_1709_C1_2",
                "title_es": "Professional ideal",
                "title_ca": "Professional ideal",
                "description_es": "Relacionar actituds i aptituds amb situacions reals de cabina.",
                "description_ca": "Relacionar actituds i aptituds amb situacions reals de cabina.",
                "evidence_es": "Perfil competencial.",
                "evidence_ca": "Perfil competencial.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1709_C1_3",
                "title_es": "Qualitat que dona feina",
                "title_ca": "Qualitat que dona feina",
                "description_es": "Detectar conductes que milloren la satisfacció de la clientela i l’ocupabilitat.",
                "description_ca": "Detectar conductes que milloren la satisfacció de la clientela i l’ocupabilitat.",
                "evidence_es": "Llista d’indicadors.",
                "evidence_ca": "Llista d’indicadors.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_1709_C1_4",
                "title_es": "Imatge professional",
                "title_ca": "Imatge professional",
                "description_es": "Dissenyar un decàleg d’imatge i conducta professional en manicura, higiene o depilació.",
                "description_ca": "Dissenyar un decàleg d’imatge i conducta professional en manicura, higiene o depilació.",
                "evidence_es": "Decàleg professional.",
                "evidence_ca": "Decàleg professional.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_1709_C1_5",
                "title_es": "Entrevista al sector",
                "title_ca": "Entrevista al sector",
                "description_es": "Preparar preguntes per entrevistar una professional d’estètica.",
                "description_ca": "Preparar preguntes per entrevistar una professional d’estètica.",
                "evidence_es": "Guió d’entrevista.",
                "evidence_ca": "Guió d’entrevista.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; es pot fer en parella, gravar àudio o assumir el rol d’observador/a amb rúbrica si parlar davant el grup genera inseguretat.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; es pot fer en parella, gravar àudio o assumir el rol d’observador/a amb rúbrica si parlar davant el grup genera inseguretat."
              },
              {
                "id": "act_1709_C1_6",
                "title_es": "El meu lloc futur",
                "title_ca": "El meu lloc futur",
                "description_es": "Triar un lloc de treball del sector i descriure funcions i requisits.",
                "description_ca": "Triar un lloc de treball del sector i descriure funcions i requisits.",
                "evidence_es": "Fitxa de lloc.",
                "evidence_ca": "Fitxa de lloc.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C1_7",
                "title_es": "Cas de mala actitud",
                "title_ca": "Cas de mala actitud",
                "description_es": "Analitzar com una mala actitud afecta el servei i la feina futura.",
                "description_ca": "Analitzar com una mala actitud afecta el servei i la feina futura.",
                "evidence_es": "Correcció proposada.",
                "evidence_ca": "Correcció proposada.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1709_C1_8",
                "title_es": "Pitch ocupacional",
                "title_ca": "Pitch ocupacional",
                "description_es": "Presentar en 60 segons un perfil professional del sector.",
                "description_ca": "Presentar en 60 segons un perfil professional del sector.",
                "evidence_es": "Pitch breu.",
                "evidence_ca": "Pitch breu.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_1709_C1_9",
                "title_es": "Fira de professions",
                "title_ca": "Fira de professions",
                "description_es": "Crear un microstand sobre una sortida professional d’estètica.",
                "description_ca": "Crear un microstand sobre una sortida professional d’estètica.",
                "evidence_es": "Microstand.",
                "evidence_ca": "Microstand.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              }
            ]
          }
        ]
      },
      {
        "id": "1709_RA2",
        "code": "RA2",
        "text_es": "Resultado de aprendizaje 2",
        "text_ca": "Resultat d'aprenentatge 2",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Prevenció de riscos en cabina i serveis estètics",
            "title_ca": "Prevenció de riscos en cabina i serveis estètics",
            "targetModuleCode": "1709",
            "targetModuleName_es": "Itinerario personal para la empleabilidad I",
            "targetModuleName_ca": "Itinerari personal per a l’ocupabilitat I",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "La cultura preventiva s’ha d’aplicar als riscos reals de cabina: depilació, aparatologia, higiene, ergonomia, EPI i plans d’actuació davant emergències.",
            "justification_ca": "La cultura preventiva s’ha d’aplicar als riscos reals de cabina: depilació, aparatologia, higiene, ergonomia, EPI i plans d’actuació davant emergències.",
            "activities": [
              {
                "id": "act_1709_C2_1",
                "title_es": "Mapa de riscos de cabina",
                "title_ca": "Mapa de riscos de cabina",
                "description_es": "Identificar riscos habituals en una cabina d’estètica.",
                "description_ca": "Identificar riscos habituals en una cabina d’estètica.",
                "evidence_es": "Mapa de riscos.",
                "evidence_ca": "Mapa de riscos.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital."
              },
              {
                "id": "act_1709_C2_2",
                "title_es": "EPI per servei",
                "title_ca": "EPI per servei",
                "description_es": "Seleccionar proteccions per a depilació, higiene facial i aparatologia.",
                "description_ca": "Seleccionar proteccions per a depilació, higiene facial i aparatologia.",
                "evidence_es": "Taula servei-EPI.",
                "evidence_ca": "Taula servei-EPI.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C2_3",
                "title_es": "Pla preventiu visual",
                "title_ca": "Pla preventiu visual",
                "description_es": "Crear una seqüència d’actuació davant un risc concret del taller.",
                "description_ca": "Crear una seqüència d’actuació davant un risc concret del taller.",
                "evidence_es": "Pla visual.",
                "evidence_ca": "Pla visual.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C2_4",
                "title_es": "Risc amb cera",
                "title_ca": "Risc amb cera",
                "description_es": "Analitzar un cas de depilació amb risc tèrmic o higiènic.",
                "description_ca": "Analitzar un cas de depilació amb risc tèrmic o higiènic.",
                "evidence_es": "Decisió preventiva.",
                "evidence_ca": "Decisió preventiva.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1709_C2_5",
                "title_es": "Aparell segur",
                "title_ca": "Aparell segur",
                "description_es": "Revisar normes d’higiene i seguretat d’un equip estètic.",
                "description_ca": "Revisar normes d’higiene i seguretat d’un equip estètic.",
                "evidence_es": "Checklist d’equip.",
                "evidence_ca": "Checklist d’equip.",
                "diversitySupport_es": "La tasca es fragmenta en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar amb parella de suport i repetir la part pràctica si cal.",
                "diversitySupport_ca": "La tasca es fragmenta en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar amb parella de suport i repetir la part pràctica si cal."
              },
              {
                "id": "act_1709_C2_6",
                "title_es": "Semàfor preventiu",
                "title_ca": "Semàfor preventiu",
                "description_es": "Classificar conductes de cabina com a segures, dubtoses o de risc.",
                "description_ca": "Classificar conductes de cabina com a segures, dubtoses o de risc.",
                "evidence_es": "Mural semàfor.",
                "evidence_ca": "Mural semàfor.",
                "diversitySupport_es": "Les normes es presenten oralment i per escrit amb una ronda de prova; les targetes incorporen colors o icones i les respostes es poden consensuar en equip abans de compartir-les.",
                "diversitySupport_ca": "Les normes es presenten oralment i per escrit amb una ronda de prova; les targetes incorporen colors o icones i les respostes es poden consensuar en equip abans de compartir-les."
              },
              {
                "id": "act_1709_C2_7",
                "title_es": "Emergència en el saló",
                "title_ca": "Emergència en el saló",
                "description_es": "Ordenar passos d’actuació davant una incidència senzilla.",
                "description_ca": "Ordenar passos d’actuació davant una incidència senzilla.",
                "evidence_es": "Protocol d’emergència.",
                "evidence_ca": "Protocol d’emergència.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; es pot fer en parella, gravar àudio o assumir el rol d’observador/a amb rúbrica si parlar davant el grup genera inseguretat.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; es pot fer en parella, gravar àudio o assumir el rol d’observador/a amb rúbrica si parlar davant el grup genera inseguretat."
              },
              {
                "id": "act_1709_C2_8",
                "title_es": "Postura i salut",
                "title_ca": "Postura i salut",
                "description_es": "Relacionar postures professionals amb riscos musculoesquelètics.",
                "description_ca": "Relacionar postures professionals amb riscos musculoesquelètics.",
                "evidence_es": "Fitxa causa-prevenció.",
                "evidence_ca": "Fitxa causa-prevenció.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_1709_C2_9",
                "title_es": "Inspector/a PRL",
                "title_ca": "Inspector/a PRL",
                "description_es": "Coavaluar una estació de treball amb criteris preventius.",
                "description_ca": "Coavaluar una estació de treball amb criteris preventius.",
                "evidence_es": "Rúbrica PRL.",
                "evidence_ca": "Rúbrica PRL.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              }
            ]
          },
          {
            "title_es": "Primers auxilis i reaccions adverses en serveis de bellesa",
            "title_ca": "Primers auxilis i reaccions adverses en serveis de bellesa",
            "targetModuleCode": "1709",
            "targetModuleName_es": "Itinerario personal para la empleabilidad I",
            "targetModuleName_ca": "Itinerari personal per a l’ocupabilitat I",
            "targetRaCode": "RA2",
            "targetRaText_es": "Resultado de aprendizaje 2",
            "targetRaText_ca": "Resultat d'aprenentatge 2",
            "relationType": "tecnica",
            "justification_es": "Davant accidents, reaccions adverses o incidències amb cosmètics i aparells, l’alumnat ha de saber aplicar pautes bàsiques, avisar i actuar amb serenitat i seguretat.",
            "justification_ca": "Davant accidents, reaccions adverses o incidències amb cosmètics i aparells, l’alumnat ha de saber aplicar pautes bàsiques, avisar i actuar amb serenitat i seguretat.",
            "activities": [
              {
                "id": "act_1709_C3_1",
                "title_es": "PAS en estètica",
                "title_ca": "PAS en estètica",
                "description_es": "Aplicar protegir, avisar i socórrer a situacions de cabina.",
                "description_ca": "Aplicar protegir, avisar i socórrer a situacions de cabina.",
                "evidence_es": "Targeta PAS.",
                "evidence_ca": "Targeta PAS.",
                "diversitySupport_es": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; es pot fer en parella, gravar àudio o assumir el rol d’observador/a amb rúbrica si parlar davant el grup genera inseguretat.",
                "diversitySupport_ca": "S’ofereixen targetes de rol, frases d’inici i temps d’assaig; es pot fer en parella, gravar àudio o assumir el rol d’observador/a amb rúbrica si parlar davant el grup genera inseguretat."
              },
              {
                "id": "act_1709_C3_2",
                "title_es": "Reacció cosmètica",
                "title_ca": "Reacció cosmètica",
                "description_es": "Decidir què fer davant picor o envermelliment després d’un cosmètic.",
                "description_ca": "Decidir què fer davant picor o envermelliment després d’un cosmètic.",
                "evidence_es": "Protocol d’actuació.",
                "evidence_ca": "Protocol d’actuació.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C3_3",
                "title_es": "Farmaciola d’aula",
                "title_ca": "Farmaciola d’aula",
                "description_es": "Identificar materials bàsics d’una farmaciola i el seu ús.",
                "description_ca": "Identificar materials bàsics d’una farmaciola i el seu ús.",
                "evidence_es": "Inventari justificat.",
                "evidence_ca": "Inventari justificat.",
                "diversitySupport_es": "La tasca es fragmenta en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar amb parella de suport i repetir la part pràctica si cal.",
                "diversitySupport_ca": "La tasca es fragmenta en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar amb parella de suport i repetir la part pràctica si cal."
              },
              {
                "id": "act_1709_C3_4",
                "title_es": "Accident amb aparell",
                "title_ca": "Accident amb aparell",
                "description_es": "Analitzar una incidència amb aparatologia i definir passos segurs.",
                "description_ca": "Analitzar una incidència amb aparatologia i definir passos segurs.",
                "evidence_es": "Decisió segura.",
                "evidence_ca": "Decisió segura.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1709_C3_5",
                "title_es": "Qui avisa?",
                "title_ca": "Qui avisa?",
                "description_es": "Repartir rols en una emergència simulada al saló.",
                "description_ca": "Repartir rols en una emergència simulada al saló.",
                "evidence_es": "Rols d’emergència.",
                "evidence_ca": "Rols d’emergència.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C3_6",
                "title_es": "No improvisar",
                "title_ca": "No improvisar",
                "description_es": "Detectar accions incorrectes davant reaccions adverses.",
                "description_ca": "Detectar accions incorrectes davant reaccions adverses.",
                "evidence_es": "Correccions.",
                "evidence_ca": "Correccions.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C3_7",
                "title_es": "Cartell d’emergència",
                "title_ca": "Cartell d’emergència",
                "description_es": "Crear un cartell amb passos bàsics davant accidents lleus.",
                "description_ca": "Crear un cartell amb passos bàsics davant accidents lleus.",
                "evidence_es": "Cartell PAS.",
                "evidence_ca": "Cartell PAS.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_1709_C3_8",
                "title_es": "Casos ràpids",
                "title_ca": "Casos ràpids",
                "description_es": "Resoldre microcasos de cremades lleus, mareig o irritació.",
                "description_ca": "Resoldre microcasos de cremades lleus, mareig o irritació.",
                "evidence_es": "Targetes resoltes.",
                "evidence_ca": "Targetes resoltes.",
                "diversitySupport_es": "Les normes es presenten oralment i per escrit amb una ronda de prova; les targetes incorporen colors o icones i les respostes es poden consensuar en equip abans de compartir-les.",
                "diversitySupport_ca": "Les normes es presenten oralment i per escrit amb una ronda de prova; les targetes incorporen colors o icones i les respostes es poden consensuar en equip abans de compartir-les."
              },
              {
                "id": "act_1709_C3_9",
                "title_es": "Informe d’incidència",
                "title_ca": "Informe d’incidència",
                "description_es": "Redactar un registre breu d’una incidència professional.",
                "description_ca": "Redactar un registre breu d’una incidència professional.",
                "evidence_es": "Informe breu.",
                "evidence_ca": "Informe breu.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              }
            ]
          }
        ]
      },
      {
        "id": "1709_RA3",
        "code": "RA3",
        "text_es": "Resultado de aprendizaje 3",
        "text_ca": "Resultat d'aprenentatge 3",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Drets, deures, contractes i condicions laborals del sector",
            "title_ca": "Drets, deures, contractes i condicions laborals del sector",
            "targetModuleCode": "1709",
            "targetModuleName_es": "Itinerario personal para la empleabilidad I",
            "targetModuleName_ca": "Itinerari personal per a l’ocupabilitat I",
            "targetRaCode": "RA3",
            "targetRaText_es": "Resultado de aprendizaje 3",
            "targetRaText_ca": "Resultat d'aprenentatge 3",
            "relationType": "tecnica",
            "justification_es": "Conèixer drets, obligacions, contractes, nòmina i condicions laborals ajuda a inserir-se en el sector amb autonomia, incloent entorns digitals i comunicació professional escrita.",
            "justification_ca": "Conèixer drets, obligacions, contractes, nòmina i condicions laborals ajuda a inserir-se en el sector amb autonomia, incloent entorns digitals i comunicació professional escrita.",
            "activities": [
              {
                "id": "act_1709_C4_1",
                "title_es": "Contracte a la vista",
                "title_ca": "Contracte a la vista",
                "description_es": "Identificar dades bàsiques d’un contracte laboral del sector.",
                "description_ca": "Identificar dades bàsiques d’un contracte laboral del sector.",
                "evidence_es": "Fitxa de contracte.",
                "evidence_ca": "Fitxa de contracte.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C4_2",
                "title_es": "Dret o deure?",
                "title_ca": "Dret o deure?",
                "description_es": "Classificar situacions quotidianes com a drets o deures laborals.",
                "description_ca": "Classificar situacions quotidianes com a drets o deures laborals.",
                "evidence_es": "Targetes classificades.",
                "evidence_ca": "Targetes classificades.",
                "diversitySupport_es": "Les normes es presenten oralment i per escrit amb una ronda de prova; les targetes incorporen colors o icones i les respostes es poden consensuar en equip abans de compartir-les.",
                "diversitySupport_ca": "Les normes es presenten oralment i per escrit amb una ronda de prova; les targetes incorporen colors o icones i les respostes es poden consensuar en equip abans de compartir-les."
              },
              {
                "id": "act_1709_C4_3",
                "title_es": "Nòmina senzilla",
                "title_ca": "Nòmina senzilla",
                "description_es": "Reconèixer parts bàsiques d’un rebut de salari simulat.",
                "description_ca": "Reconèixer parts bàsiques d’un rebut de salari simulat.",
                "evidence_es": "Nòmina anotada.",
                "evidence_ca": "Nòmina anotada.",
                "diversitySupport_es": "Es proporciona una taula amb categories definidas i un exemple resolt; es permet usar colors, adhesius o icones abans d’afegir la justificació professional.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definidas i un exemple resolt; es permet usar colors, adhesius o icones abans d’afegir la justificació professional."
              },
              {
                "id": "act_1709_C4_4",
                "title_es": "Convenio cercano",
                "title_ca": "Convenio cercano",
                "description_es": "Localitzar condicions laborals rellevants en un conveni o font oficial.",
                "description_ca": "Localitzar condicions laborals rellevants en un conveni o font oficial.",
                "evidence_es": "Resum de condicions.",
                "evidence_ca": "Resum de condicions.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C4_5",
                "title_es": "Missatge formal",
                "title_ca": "Missatge formal",
                "description_es": "Redactar una comunicació professional breu sobre una incidència laboral.",
                "description_ca": "Redactar una comunicació professional breu sobre una incidència laboral.",
                "evidence_es": "Missatge formal.",
                "evidence_ca": "Missatge formal.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C4_6",
                "title_es": "Treball digitalitzat",
                "title_ca": "Treball digitalitzat",
                "description_es": "Debatre com canvien horaris, tasques o drets en entorns 4.0.",
                "description_ca": "Debatre com canvien horaris, tasques o drets en entorns 4.0.",
                "evidence_es": "Conclusions.",
                "evidence_ca": "Conclusions.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_1709_C4_7",
                "title_es": "Comparativa contractes",
                "title_ca": "Comparativa contractes",
                "description_es": "Comparar dues modalitats de contractació de forma senzilla.",
                "description_ca": "Comparar dues modalitats de contractació de forma senzilla.",
                "evidence_es": "Taula de contractes.",
                "evidence_ca": "Taula de contractes.",
                "diversitySupport_es": "Es proporciona una taula amb categories definidas i un exemple resolt; es permet usar colors, adhesius o icones abans d’afegir la justificació professional.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definidas i un exemple resolt; es permet usar colors, adhesius o icones abans d’afegir la justificació professional."
              },
              {
                "id": "act_1709_C4_8",
                "title_es": "Situació problema",
                "title_ca": "Situació problema",
                "description_es": "Decidir quin recurs laboral cercar davant un conflicte senzill.",
                "description_ca": "Decidir quin recurs laboral cercar davant un conflicte senzill.",
                "evidence_es": "Ruta de consulta.",
                "evidence_ca": "Ruta de consulta.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1709_C4_9",
                "title_es": "Rights in English",
                "title_ca": "Rights in English",
                "description_es": "Redactar tres frases bàsiques en anglès sobre drets laborals.",
                "description_ca": "Redactar tres frases bàsiques en anglès sobre drets laborals.",
                "evidence_es": "Targeta bilingüe.",
                "evidence_ca": "Targeta bilingüe.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              }
            ]
          }
        ]
      },
      {
        "id": "1709_RA4",
        "code": "RA4",
        "text_es": "Resultado de aprendizaje 4",
        "text_ca": "Resultat d'aprenentatge 4",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Autoconeixement, competències personals i projecte professional",
            "title_ca": "Autoconeixement, competències personals i projecte professional",
            "targetModuleCode": "1709",
            "targetModuleName_es": "Itinerario personal para la empleabilidad I",
            "targetModuleName_ca": "Itinerari personal per a l’ocupabilitat I",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "L’autoconeixement permet vincular interessos, fortaleses i àrees de millora amb competències professionals del sector: imatge, qualitat, actitud, tracte i execució del servei.",
            "justification_ca": "L’autoconeixement permet vincular interessos, fortaleses i àrees de millora amb competències professionals del sector: imatge, qualitat, actitud, tracte i execució del servei.",
            "activities": [
              {
                "id": "act_1709_C5_1",
                "title_es": "El meu DAFO",
                "title_ca": "El meu DAFO",
                "description_es": "Identificar fortaleses, debilitats, oportunitats i amenaces personals.",
                "description_ca": "Identificar fortaleses, debilitats, oportunitats i amenaces personals.",
                "evidence_es": "DAFO personal.",
                "evidence_ca": "DAFO personal.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C5_2",
                "title_es": "Competències del sector",
                "title_ca": "Competències del sector",
                "description_es": "Relacionar competències personals amb tasques d’estètica.",
                "description_ca": "Relacionar competències personals amb tasques d’estètica.",
                "evidence_es": "Mapa de competències.",
                "evidence_ca": "Mapa de competències.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital."
              },
              {
                "id": "act_1709_C5_3",
                "title_es": "Actitud que suma",
                "title_ca": "Actitud que suma",
                "description_es": "Analitzar conductes professionals que milloren la qualitat del servei.",
                "description_ca": "Analitzar conductes professionals que milloren la qualitat del servei.",
                "evidence_es": "Llista d’actituds.",
                "evidence_ca": "Llista d’actituds.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1709_C5_4",
                "title_es": "Imatge i identitat",
                "title_ca": "Imatge i identitat",
                "description_es": "Reflexionar sobre com la imatge professional comunica confiança.",
                "description_ca": "Reflexionar sobre com la imatge professional comunica confiança.",
                "evidence_es": "Entrada reflexiva.",
                "evidence_ca": "Entrada reflexiva.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_1709_C5_5",
                "title_es": "Feedback amable",
                "title_ca": "Feedback amable",
                "description_es": "Rebre i donar feedback sobre competències personals.",
                "description_ca": "Rebre i donar feedback sobre competències personals.",
                "evidence_es": "Fitxa de feedback.",
                "evidence_ca": "Fitxa de feedback.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C5_6",
                "title_es": "Fortalesa en acció",
                "title_ca": "Fortalesa en acció",
                "description_es": "Triar una fortalesa i aplicar-la a un repte de cabina.",
                "description_ca": "Triar una fortalesa i aplicar-la a un repte de cabina.",
                "evidence_es": "Pla d’aplicació.",
                "evidence_ca": "Pla d’aplicació.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C5_7",
                "title_es": "Targeta professional",
                "title_ca": "Targeta professional",
                "description_es": "Crear una targeta amb tres qualitats pròpies i evidències.",
                "description_ca": "Crear una targeta amb tres qualitats pròpies i evidències.",
                "evidence_es": "Targeta competencial.",
                "evidence_ca": "Targeta competencial.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_1709_C5_8",
                "title_es": "Zona de millora",
                "title_ca": "Zona de millora",
                "description_es": "Definir una àrea de millora i una acció concreta per treballar-la.",
                "description_ca": "Definir una àrea de millora i una acció concreta per treballar-la.",
                "evidence_es": "Objectiu SMART.",
                "evidence_ca": "Objectiu SMART.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C5_9",
                "title_es": "Presenta’t",
                "title_ca": "Presenta’t",
                "description_es": "Fer una presentació breu com a futura professional d’estètica.",
                "description_ca": "Fer una presentació breu com a futura professional d’estètica.",
                "evidence_es": "Presentació de 60 segons.",
                "evidence_ca": "Presentació de 60 segons.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística."
              }
            ]
          },
          {
            "title_es": "Objectius, itineraris formatius i full de ruta professional",
            "title_ca": "Objectius, itineraris formatius i full de ruta professional",
            "targetModuleCode": "1709",
            "targetModuleName_es": "Itinerario personal para la empleabilidad I",
            "targetModuleName_ca": "Itinerari personal per a l’ocupabilitat I",
            "targetRaCode": "RA4",
            "targetRaText_es": "Resultado de aprendizaje 4",
            "targetRaText_ca": "Resultat d'aprenentatge 4",
            "relationType": "tecnica",
            "justification_es": "La inserció laboral exigeix definir metes, itineraris formatius, pla d’acció i actualització professional, també mitjançant eines digitals i fonts d’innovació del sector.",
            "justification_ca": "La inserció laboral exigeix definir metes, itineraris formatius, pla d’acció i actualització professional, també mitjançant eines digitals i fonts d’innovació del sector.",
            "activities": [
              {
                "id": "act_1709_C6_1",
                "title_es": "Ruta 3 anys",
                "title_ca": "Ruta 3 anys",
                "description_es": "Dibuixar una ruta formativa i laboral de tres anys després del cicle.",
                "description_ca": "Dibuixar una ruta formativa i laboral de tres anys després del cicle.",
                "evidence_es": "Full de ruta.",
                "evidence_ca": "Full de ruta.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital."
              },
              {
                "id": "act_1709_C6_2",
                "title_es": "Objectiu SMART",
                "title_ca": "Objectiu SMART",
                "description_es": "Convertir una meta professional en un objectiu concret i mesurable.",
                "description_ca": "Convertir una meta professional en un objectiu concret i mesurable.",
                "evidence_es": "Objectiu SMART.",
                "evidence_ca": "Objectiu SMART.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C6_3",
                "title_es": "Itineraris possibles",
                "title_ca": "Itineraris possibles",
                "description_es": "Comparar opcions: treball, especialització, emprenedoria o més formació.",
                "description_ca": "Comparar opcions: treball, especialització, emprenedoria o més formació.",
                "evidence_es": "Taula d’itineraris.",
                "evidence_ca": "Taula d’itineraris.",
                "diversitySupport_es": "Es proporciona una taula amb categories definidas i un exemple resolt; es permet usar colors, adhesius o icones abans d’afegir la justificació professional.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definidas i un exemple resolt; es permet usar colors, adhesius o icones abans d’afegir la justificació professional."
              },
              {
                "id": "act_1709_C6_4",
                "title_es": "Formació 4.0",
                "title_ca": "Formació 4.0",
                "description_es": "Incloure competències digitals dins el pla professional.",
                "description_ca": "Incloure competències digitals dins el pla professional.",
                "evidence_es": "Pla digital.",
                "evidence_ca": "Pla digital.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C6_5",
                "title_es": "Innovation watch",
                "title_ca": "Innovation watch",
                "description_es": "Triar una innovació cosmètica i valorar si interessa per al futur professional.",
                "description_ca": "Triar una innovació cosmètica i valorar si interessa per al futur professional.",
                "evidence_es": "Fitxa d’innovació.",
                "evidence_ca": "Fitxa d’innovació.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C6_6",
                "title_es": "Elevator pitch",
                "title_ca": "Elevator pitch",
                "description_es": "Explicar en anglès senzill una meta professional.",
                "description_ca": "Explicar en anglès senzill una meta professional.",
                "evidence_es": "Pitch bilingüe.",
                "evidence_ca": "Pitch bilingüe.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_1709_C6_7",
                "title_es": "Pla d’acció",
                "title_ca": "Pla d’acció",
                "description_es": "Ordenar accions concretes per millorar ocupabilitat.",
                "description_ca": "Ordenar accions concretes per millorar ocupabilitat.",
                "evidence_es": "Cronograma personal.",
                "evidence_ca": "Cronograma personal.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C6_8",
                "title_es": "Mentoria entre iguals",
                "title_ca": "Mentoria entre iguals",
                "description_es": "Revisar el full de ruta d’un company/a i aportar millores.",
                "description_ca": "Revisar el full de ruta d’un company/a i aportar millores.",
                "evidence_es": "Feedback del pla.",
                "evidence_ca": "Feedback del pla.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital."
              },
              {
                "id": "act_1709_C6_9",
                "title_es": "Portafoli de ruta",
                "title_ca": "Portafoli de ruta",
                "description_es": "Crear una pàgina de portafoli amb objectius i evidències futures.",
                "description_ca": "Crear una pàgina de portafoli amb objectius i evidències futures.",
                "evidence_es": "Pàgina de portafoli.",
                "evidence_ca": "Pàgina de portafoli.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              }
            ]
          }
        ]
      },
      {
        "id": "1709_RA5",
        "code": "RA5",
        "text_es": "Resultado de aprendizaje 5",
        "text_ca": "Resultat d'aprenentatge 5",
        "criteria_es": [],
        "criteria_ca": [],
        "connections": [
          {
            "title_es": "Identitat digital, xarxes professionals i reputació",
            "title_ca": "Identitat digital, xarxes professionals i reputació",
            "targetModuleCode": "1709",
            "targetModuleName_es": "Itinerario personal para la empleabilidad I",
            "targetModuleName_ca": "Itinerari personal per a l’ocupabilitat I",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "La identitat digital influeix en l’ocupabilitat: publicacions, portafoli, imatges de treballs, privacitat, secret professional i verificació de resultats estètics.",
            "justification_ca": "La identitat digital influeix en l’ocupabilitat: publicacions, portafoli, imatges de treballs, privacitat, secret professional i verificació de resultats estètics.",
            "activities": [
              {
                "id": "act_1709_C7_1",
                "title_es": "Auditoria digital",
                "title_ca": "Auditoria digital",
                "description_es": "Revisar una identitat digital fictícia i detectar riscos d’ocupabilitat.",
                "description_ca": "Revisar una identitat digital fictícia i detectar riscos d’ocupabilitat.",
                "evidence_es": "Informe d’auditoria.",
                "evidence_ca": "Informe d’auditoria.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1709_C7_2",
                "title_es": "Portafoli d’ungles",
                "title_ca": "Portafoli d’ungles",
                "description_es": "Crear una estructura de portafoli digital per mostrar treballs d’ungles.",
                "description_ca": "Crear una estructura de portafoli digital per mostrar treballs d’ungles.",
                "evidence_es": "Esquema de portafoli.",
                "evidence_ca": "Esquema de portafoli.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_1709_C7_3",
                "title_es": "Foto amb permís",
                "title_ca": "Foto amb permís",
                "description_es": "Decidir quan es pot publicar una foto d’un servei realitzat.",
                "description_ca": "Decidir quan es pot publicar una foto d’un servei realitzat.",
                "evidence_es": "Decisió ètica.",
                "evidence_ca": "Decisió ètica.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1709_C7_4",
                "title_es": "Bio professional",
                "title_ca": "Bio professional",
                "description_es": "Redactar una biografia professional breu per a xarxes.",
                "description_ca": "Redactar una biografia professional breu per a xarxes.",
                "evidence_es": "Bio revisada.",
                "evidence_ca": "Bio revisada.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_1709_C7_5",
                "title_es": "Comentari difícil",
                "title_ca": "Comentari difícil",
                "description_es": "Respondre a una valoració negativa amb respecte i professionalitat.",
                "description_ca": "Respondre a una valoració negativa amb respecte i professionalitat.",
                "evidence_es": "Resposta digital.",
                "evidence_ca": "Resposta digital.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C7_6",
                "title_es": "Secret professional",
                "title_ca": "Secret professional",
                "description_es": "Relacionar publicacions digitals amb confidencialitat i deontologia.",
                "description_ca": "Relacionar publicacions digitals amb confidencialitat i deontologia.",
                "evidence_es": "Decàleg digital.",
                "evidence_ca": "Decàleg digital.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_1709_C7_7",
                "title_es": "Abans/després responsable",
                "title_ca": "Abans/després responsable",
                "description_es": "Verificar si una publicació de resultat és honesta i respectuosa.",
                "description_ca": "Verificar si una publicació de resultat és honesta i respectuosa.",
                "evidence_es": "Checklist de publicació.",
                "evidence_ca": "Checklist de publicació.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C7_8",
                "title_es": "Fonts per aprendre",
                "title_ca": "Fonts per aprendre",
                "description_es": "Seleccionar fonts digitals fiables per aprendre tècniques o tendències.",
                "description_ca": "Seleccionar fonts digitals fiables per aprendre tècniques o tendències.",
                "evidence_es": "Llista de fonts.",
                "evidence_ca": "Llista de fonts.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital."
              },
              {
                "id": "act_1709_C7_9",
                "title_es": "Marca personal",
                "title_ca": "Marca personal",
                "description_es": "Definir valors i estil comunicatiu d’una futura professional.",
                "description_ca": "Definir valors i estil comunicatiu d’una futura professional.",
                "evidence_es": "Mini guia de marca.",
                "evidence_ca": "Mini guia de marca.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              }
            ]
          },
          {
            "title_es": "Entorn personal d’aprenentatge i aprenentatge autònom",
            "title_ca": "Entorn personal d’aprenentatge i aprenentatge autònom",
            "targetModuleCode": "1709",
            "targetModuleName_es": "Itinerario personal para la empleabilidad I",
            "targetModuleName_ca": "Itinerari personal per a l’ocupabilitat I",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "L’aprenentatge permanent en estètica requereix configurar un entorn personal d’aprenentatge amb fonts, eines digitals, dades, cursos, tendències i aparatologia fiable.",
            "justification_ca": "L’aprenentatge permanent en estètica requereix configurar un entorn personal d’aprenentatge amb fonts, eines digitals, dades, cursos, tendències i aparatologia fiable.",
            "activities": [
              {
                "id": "act_1709_C8_1",
                "title_es": "El meu PLE",
                "title_ca": "El meu PLE",
                "description_es": "Dissenyar un entorn personal d’aprenentatge per al sector d’estètica.",
                "description_ca": "Dissenyar un entorn personal d’aprenentatge per al sector d’estètica.",
                "evidence_es": "Mapa PLE.",
                "evidence_ca": "Mapa PLE.",
                "diversitySupport_es": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses.",
                "diversitySupport_ca": "Es proporcionen exemples visuals i una graella de disseny; els rols es reparteixen entre recerca, redacció, disseny i revisió perquè cada alumne/a aporti segons les seves fortaleses."
              },
              {
                "id": "act_1709_C8_2",
                "title_es": "Fonts fiables",
                "title_ca": "Fonts fiables",
                "description_es": "Comparar fonts digitals sobre cosmètica, aparatologia o tendències.",
                "description_ca": "Comparar fonts digitals sobre cosmètica, aparatologia o tendències.",
                "evidence_es": "Taula de fiabilitat.",
                "evidence_ca": "Taula de fiabilitat.",
                "diversitySupport_es": "Es proporciona una taula amb categories definidas i un exemple resolt; es permet usar colors, adhesius o icones abans d’afegir la justificació professional.",
                "diversitySupport_ca": "Es proporciona una taula amb categories definidas i un exemple resolt; es permet usar colors, adhesius o icones abans d’afegir la justificació professional."
              },
              {
                "id": "act_1709_C8_3",
                "title_es": "Carpeta cloud",
                "title_ca": "Carpeta cloud",
                "description_es": "Organitzar recursos d’aprenentatge en una estructura de carpetes al núvol.",
                "description_ca": "Organitzar recursos d’aprenentatge en una estructura de carpetes al núvol.",
                "evidence_es": "Estructura de carpetes.",
                "evidence_ca": "Estructura de carpetes.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital."
              },
              {
                "id": "act_1709_C8_4",
                "title_es": "Rutina d’aprenentatge",
                "title_ca": "Rutina d’aprenentatge",
                "description_es": "Crear una rutina setmanal breu per aprendre una tècnica nova.",
                "description_ca": "Crear una rutina setmanal breu per aprendre una tècnica nova.",
                "evidence_es": "Pla setmanal.",
                "evidence_ca": "Pla setmanal.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C8_5",
                "title_es": "Tutorial fiable?",
                "title_ca": "Tutorial fiable?",
                "description_es": "Analitzar si un tutorial d’estètica és segur i professional.",
                "description_ca": "Analitzar si un tutorial d’estètica és segur i professional.",
                "evidence_es": "Checklist de tutorial.",
                "evidence_ca": "Checklist de tutorial.",
                "diversitySupport_es": "S’ofereix una alternativa analògica i una plantilla digital; l’alumnat amb menor competència digital treballa amb parella tutora i se centra en la qualitat professional del contingut.",
                "diversitySupport_ca": "S’ofereix una alternativa analògica i una plantilla digital; l’alumnat amb menor competència digital treballa amb parella tutora i se centra en la qualitat professional del contingut."
              },
              {
                "id": "act_1709_C8_6",
                "title_es": "Aparell nou",
                "title_ca": "Aparell nou",
                "description_es": "Cercar informació bàsica sobre un equip d’anàlisi o tractament.",
                "description_ca": "Cercar informació bàsica sobre un equip d’anàlisi o tractament.",
                "evidence_es": "Fitxa d’aparell.",
                "evidence_ca": "Fitxa d’aparell.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C8_7",
                "title_es": "Curació de continguts",
                "title_ca": "Curació de continguts",
                "description_es": "Seleccionar tres recursos útils i justificar per què ho són.",
                "description_ca": "Seleccionar tres recursos útils i justificar per què ho són.",
                "evidence_es": "Llista comentada.",
                "evidence_ca": "Llista comentada.",
                "diversitySupport_es": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional.",
                "diversitySupport_ca": "La tasca inclou passos visibles, model de producte final i criteris d’èxit concrets; es permet escollir format oral, escrit, visual o digital mantenint el rigor professional."
              },
              {
                "id": "act_1709_C8_8",
                "title_es": "Aprenc i aplic",
                "title_ca": "Aprenc i aplic",
                "description_es": "Triar un recurs i connectar-lo amb una pràctica de cabina.",
                "description_ca": "Triar un recurs i connectar-lo amb una pràctica de cabina.",
                "evidence_es": "Aplicació pràctica.",
                "evidence_ca": "Aplicació pràctica.",
                "diversitySupport_es": "La tasca es fragmenta en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar amb parella de suport i repetir la part pràctica si cal.",
                "diversitySupport_ca": "La tasca es fragmenta en passos curts amb demostració prèvia; es permet observar abans d’executar, treballar amb parella de suport i repetir la part pràctica si cal."
              },
              {
                "id": "act_1709_C8_9",
                "title_es": "PLE compartit",
                "title_ca": "PLE compartit",
                "description_es": "Presentar una eina o font útil a la resta de la classe.",
                "description_ca": "Presentar una eina o font útil a la resta de la classe.",
                "evidence_es": "Recomanació oral.",
                "evidence_ca": "Recomanació oral.",
                "diversitySupport_es": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital.",
                "diversitySupport_ca": "S’entrega una estructura base parcialment completada i peces amb paraules clau; l’alumnat pot construir el mapa de manera manipulativa abans de passar-lo a format escrit o digital."
              }
            ]
          },
          {
            "title_es": "Pla de desenvolupament individual i millora de l’ocupabilitat",
            "title_ca": "Pla de desenvolupament individual i millora de l’ocupabilitat",
            "targetModuleCode": "1709",
            "targetModuleName_es": "Itinerario personal para la empleabilidad I",
            "targetModuleName_ca": "Itinerari personal per a l’ocupabilitat I",
            "targetRaCode": "RA5",
            "targetRaText_es": "Resultado de aprendizaje 5",
            "targetRaText_ca": "Resultat d'aprenentatge 5",
            "relationType": "tecnica",
            "justification_es": "El pla de desenvolupament individual ha de connectar adaptació al mercat, competència digital, qualitat del servei, prevenció i millora contínua de l’ocupabilitat.",
            "justification_ca": "El pla de desenvolupament individual ha de connectar adaptació al mercat, competència digital, qualitat del servei, prevenció i millora contínua de l’ocupabilitat.",
            "activities": [
              {
                "id": "act_1709_C9_1",
                "title_es": "PDI inicial",
                "title_ca": "PDI inicial",
                "description_es": "Crear un pla de desenvolupament individual amb tres objectius prioritaris.",
                "description_ca": "Crear un pla de desenvolupament individual amb tres objectius prioritaris.",
                "evidence_es": "PDI inicial.",
                "evidence_ca": "PDI inicial.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C9_2",
                "title_es": "Competència adaptable",
                "title_ca": "Competència adaptable",
                "description_es": "Identificar canvis del sector i com adaptar-s’hi.",
                "description_ca": "Identificar canvis del sector i com adaptar-s’hi.",
                "evidence_es": "Llista d’adaptacions.",
                "evidence_ca": "Llista d’adaptacions.",
                "diversitySupport_es": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística.",
                "diversitySupport_ca": "Es facilita una estructura oral de tres parts, targetes de suport i vocabulari específic; es pot presentar en parella o amb suport visual per reduir la càrrega memorística."
              },
              {
                "id": "act_1709_C9_3",
                "title_es": "Qualitat mesurable",
                "title_ca": "Qualitat mesurable",
                "description_es": "Incloure un indicador de qualitat o satisfacció dins el PDI.",
                "description_ca": "Incloure un indicador de qualitat o satisfacció dins el PDI.",
                "evidence_es": "Indicador personal.",
                "evidence_ca": "Indicador personal.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C9_4",
                "title_es": "Prevenció personal",
                "title_ca": "Prevenció personal",
                "description_es": "Afegir hàbits de seguretat i ergonomia al pla professional.",
                "description_ca": "Afegir hàbits de seguretat i ergonomia al pla professional.",
                "evidence_es": "Compromís preventiu.",
                "evidence_ca": "Compromís preventiu.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C9_5",
                "title_es": "Millora amb feedback",
                "title_ca": "Millora amb feedback",
                "description_es": "Utilitzar una coavaluació per ajustar el PDI.",
                "description_ca": "Utilitzar una coavaluació per ajustar el PDI.",
                "evidence_es": "PDI revisat.",
                "evidence_ca": "PDI revisat.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C9_6",
                "title_es": "Recursos i calendari",
                "title_ca": "Recursos i calendari",
                "description_es": "Planificar recursos, terminis i evidències per al PDI.",
                "description_ca": "Planificar recursos, terminis i evidències per al PDI.",
                "evidence_es": "Cronograma del PDI.",
                "evidence_ca": "Cronograma del PDI.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C9_7",
                "title_es": "Obstacles reals",
                "title_ca": "Obstacles reals",
                "description_es": "Preveure barreres personals o del sector i estratègies per superar-les.",
                "description_ca": "Preveure barreres personals o del sector i estratègies per superar-les.",
                "evidence_es": "Taula barrera-solució.",
                "evidence_ca": "Taula barrera-solució.",
                "diversitySupport_es": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar.",
                "diversitySupport_ca": "El cas es presenta en lectura fàcil amb dades importants ressaltades; s’utilitza un arbre de decisió i es permet justificar primer oralment o amb paraules clau abans de redactar."
              },
              {
                "id": "act_1709_C9_8",
                "title_es": "PDI digital",
                "title_ca": "PDI digital",
                "description_es": "Convertir el pla en una pàgina o document digital organitzat.",
                "description_ca": "Convertir el pla en una pàgina o document digital organitzat.",
                "evidence_es": "PDI digital.",
                "evidence_ca": "PDI digital.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              },
              {
                "id": "act_1709_C9_9",
                "title_es": "Defensa del pla",
                "title_ca": "Defensa del pla",
                "description_es": "Presentar el PDI i justificar com millora l’ocupabilitat.",
                "description_ca": "Presentar el PDI i justificar com millora l’ocupabilitat.",
                "evidence_es": "Defensa oral.",
                "evidence_ca": "Defensa oral.",
                "diversitySupport_es": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final.",
                "diversitySupport_ca": "Es facilita una plantilla amb apartats seqüenciats, exemples vinculats al sector i banc de paraules; l’alumnat pot completar primer amb paraules clau o pictogrames i després redactar la versió final."
              }
            ]
          }
        ]
      }
    ]
  }
];
