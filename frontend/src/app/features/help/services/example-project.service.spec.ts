import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExampleProjectService } from './example-project.service';
import { ProjectsService } from '../../projects/services/projects.service';
import { ProjectsFacade } from '../../projects/services/projects.facade';
import { AppFacade } from '../../../app.facade';
import { LayoutService } from '../../../services/layout.service';
import { HELP_CA } from '../i18n/help.ca';

describe('ExampleProjectService', () => {
  let service: ExampleProjectService;
  let projectsService: any;
  let projects: any;
  let appFacade: any;

  beforeEach(() => {
    projectsService = { getExampleProject: vi.fn() };
    projects = { exampleProject: signal(null) };
    appFacade = {
      viewPastProject: vi.fn(),
      errorTitle: signal(''),
      errorMessage: signal(''),
      showErrorModal: signal(false),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: ProjectsService, useValue: projectsService },
        { provide: ProjectsFacade, useValue: projects },
        { provide: AppFacade, useValue: appFacade },
        { provide: LayoutService, useValue: { language: signal('catalan') } },
      ],
    });
    service = TestBed.inject(ExampleProjectService);
  });

  it('abre el proyecto de ejemplo en el taller', async () => {
    const example = { _id: 'ex', isExample: true };
    projectsService.getExampleProject.mockReturnValue(of(example));
    expect(await service.open()).toBe(true);
    expect(projects.exampleProject()).toBe(example);
    expect(appFacade.viewPastProject).toHaveBeenCalledWith(example);
  });

  it('si no se puede abrir, avisa en el idioma de la interfaz', async () => {
    projectsService.getExampleProject.mockReturnValue(throwError(() => new Error('404')));
    expect(await service.open()).toBe(false);
    expect(appFacade.viewPastProject).not.toHaveBeenCalled();
    expect(appFacade.showErrorModal()).toBe(true);
    expect(appFacade.errorMessage()).toBe(HELP_CA.example.loadError);
  });
});
