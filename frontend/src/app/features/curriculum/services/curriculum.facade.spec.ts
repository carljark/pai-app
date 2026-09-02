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
    TestBed.configureTestingModule({
      providers: [
        CurriculumFacade,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    facade = TestBed.inject(CurriculumFacade);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
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
      { _id: '3', description: 'Desc2', subject: 'SubjectB' }
    ]);
    
    const groups = facade.groupedItems();
    expect(groups.length).toBe(2);
    const subjectA = groups.find(g => g.category === 'SubjectA');
    expect(subjectA?.items.length).toBe(1);
    expect(subjectA?.items[0].text).toBe('Desc1');
  });

  it('should group items when tipoNivel is not FP_BASICA', () => {
    facade.tipoNivel.set('DIVERSIFICACION_CURRICULAR');
    facade.ces.set([
      { _id: '1', description: 'Desc1', subject: 'Math' },
      { _id: '2', description: 'Desc2', subject: 'English' }
    ]);
    
    const groups = facade.groupedItems();
    expect(groups.length).toBe(2);
    expect(groups.find(g => g.category === 'Math - Math')).toBeDefined();
  });

  it('should compute selectedItemsDetails correctly', () => {
    facade.tipoNivel.set('FP_BASICA');
    facade.ras.set([
      { _id: '1', description: 'Desc1', subject: 'SubjectA' }
    ]);
    facade.toggleRa('Desc1');
    
    const details = facade.selectedItemsDetails();
    expect(details.length).toBe(1);
    expect(details[0].subject).toBe('SubjectA');
  });

  it('should truncate long descriptions in selectedItemsDetails', () => {
    facade.tipoNivel.set('FP_BASICA');
    const longDesc = 'A'.repeat(70);
    facade.ras.set([
      { _id: '1', description: longDesc, subject: 'SubjectA' }
    ]);
    facade.toggleRa(longDesc);
    
    const details = facade.selectedItemsDetails();
    expect(details[0].shortDesc.endsWith('...')).toBe(true);
    expect(details[0].shortDesc.length).toBe(63); // 60 + '...'
  });

  it('should compute groupedSelectedItems correctly', () => {
    facade.tipoNivel.set('FP_BASICA');
    facade.ras.set([
      { _id: '1', description: 'Desc1', subject: 'SubjectA' },
      { _id: '2', description: 'Desc2', subject: 'SubjectA' }
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
      { _id: '1', description: 'Resuelve problemas cotidianos aplicando algebra elemental.', subject: 'Ciencias' }
    ]);
    
    // Partial/normalized match
    facade.selectedRas.set(['Resuelve problemas cotidianos aplicando algebra elemental']);
    let details = facade.selectedItemsDetails();
    expect(details[0].subject).toBe('Ciencias');

    // Complete mismatch fallback
    facade.selectedRas.set(['Algo totalmente desconocido']);
    details = facade.selectedItemsDetails();
    expect(details[0].subject).toBe('FP Básica');
  });

  it('should clear selection when setTipoNivel changes level', () => {
    facade.tipoNivel.set('FP_BASICA');
    facade.toggleRa('RA1');
    expect(facade.selectedRas()).toContain('RA1');
    
    facade.setTipoNivel('DIVERSIFICACION_CURRICULAR');
    expect(facade.tipoNivel()).toBe('DIVERSIFICACION_CURRICULAR');
    expect(facade.selectedRas()).not.toContain('RA1');
  });
});
