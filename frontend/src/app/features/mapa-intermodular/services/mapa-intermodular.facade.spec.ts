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
    expect(stats.totalRas).toBe(65);
    expect(stats.totalConnections).toBe(485);
    expect(stats.totalActivities).toBe(3357);
  });

  it('should verify module 3159 has exactly 5 RAs and 20 official criteria without RA6', () => {
    const mod3159 = facade.modules().find(m => m.code === '3159');
    expect(mod3159).toBeTruthy();
    expect(mod3159!.learningOutcomes.length).toBe(5);
    expect(mod3159!.learningOutcomes.map(lo => lo.code)).toEqual(['RA1', 'RA2', 'RA3', 'RA4', 'RA5']);
    expect(mod3159!.learningOutcomes.some(lo => lo.code === 'RA6')).toBe(false);

    // RA1: 5 criteria
    expect(mod3159!.learningOutcomes[0].criteria_es?.length).toBe(5);
    expect(mod3159!.learningOutcomes[0].criteria_ca?.length).toBe(5);

    // RA2: 5 criteria
    expect(mod3159!.learningOutcomes[1].criteria_es?.length).toBe(5);
    expect(mod3159!.learningOutcomes[1].criteria_ca?.length).toBe(5);

    // RA3: 3 criteria
    expect(mod3159!.learningOutcomes[2].criteria_es?.length).toBe(3);
    expect(mod3159!.learningOutcomes[2].criteria_ca?.length).toBe(3);

    // RA4: 3 criteria
    expect(mod3159!.learningOutcomes[3].criteria_es?.length).toBe(3);
    expect(mod3159!.learningOutcomes[3].criteria_ca?.length).toBe(3);

    // RA5: 4 criteria
    expect(mod3159!.learningOutcomes[4].criteria_es?.length).toBe(4);
    expect(mod3159!.learningOutcomes[4].criteria_ca?.length).toBe(4);

    const totalCriteria = mod3159!.learningOutcomes.reduce((acc, lo) => acc + (lo.criteria_es?.length || 0), 0);
    expect(totalCriteria).toBe(20);
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

  it('should guarantee bidirectional (retroactive) relations across modules', () => {
    facade.modules.set([...FPB_MODULES_SEED]);

    // Test 1: From 3005, 3005-1e connects with 3011-3a
    facade.selectModule('3005');
    facade.selectRa('3005_RA1');
    facade.selectCriterion('e) Se ha mantenido una conversación');
    const conns3005 = facade.filteredConnections();
    const conn1e = conns3005.find(c => c.sourceCriteria === '3005-1e');
    expect(conn1e).toBeDefined();
    expect(conn1e?.relatedCriteria?.some(r => r.moduleCode === '3011' && r.criteria.includes('3011-3a'))).toBe(true);

    // Test 2: Inversely from 3011, 3011-3a shows relation with 3005-1e
    facade.selectModule('3011');
    facade.selectRa('3011_RA3');
    facade.selectCriterion('3011-3a');
    const conns3011 = facade.filteredConnections();
    const conn3a = conns3011.find(c => c.sourceCriteria?.includes('3011-3a'));
    expect(conn3a).toBeDefined();
    expect(conn3a?.relatedCriteria?.some(r => r.moduleCode === '3005' && r.criteria.includes('3005-1e'))).toBe(true);

    // Test 3: From 3005, 3005-2g connects with 3062-1f
    facade.selectModule('3005');
    facade.selectRa('3005_RA2');
    facade.selectCriterion('g) Se ha asesorado al cliente');
    const conn2g = facade.filteredConnections().find(c => c.sourceCriteria === '3005-2g');
    expect(conn2g).toBeDefined();
    expect(conn2g?.relatedCriteria?.some(r => r.moduleCode === '3062' && r.criteria.includes('3062-1f'))).toBe(true);

    // Test 4: Inversely from 3062, 3062-1f shows relation with 3005-2g
    facade.selectModule('3062');
    facade.selectRa('3062_RA1');
    facade.selectCriterion('f) Se han justificado las causas');
    const conn1f = facade.filteredConnections().find(c => c.sourceCriteria === '3062-1f');
    expect(conn1f).toBeDefined();
    expect(conn1f?.relatedCriteria?.some(r => r.moduleCode === '3005' && r.criteria.includes('3005-2g'))).toBe(true);

    // Test 5: From 3005, 3005-3d connects with 3042-4g
    facade.selectModule('3005');
    facade.selectRa('3005_RA3');
    facade.selectCriterion('d) Se ha recogido la conformidad');
    const conn3d = facade.filteredConnections().find(c => c.sourceCriteria === '3005-3d');
    expect(conn3d).toBeDefined();
    expect(conn3d?.relatedCriteria?.some(r => r.moduleCode === '3042' && r.criteria.includes('3042-4g'))).toBe(true);

    // Test 6: Inversely from 3042, 3042-4g shows relation with 3005-3d
    facade.selectModule('3042');
    facade.selectRa('3042_RA4');
    facade.selectCriterion('3042-4g');
    const conn4g = facade.filteredConnections().find(c => c.sourceCriteria?.includes('3042-4g'));
    expect(conn4g).toBeDefined();
    expect(conn4g?.relatedCriteria?.some(r => r.moduleCode === '3005' && r.criteria.includes('3005-3d'))).toBe(true);
  });
});
