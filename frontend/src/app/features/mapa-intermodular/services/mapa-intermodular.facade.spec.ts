import { TestBed } from '@angular/core/testing';
import { MapaIntermodularFacade } from './mapa-intermodular.facade';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MapaIntermodularFacade', () => {
  let facade: MapaIntermodularFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapaIntermodularFacade]
    });
    facade = TestBed.inject(MapaIntermodularFacade);
  });

  it('should be created and load seed modules', () => {
    expect(facade).toBeTruthy();
    expect(facade.modules().length).toBeGreaterThanOrEqual(12);
    expect(facade.selectedModuleCode()).toBe('3060');
    expect(facade.selectedModule()?.name_es).toContain('entorno profesional');
    expect(facade.selectedRa()).toBeTruthy();
  });

  it('should calculate global statistics', () => {
    const stats = facade.stats();
    expect(stats.totalModules).toBeGreaterThanOrEqual(12);
    expect(stats.totalRas).toBeGreaterThan(0);
    expect(stats.totalConnections).toBeGreaterThan(0);
    expect(stats.totalActivities).toBeGreaterThan(0);
  });

  it('should select module and update selectedRaId', () => {
    facade.selectModule('3063');
    expect(facade.selectedModuleCode()).toBe('3063');
    expect(facade.selectedModule()?.code).toBe('3063');
    expect(facade.selectedRa()?.id).toBe('3063_RA1');
  });

  it('should select RA by id', () => {
    facade.selectRa('3060_RA1');
    expect(facade.selectedRaId()).toBe('3060_RA1');
    expect(facade.selectedRa()?.code).toBe('RA1');
  });

  it('should filter modules by type', () => {
    facade.setTypeFilter('especifico');
    const specificMods = facade.filteredModules();
    expect(specificMods.every(m => m.type === 'especifico')).toBe(true);

    facade.setTypeFilter('all');
    expect(facade.filteredModules().length).toBe(facade.modules().length);
  });

  it('should filter modules by relation type', () => {
    facade.setRelationFilter('ciencias');
    const filtered = facade.filteredModules();
    expect(filtered.length).toBeGreaterThan(0);
    
    facade.setRelationFilter('all');
    expect(facade.filteredModules().length).toBe(facade.modules().length);
  });

  it('should filter modules by search query', () => {
    facade.setSearch('peluquería');
    const res = facade.filteredModules();
    expect(res).toBeDefined();

    facade.setSearch('3063');
    expect(facade.filteredModules().length).toBe(1);
    expect(facade.filteredModules()[0].code).toBe('3063');

    facade.setSearch('');
    expect(facade.filteredModules().length).toBe(facade.modules().length);
  });

  it('should export connection summary in Castellano and Catalan', () => {
    facade.selectModule('3060');
    const summaryEs = facade.exportConnectionSummary('castellano');
    expect(summaryEs).toContain('3060');
    expect(summaryEs).toContain('CONEXIONES INTERMODULARES');

    const summaryCa = facade.exportConnectionSummary('catalan');
    expect(summaryCa).toContain('3060');
    expect(summaryCa).toContain('CONNEXIONS INTERMODULARS');
  });

  it('should test fallbacks for unknown module or RA and empty list', () => {
    facade.selectedModuleCode.set('non_existent');
    expect(facade.selectedModule()).toBeTruthy();

    facade.selectedRaId.set('non_existent_ra');
    expect(facade.selectedRa()).toBeTruthy();

    facade.setSearch({ target: { value: '3060' } });
    expect(facade.searchQuery()).toBe('3060');

    facade.setSearch({ target: null });
    expect(facade.searchQuery()).toBe('');

    facade.modules.set([]);
    expect(facade.exportConnectionSummary('castellano')).toBe('');
  });
});
