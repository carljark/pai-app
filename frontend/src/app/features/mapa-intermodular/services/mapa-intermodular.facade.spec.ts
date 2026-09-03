import { TestBed } from '@angular/core/testing';
import { MapaIntermodularFacade } from './mapa-intermodular.facade';
import { FPB_MODULES_SEED } from '../data/mapa-intermodular.seed';
import { describe, it, expect, beforeEach } from 'vitest';

describe('MapaIntermodularFacade', () => {
  let facade: MapaIntermodularFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapaIntermodularFacade]
    });
    facade = TestBed.inject(MapaIntermodularFacade);
    facade.modules.set([...FPB_MODULES_SEED]);
    facade.selectModule('3060');
    facade.selectRa('3060_RA1');
  });

  it('should be created and load seed modules', () => {
    expect(facade).toBeTruthy();
    expect(facade.modules().length).toBe(11);
    expect(facade.selectedModuleCode()).toBe('3060');
    expect(facade.selectedModule()?.name_es).toContain('Preparación del entorno profesional');
    expect(facade.selectedRa()).toBeTruthy();
  });

  it('should calculate global statistics', () => {
    const stats = facade.stats();
    expect(stats.totalModules).toBe(11);
    expect(stats.totalRas).toBeGreaterThan(0);
    expect(stats.totalConnections).toBe(316);
    expect(stats.totalActivities).toBe(2174);
  });

  it('should select module and update selectedRaId, and collapse when clicked again', () => {
    facade.selectModule('3063');
    expect(facade.selectedModuleCode()).toBe('3063');
    expect(facade.selectedModule()?.code).toBe('3063');
    expect(facade.selectedRa()?.id).toBe('3063_RA1');

    // Re-click same module to collapse
    facade.selectModule('3063');
    expect(facade.selectedModuleCode()).toBe('');
    expect(facade.selectedRaId()).toBe('');
    expect(facade.selectedModule()).toBeNull();
    expect(facade.selectedRa()).toBeNull();
    expect(facade.filteredConnections()).toEqual([]);
  });

  it('should select RA by id', () => {
    facade.selectRa('3005_RA1');
    expect(facade.selectedRaId()).toBe('3005_RA1');
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
    facade.setSearch('maquillaje');
    const res = facade.filteredModules();
    expect(res).toBeDefined();

    facade.setSearch('3063');
    expect(facade.filteredModules().length).toBe(1);
    expect(facade.filteredModules()[0].code).toBe('3063');

    facade.setSearch('');
    expect(facade.filteredModules().length).toBe(facade.modules().length);
  });

  it('should export connection summary in Castellano and Catalan', () => {
    facade.selectModule('3005');
    const summaryEs = facade.exportConnectionSummary('castellano');
    expect(summaryEs).toContain('3005');
    expect(summaryEs).toContain('CONEXIONES INTERMODULARES');

    const summaryCa = facade.exportConnectionSummary('catalan');
    expect(summaryCa).toContain('3005');
    expect(summaryCa).toContain('CONNEXIONS INTERMODULARS');
  });

  it('should test fallbacks for unknown module or RA and empty list', () => {
    facade.selectedModuleCode.set('non_existent');
    expect(facade.selectedModule()).toBeNull();

    facade.selectedRaId.set('non_existent_ra');
    expect(facade.selectedRa()).toBeNull();

    facade.setSearch({ target: { value: '3060' } });
    expect(facade.searchQuery()).toBe('3060');

    facade.setSearch({ target: null });
    expect(facade.searchQuery()).toBe('');

    facade.setSearch(123 as any);
    expect(facade.searchQuery()).toBe('');

    // Empty modules
    facade.modules.set([]);
    expect(facade.selectedModule()).toBeNull();
    expect(facade.selectedRa()).toBeNull();
    expect(facade.exportConnectionSummary('castellano')).toBe('');
    facade.modules.set([...FPB_MODULES_SEED]);
  });

  it('should cover module with empty learning outcomes', () => {
    facade.modules.set([
      {
        code: 'TEST',
        name_es: 'Modulo Test',
        name_ca: 'Mòdul Test',
        type: 'especifico',
        color: '#333',
        icon: 'test',
        learningOutcomes: []
      }
    ]);
    facade.selectModule('TEST');
    expect(facade.selectedRa()).toBeNull();

    // selectModule with non-existent code
    facade.selectModule('UNKNOWN_CODE');
    expect(facade.selectedModuleCode()).toBe('UNKNOWN_CODE');

    // Module with undefined learningOutcomes
    facade.modules.set([
      {
        code: 'TEST2',
        name_es: 'Modulo Test 2',
        name_ca: 'Mòdul Test 2',
        type: 'especifico',
        color: '#333',
        icon: 'test2'
      } as any
    ]);
    facade.selectModule('TEST2');
    expect(facade.selectedRa()).toBeNull();
  });

  it('should cover all search match branches and relation filtering', () => {
    // Search match by name_es
    facade.setSearch('maquillaje');
    expect(facade.filteredModules().some(m => m.code === '3063')).toBe(true);

    // Search match by name_ca
    facade.setSearch('atenció');
    expect(facade.filteredModules().length).toBeGreaterThan(0);

    // Search match by RA code
    facade.setSearch('RA1');
    expect(facade.filteredModules().length).toBeGreaterThan(0);

    // Search match by RA text_es
    facade.setSearch('cliente');
    expect(facade.filteredModules().length).toBeGreaterThan(0);

    // Search match by RA text_ca
    facade.setSearch('client');
    expect(facade.filteredModules().length).toBeGreaterThan(0);

    // Search no match
    facade.setSearch('xyz_no_match_possible_999');
    expect(facade.filteredModules().length).toBe(0);

    // Relation filter with non-matching relation
    facade.setSearch('');
    facade.setRelationFilter('non_existent_relation');
    expect(facade.filteredModules().length).toBe(0);
  });

  it('should select criterion and filter connections accordingly', () => {
    facade.selectModule('3060');
    facade.selectRa('3060_RA1');

    const totalConns = facade.filteredConnections().length;
    expect(totalConns).toBeGreaterThan(0);

    // Select criterion 'a'
    facade.selectCriterion('a) Se ha relacionado');
    expect(facade.selectedCriterion()).toBe('a) Se ha relacionado');
    const connsA = facade.filteredConnections();
    expect(connsA.length).toBeGreaterThan(0);

    // Test getConnectionsCountForCriterion
    const count = facade.getConnectionsCountForCriterion('a) Se ha relacionado');
    expect(count).toBeGreaterThan(0);

    // Clear criterion
    facade.selectCriterion(null);
    expect(facade.selectedCriterion()).toBeNull();
    expect(facade.filteredConnections().length).toBe(totalConns);

    // Edge cases for count helper and empty RA
    expect(facade.getConnectionsCountForCriterion('')).toBe(totalConns);
    facade.modules.set([]);
    expect(facade.getConnectionsCountForCriterion('a')).toBe(0);
    expect(facade.filteredConnections()).toEqual([]);
  });
});
