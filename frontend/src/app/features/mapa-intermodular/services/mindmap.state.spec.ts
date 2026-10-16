import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mindmapModules } from '../../../testing/mindmap.mock';
import type { MindmapNode } from '../models/mindmap.model';
import { MapaIntermodularFacade } from './mapa-intermodular.facade';
import { MindmapState } from './mindmap.state';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MindmapState],
    });
    facade = TestBed.inject(MapaIntermodularFacade);
    facade.modules.set(mindmapModules());
    state = TestBed.inject(MindmapState);
    TestBed.tick();
  });

  function openAll() {
    for (const n of [MODULE, RA, GROUP, CONNECTION]) state.activate(n);
  }

  it('despliega la rama nivel a nivel y selecciona la conexión en la fachada', () => {
    const selectRa = vi.spyOn(facade, 'selectRa');
    openAll();
    expect(state.path()).toEqual({
      moduleCode: '0001',
      raId: '0001_RA1',
      groupCode: '0002',
      connectionIndex: 2,
    });
    expect(selectRa).toHaveBeenCalledWith('0001_RA1');
    expect(state.selection()?.connection.targetRaCode).toBe('RA2');
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
    expect(state.selection()).toBeNull();
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
});
