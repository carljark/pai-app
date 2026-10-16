import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mindmapModules } from '../../../testing/mindmap.mock';
import type { MindmapNode } from '../models/mindmap.model';
import { MapaIntermodularFacade } from './mapa-intermodular.facade';
import { MINDMAP_SELECTION, MindmapState } from './mindmap.state';
import { MapaVistaService } from './mapa-vista.service';

function node(partial: Partial<MindmapNode>): MindmapNode {
  return {
    id: 'x',
    kind: 'root',
    badge: '',
    label: '',
    color: '',
    expandable: true,
    expanded: false,
    searchText: '',
    relationTypes: [],
    children: [],
    ...partial,
  };
}

const MODULE = node({ kind: 'module', moduleCode: '0001' });
const RA = node({ kind: 'ra', raId: '0001_RA1' });
const GROUP = node({ kind: 'group', targetModuleCode: '0002' });
const CONNECTION = node({ kind: 'connection', raId: '0001_RA1', connectionIndex: 2 });

describe('MindmapState', () => {
  let state: MindmapState;
  let facade: MapaIntermodularFacade;
  const onSelect = vi.fn();

  beforeEach(() => {
    onSelect.mockReset();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MindmapState, { provide: MINDMAP_SELECTION, useValue: onSelect }],
    });
    facade = TestBed.inject(MapaIntermodularFacade);
    facade.modules.set(mindmapModules());
    state = TestBed.inject(MindmapState);
    TestBed.tick();
  });

  function openAll() {
    for (const n of [MODULE, RA, GROUP, CONNECTION]) state.activate(n);
  }

  it('despliega la rama nivel a nivel y avisa de la hoja elegida', () => {
    openAll();
    expect(state.path()).toEqual({
      moduleCode: '0001',
      raId: '0001_RA1',
      groupCode: '0002',
      connectionIndex: 2,
    });
    expect(onSelect).toHaveBeenCalledWith(CONNECTION);
  });

  it('volver a pulsar un nodo lo pliega junto con sus descendientes', () => {
    openAll();
    state.activate(CONNECTION);
    expect(state.path().connectionIndex).toBeNull();
    state.activate(CONNECTION);
    state.activate(GROUP);
    expect(state.path()).toMatchObject({ groupCode: '', connectionIndex: null });
    state.activate(RA);
    expect(state.path()).toMatchObject({ moduleCode: '0001', raId: '' });
    state.activate(MODULE);
    expect(state.path().moduleCode).toBe('');
  });

  it('cerrar el panel solo deselecciona la conexión', () => {
    openAll();
    state.closeConnection();
    expect(state.path()).toMatchObject({ groupCode: '0002', connectionIndex: null });
  });

  it('pulsar el centro pliega todo', () => {
    openAll();
    state.activate(node({ kind: 'root' }));
    expect(state.path().moduleCode).toBe('');
  });

  it('elegir de nuevo el tipo activo de la leyenda lo desactiva', () => {
    state.toggleRelationFilter('digital');
    expect(state.relationFilter()).toBe('digital');
    state.toggleRelationFilter('digital');
    expect(state.relationFilter()).toBe('all');
  });

  it('al cambiar de curso el mapa vuelve a plegarse', () => {
    state.activate(MODULE);
    facade.activeTab.set('OTRO');
    TestBed.tick();
    expect(state.path().moduleCode).toBe('');
  });

  it('al llegar desde la panorámica abre el RA pendiente una sola vez', () => {
    TestBed.inject(MapaVistaService).abrirEnMapaMental({ moduleCode: '0001', raId: '0001_RA2' });
    facade.activeTab.set('OTRA');
    TestBed.tick();
    expect(state.path()).toMatchObject({ moduleCode: '0001', raId: '0001_RA2' });
    facade.activeTab.set('OTRA_MAS');
    TestBed.tick();
    expect(state.path().moduleCode).toBe('');
    localStorage.removeItem('pai_mapa_vista');
  });

  it('sin estrategia de selección, elegir una hoja solo cambia la rama', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MindmapState],
    });
    const bare = TestBed.inject(MindmapState);
    bare.activate(CONNECTION);
    expect(bare.path().connectionIndex).toBe(2);
  });
});
