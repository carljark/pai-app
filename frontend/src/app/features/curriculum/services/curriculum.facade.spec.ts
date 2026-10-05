import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CurriculumFacade } from './curriculum.facade';
import { LearningOutcome, EvaluativeCriteria } from '../models/curriculum.model';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('CurriculumFacade', () => {
  let facade: CurriculumFacade;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [CurriculumFacade, provideHttpClient(), provideHttpClientTesting()],
    });
    facade = TestBed.inject(CurriculumFacade);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should load RAs', () => {
    const mockRAs: LearningOutcome[] = [{ _id: '1', description: 'RA1', subject: 'Math' }];
    facade.loadRas('es');

    const req = httpTestingController.expectOne('/api/ras?lang=es');
    expect(req.request.method).toBe('GET');
    req.flush(mockRAs);

    expect(facade.ras()).toEqual(mockRAs);
  });

  it('should load CEs', () => {
    const mockCEs: EvaluativeCriteria[] = [{ _id: '1', description: 'CE1', subject: 'Math' }];
    facade.loadCes('es');

    const req = httpTestingController.expectOne('/api/ces?lang=es');
    expect(req.request.method).toBe('GET');
    req.flush(mockCEs);

    expect(facade.ces()).toEqual(mockCEs);
  });

  it('should toggle RA selection', () => {
    facade.toggleRa('RA1');
    expect(facade.selectedRas()).toContain('RA1');

    facade.toggleRa('RA1');
    expect(facade.selectedRas()).not.toContain('RA1');
  });

  it('should clear selection', () => {
    facade.toggleRa('RA1');
    facade.clearSelection();
    expect(facade.selectedRas()).toEqual([]);
  });

  it('should return appropriate category style', () => {
    const scienceStyle = facade.getCategoryStyle('Ciencia');
    expect(scienceStyle.bg).toBe('#e8f4f8');

    const languageStyle = facade.getCategoryStyle('Lengua');
    expect(languageStyle.bg).toBe('#fcf3cf');

    const otherStyle = facade.getCategoryStyle('Otro');
    expect(otherStyle.bg).toBe('#ebdef0');
  });

  it('should group items when tipoNivel is FP_BASICA', () => {
    facade.tipoNivel.set('FP_BASICA');
    facade.ras.set([
      { _id: '1', description: 'Desc1', subject: 'SubjectA' },
      { _id: '2', description: 'Desc1', subject: 'SubjectA' },
      { _id: '3', description: 'Desc2', subject: 'SubjectB' },
    ]);

    const groups = facade.groupedItems();
    expect(groups.length).toBe(2);
    const subjectA = groups.find((g) => g.category === 'SubjectA');
    expect(subjectA?.items.length).toBe(1);
    expect(subjectA?.items[0].text).toBe('Desc1');
  });

  it('should group items when tipoNivel is not FP_BASICA', () => {
    facade.tipoNivel.set('DIVERSIFICACION_CURRICULAR');
    facade.ces.set([
      { _id: '1', description: 'Desc1', subject: 'Math' },
      { _id: '2', description: 'Desc2', subject: 'English' },
    ]);

    const groups = facade.groupedItems();
    expect(groups.length).toBe(2);
    expect(groups.find((g) => g.category === 'Math - Math')).toBeDefined();
  });

  it('should compute selectedItemsDetails correctly', () => {
    facade.tipoNivel.set('FP_BASICA');
    facade.ras.set([{ _id: '1', description: 'Desc1', subject: 'SubjectA' }]);
    facade.toggleRa('Desc1');

    const details = facade.selectedItemsDetails();
    expect(details.length).toBe(1);
    expect(details[0].subject).toBe('SubjectA');
  });

  it('should truncate long descriptions in selectedItemsDetails', () => {
    facade.tipoNivel.set('FP_BASICA');
    const longDesc = 'A'.repeat(70);
    facade.ras.set([{ _id: '1', description: longDesc, subject: 'SubjectA' }]);
    facade.toggleRa(longDesc);

    const details = facade.selectedItemsDetails();
    expect(details[0].shortDesc.endsWith('...')).toBe(true);
    expect(details[0].shortDesc.length).toBe(63); // 60 + '...'
  });

  it('should compute groupedSelectedItems correctly', () => {
    facade.tipoNivel.set('FP_BASICA');
    facade.ras.set([
      { _id: '1', description: 'Desc1', subject: 'SubjectA' },
      { _id: '2', description: 'Desc2', subject: 'SubjectA' },
    ]);
    facade.toggleRa('Desc1');
    facade.toggleRa('Desc2');

    const grouped = facade.groupedSelectedItems();
    expect(grouped.length).toBe(1);
    expect(grouped[0].subject).toBe('SubjectA');
    expect(grouped[0].items.length).toBe(2);
  });

  it('should set curso correctly', () => {
    facade.setCurso('2º');
    expect(facade.curso()).toBe('2º');
  });

  it('should fallback to normalized match or default subject when description is not exact', () => {
    facade.tipoNivel.set('FP_BASICA');
    facade.ras.set([
      {
        _id: '1',
        description: 'Resuelve problemas cotidianos aplicando algebra elemental.',
        subject: 'Ciencias',
      },
    ]);

    // Partial/normalized match
    facade.selectedRas.set(['Resuelve problemas cotidianos aplicando algebra elemental']);
    let details = facade.selectedItemsDetails();
    expect(details[0].subject).toBe('Ciencias');

    // Complete mismatch fallback
    facade.selectedRas.set(['Algo totalmente desconocido']);
    details = facade.selectedItemsDetails();
    expect(details[0].subject).toBe('CFGB Peluquería y Estética');

    localStorage.setItem('pai_lang', 'catalan');
    facade.selectedRas.set(['Altre ítem totalment desconegut']);
    details = facade.selectedItemsDetails();
    expect(details[0].subject).toBe('CFGB Perruqueria i Estètica');
  });

  it('should clear selection and persist to localStorage when setTipoNivel changes level', () => {
    facade.tipoNivel.set('FP_BASICA');
    facade.toggleRa('RA1');
    expect(facade.selectedRas()).toContain('RA1');

    facade.setTipoNivel('DIVERSIFICACION_CURRICULAR');
    expect(facade.tipoNivel()).toBe('DIVERSIFICACION_CURRICULAR');
    expect(facade.curso()).toBe('3º');
    expect(facade.selectedRas()).not.toContain('RA1');
    expect(localStorage.getItem('pai_tipo_nivel')).toBe('DIVERSIFICACION_CURRICULAR');
    expect(localStorage.getItem('pai_curso')).toBe('3º');

    // Changing back to FP_BASICA
    facade.setTipoNivel('FP_BASICA');
    expect(facade.tipoNivel()).toBe('FP_BASICA');
    expect(facade.curso()).toBe('1º');
    expect(localStorage.getItem('pai_tipo_nivel')).toBe('FP_BASICA');
    expect(localStorage.getItem('pai_curso')).toBe('1º');

    // Calling setTipoNivel with same level should be no-op
    facade.setTipoNivel('FP_BASICA');
    expect(facade.tipoNivel()).toBe('FP_BASICA');
  });

  it('should persist curso to localStorage when setCurso is called', () => {
    facade.setCurso('2º');
    expect(facade.curso()).toBe('2º');
    expect(localStorage.getItem('pai_curso')).toBe('2º');
  });

  it('should restore tipoNivel and curso from localStorage upon instantiation', () => {
    localStorage.setItem('pai_tipo_nivel', 'DIVERSIFICACION_CURRICULAR');
    localStorage.setItem('pai_curso', '4º');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CurriculumFacade, provideHttpClient(), provideHttpClientTesting()],
    });
    const restoredFacade = TestBed.inject(CurriculumFacade);
    expect(restoredFacade.tipoNivel()).toBe('DIVERSIFICACION_CURRICULAR');
    expect(restoredFacade.curso()).toBe('4º');

    // Test restoring FP_BASICA with 2º
    localStorage.setItem('pai_tipo_nivel', 'FP_BASICA');
    localStorage.setItem('pai_curso', '2º');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CurriculumFacade, provideHttpClient(), provideHttpClientTesting()],
    });
    const fpFacade = TestBed.inject(CurriculumFacade);
    expect(fpFacade.tipoNivel()).toBe('FP_BASICA');
    expect(fpFacade.curso()).toBe('2º');

    // Test restoring invalid curso for level fallbacks to default
    localStorage.setItem('pai_tipo_nivel', 'FP_BASICA');
    localStorage.setItem('pai_curso', '4º'); // 4º invalid for FP_BASICA

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CurriculumFacade, provideHttpClient(), provideHttpClientTesting()],
    });
    const fallbackFacade = TestBed.inject(CurriculumFacade);
    expect(fallbackFacade.curso()).toBe('1º');
  });

  it('should group CFGM_ESTETICA items using fallback when ras is empty and sort by CFGM_MODULE_ORDER', () => {
    facade.tipoNivel.set('CFGM_ESTETICA');
    facade.ras.set([]);

    const groups = facade.groupedItems();
    expect(groups.length).toBe(9);
    expect(groups[0].moduleCode).toBe('0633');
    expect(groups[1].moduleCode).toBe('0635');
    expect(groups[2].moduleCode).toBe('0636');
    expect(groups[3].moduleCode).toBe('0638');
    expect(groups[4].moduleCode).toBe('0640');
    expect(groups[5].moduleCode).toBe('0641');
    expect(groups[6].moduleCode).toBe('1664');
    expect(groups[7].moduleCode).toBe('1709');
    expect(groups[8].moduleCode).toBe('0156');
    expect(groups[0].items.length).toBeGreaterThan(0);
  });

  it('should group CFGM_ESTETICA items from API ras array with moduleCode and sort them', () => {
    facade.tipoNivel.set('CFGM_ESTETICA');
    facade.ras.set([
      {
        id: 'RA1',
        description: 'Desc 0635',
        module: 'Depilación',
        moduleCode: '0635',
        tipoNivel: 'CFGM_ESTETICA',
      } as any,
      {
        id: 'RA1',
        description: 'Desc 0633',
        module: '0633. Higiene',
        moduleCode: '0633',
        tipoNivel: 'CFGM_ESTETICA',
      } as any,
      {
        id: 'RA1',
        description: 'Desc Unknown',
        module: 'Otro módulo',
        tipoNivel: 'CFGM_ESTETICA',
      } as any,
    ]);

    const groups = facade.groupedItems();
    expect(groups.length).toBe(3);
    expect(groups[0].moduleCode).toBe('0633');
    expect(groups[1].moduleCode).toBe('0635');
  });

  it('should handle setTipoNivel to CFGM_ESTETICA and set default course to 1º', () => {
    facade.setTipoNivel('CFGM_ESTETICA');
    expect(facade.tipoNivel()).toBe('CFGM_ESTETICA');
    expect(facade.curso()).toBe('1º');
    expect(localStorage.getItem('pai_tipo_nivel')).toBe('CFGM_ESTETICA');
    expect(localStorage.getItem('pai_curso')).toBe('1º');
  });

  it('should restore CFGM_ESTETICA from localStorage', () => {
    localStorage.setItem('pai_tipo_nivel', 'CFGM_ESTETICA');
    localStorage.setItem('pai_curso', '1º');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CurriculumFacade, provideHttpClient(), provideHttpClientTesting()],
    });
    const cfgmFacade = TestBed.inject(CurriculumFacade);
    expect(cfgmFacade.tipoNivel()).toBe('CFGM_ESTETICA');
    expect(cfgmFacade.curso()).toBe('1º');
  });

  it('should group CFGM_PELUQUERIA items using fallback when ras is empty', () => {
    facade.tipoNivel.set('CFGM_PELUQUERIA');
    facade.ras.set([]);
    const groups = facade.groupedItems();
    expect(groups.length).toBeGreaterThan(0);
  });

  it('should handle setTipoNivel to CFGM_PELUQUERIA and set default course to 1º', () => {
    facade.setTipoNivel('CFGM_PELUQUERIA');
    expect(facade.tipoNivel()).toBe('CFGM_PELUQUERIA');
    expect(facade.curso()).toBe('1º');
    expect(localStorage.getItem('pai_tipo_nivel')).toBe('CFGM_PELUQUERIA');
    expect(localStorage.getItem('pai_curso')).toBe('1º');
  });

  it('should group CFGM_PELUQUERIA items using fallback with Catalan', () => {
    facade.tipoNivel.set('CFGM_PELUQUERIA');
    facade.ras.set([]);
    localStorage.setItem('pai_lang', 'catalan');
    const groups = facade.groupedItems();
    expect(groups.length).toBeGreaterThan(0);
  });

  it('should show only the CFGS Educación Infantil modules of the selected course, in order', () => {
    facade.setTipoNivel('CFGS_EDUCACION_INFANTIL');
    facade.ras.set([]);
    localStorage.setItem('pai_lang', 'castellano');

    const firstYear = facade.groupedItems().map((g) => g.moduleCode);
    expect(firstYear).toEqual(['0011', '0012', '0014', '0015', '1665', '1709']);
    expect(facade.groupedItems()[0].category).toBe('0011. Didáctica de la educación infantil');

    facade.setCurso('2º');
    const secondYear = facade.groupedItems().map((g) => g.moduleCode);
    expect(secondYear).toEqual([
      '0013',
      '0016',
      '0017',
      '0018',
      '0020',
      '0019',
      '0179',
      '1708',
      '1710',
    ]);
  });

  it('should translate the CFGS Educación Infantil fallback to Catalan', () => {
    facade.tipoNivel.set('CFGS_EDUCACION_INFANTIL');
    facade.ras.set([]);
    localStorage.setItem('pai_lang', 'catalan');
    const [didactica] = facade.groupedItems();
    expect(didactica.category).toBe("0011. Didàctica de l'educació infantil");
    expect(didactica.items[0].text).toMatch(/^Contextualitza la intervenció educativa/);
  });

  it('should restore CFGS Educación Infantil as the stored level', () => {
    localStorage.setItem('pai_tipo_nivel', 'CFGS_EDUCACION_INFANTIL');
    localStorage.setItem('pai_curso', '2º');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CurriculumFacade, provideHttpClient(), provideHttpClientTesting()],
    });
    const stored = TestBed.inject(CurriculumFacade);
    expect(stored.tipoNivel()).toBe('CFGS_EDUCACION_INFANTIL');
    expect(stored.curso()).toBe('2º');
  });

  it('should group CFGM_ESTETICA items using fallback with Catalan', () => {
    facade.tipoNivel.set('CFGM_ESTETICA');
    facade.ras.set([]);
    localStorage.setItem('pai_lang', 'catalan');
    const groups = facade.groupedItems();
    expect(groups.length).toBeGreaterThan(0);
  });

  it('should group DIVERSIFICACION_CURRICULAR items with ces', () => {
    facade.tipoNivel.set('DIVERSIFICACION_CURRICULAR');
    facade.ces.set([
      { id: '1', module: 'Mod1', subject: 'Sub1', description: 'desc1', index: 2, course: '3º' },
      { id: '2', module: 'Mod1', subject: 'Sub1', description: 'desc2', index: 1, course: '3º' },
    ] as any);
    facade.curso.set('3º');
    const groups = facade.groupedItems();
    expect(groups.length).toBe(1);
    expect((groups[0].items[0] as any).text).toBe('desc1');
  });

  describe('ESO ordinaria', () => {
    const ESO_CES: EvaluativeCriteria[] = [
      {
        _id: '1',
        subject: 'Matemáticas A',
        tipo: 'opcion',
        ce_num: 1,
        description: 'Igual',
        value: 'Matemáticas A · CE1. Igual',
      },
      {
        _id: '2',
        subject: 'Matemáticas B',
        tipo: 'opcion',
        ce_num: 1,
        description: 'Igual',
        value: 'Matemáticas B · CE1. Igual',
      },
      {
        _id: '3',
        subject: 'Lengua Castellana y Literatura',
        tipo: 'comun',
        ce_num: 2,
        description: 'Comprender textos orales',
        value: 'Lengua Castellana y Literatura · CE2. Comprender textos orales',
      },
    ];

    it('should load the ESO CE of a course', () => {
      facade.loadEsoCes('catalan', '4º');
      const req = httpTestingController.expectOne(
        '/api/ces?lang=catalan&tipoNivel=ESO_ORDINARIA&curso=4%C2%BA',
      );
      req.flush(ESO_CES);
      expect(facade.esoCes()).toEqual(ESO_CES);
    });

    it('should switch to ESO with 1.º as the default course', () => {
      facade.setTipoNivel('ESO_ORDINARIA');
      expect(facade.curso()).toBe('1º');
      expect(localStorage.getItem('pai_tipo_nivel')).toBe('ESO_ORDINARIA');
    });

    it('should restore ESO with any of its four courses', () => {
      localStorage.setItem('pai_tipo_nivel', 'ESO_ORDINARIA');
      localStorage.setItem('pai_curso', '4º');
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [CurriculumFacade, provideHttpClient(), provideHttpClientTesting()],
      });
      const stored = TestBed.inject(CurriculumFacade);
      expect(stored.tipoNivel()).toBe('ESO_ORDINARIA');
      expect(stored.curso()).toBe('4º');
    });

    it('should use the ESO CE as active CE only for the ESO level', () => {
      facade.esoCes.set(ESO_CES);
      facade.ces.set([{ _id: 'p', description: 'PDC' }]);
      facade.tipoNivel.set('DIVERSIFICACION_CURRICULAR');
      expect(facade.activeCes()[0].description).toBe('PDC');
      facade.tipoNivel.set('ESO_ORDINARIA');
      expect(facade.activeCes()).toEqual(ESO_CES);
    });

    it('should group the ESO CE by subject, marking non-common subjects', () => {
      facade.tipoNivel.set('ESO_ORDINARIA');
      facade.esoCes.set(ESO_CES);
      const groups = facade.groupedItems();
      expect(groups.map((g) => g.category)).toEqual([
        'Matemáticas A · De opción',
        'Matemáticas B · De opción',
        'Lengua Castellana y Literatura',
      ]);
      expect(groups[1].items[0]).toEqual({
        index: 1,
        text: 'Igual',
        value: 'Matemáticas B · CE1. Igual',
      });
    });

    it('should show the CE text of the selected subject in the summary', () => {
      facade.tipoNivel.set('ESO_ORDINARIA');
      facade.esoCes.set(ESO_CES);
      facade.toggleRa('Matemáticas B · CE1. Igual');
      expect(facade.selectedItemsDetails()).toEqual([
        {
          subject: 'Matemáticas B · De opción',
          index: 1,
          shortDesc: 'Igual',
          fullDesc: 'Igual',
        },
      ]);
    });
  });
});
