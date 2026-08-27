import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryViewComponent } from './history-view.component';
import { AppFacade } from '../../../../app.facade';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('HistoryViewComponent', () => {
  let component: HistoryViewComponent;
  let fixture: ComponentFixture<HistoryViewComponent>;
  let mockAppFacade: any;
  let mockProjectsFacade: any;

  beforeEach(async () => {
    mockAppFacade = {
      viewPastProject: vi.fn(),
      deleteProject: vi.fn(),
    };

    mockProjectsFacade = {
      projectsHistory: signal([]),
    };

    await TestBed.configureTestingModule({
      imports: [HistoryViewComponent],
      providers: [
        { provide: AppFacade, useValue: mockAppFacade },
        { provide: ProjectsFacade, useValue: mockProjectsFacade },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display empty message when projectsHistory is empty', () => {
    mockProjectsFacade.projectsHistory.set([]);
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('No hay proyectos en esta sección.');
  });

  it('should render projects from projectsHistory', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj 1', status: 'publicado', createdAt: new Date().toISOString(), modules: ['Mod1'] },
      { _id: '2', title: '', status: 'borrador', createdAt: new Date().toISOString() },
    ]);
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(element.textContent).toContain('Proj 1');
    expect(element.textContent).toContain('Proyecto sin título');
  });

  it('should call viewPastProject when Open Editor or View Error is clicked', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj 1', status: 'publicado', createdAt: new Date().toISOString(), modules: ['Mod1'] },
      { _id: '2', title: 'Proj 2', status: 'error', createdAt: new Date().toISOString() },
    ]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    // First project has Open Editor, and Delete
    // Second project has View Error, and Delete
    // Total 4 buttons
    buttons[0].click(); // Open Editor
    expect(mockAppFacade.viewPastProject).toHaveBeenCalledWith(mockProjectsFacade.projectsHistory()[0]);
    
    buttons[2].click(); // View Error
    expect(mockAppFacade.viewPastProject).toHaveBeenCalledWith(mockProjectsFacade.projectsHistory()[1]);
  });

  it('should call deleteProject when delete button is clicked', () => {
    mockProjectsFacade.projectsHistory.set([
      { _id: '1', title: 'Proj 1', status: 'publicado', createdAt: new Date().toISOString(), modules: ['Mod1'] }
    ]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons[1].click(); // Delete button
    expect(mockAppFacade.deleteProject).toHaveBeenCalledWith('1');
  });
});
