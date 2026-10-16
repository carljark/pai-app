import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectTitleComponent } from './project-title.component';
import { ProjectsFacade } from '../../services/projects.facade';
import { AuthFacade } from '../../../auth/services/auth.facade';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES as ES } from '../../../../services/translations.es';
import { TRANSLATIONS_CA as CA } from '../../../../services/translations.ca';

describe('ProjectTitleComponent', () => {
  let fixture: ComponentFixture<ProjectTitleComponent>;
  let component: ProjectTitleComponent;
  let projects: { renameProject: ReturnType<typeof vi.fn> };
  let currentUser: ReturnType<typeof signal<any>>;
  let t: ReturnType<typeof signal<any>>;

  const project = {
    _id: 'p1',
    title: 'Proyecto Generado',
    modules: ['Mod1'],
    userId: { _id: 'autor', name: 'Eva' },
    collaborators: [{ userId: { _id: 'colega' } }],
  };

  const el = <T extends HTMLElement = HTMLElement>(selector: string): T | null =>
    fixture.nativeElement.querySelector(selector);

  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const openEditor = async () => {
    el('.project-title__edit')!.click();
    await render();
    return el('.project-title__input') as HTMLInputElement;
  };

  const type = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  beforeEach(async () => {
    projects = { renameProject: vi.fn().mockReturnValue(of({})) };
    currentUser = signal<any>({ _id: 'autor', role: 'teacher' });
    t = signal<any>(ES);

    await TestBed.configureTestingModule({
      imports: [ProjectTitleComponent],
      providers: [
        { provide: ProjectsFacade, useValue: projects },
        { provide: AuthFacade, useValue: { currentUser } },
        { provide: TranslationService, useValue: { t } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectTitleComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', project);
    fixture.componentRef.setInput('displayTitle', 'Mod1');
    await render();
  });

  it('muestra el nombre y el botón de cambiarlo en los dos idiomas', async () => {
    expect(el('.project-title__text')?.textContent).toContain('Mod1');
    expect(el('.project-title__edit')?.getAttribute('title')).toBe('Cambiar el nombre');

    t.set(CA);
    await render();
    expect(el('.project-title__edit')?.getAttribute('title')).toBe('Canviar el nom');
  });

  it('solo ofrece el cambio a quien puede editar el proyecto', async () => {
    currentUser.set({ _id: 'ajeno', role: 'teacher' });
    await render();
    expect(el('.project-title__edit')).toBeNull();

    currentUser.set({ _id: 'colega', role: 'teacher' });
    await render();
    expect(el('.project-title__edit')).not.toBeNull();

    currentUser.set({ _id: 'otro', role: 'admin' });
    await render();
    expect(el('.project-title__edit')).not.toBeNull();
  });

  it('guarda el nombre nuevo con el botón y vuelve a mostrar el título', async () => {
    const input = await openEditor();
    expect(input.value).toBe('Mod1');

    type(input, '  Huerto   escolar  ');
    await render();
    el<HTMLButtonElement>('.project-title__save')!.click();
    await render();

    expect(projects.renameProject).toHaveBeenCalledWith('p1', 'Huerto escolar');
    expect(component.editing()).toBe(false);
    expect(el('.project-title__input')).toBeNull();
  });

  it('guarda con Intro y cancela con Escape o con el botón', async () => {
    let input = await openEditor();
    type(input, 'Con Intro');
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await render();
    expect(projects.renameProject).toHaveBeenCalledWith('p1', 'Con Intro');

    input = await openEditor();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await render();
    expect(el('.project-title__input')).toBeNull();

    await openEditor();
    el<HTMLButtonElement>('.project-title__cancel')!.click();
    await render();
    expect(el('.project-title__input')).toBeNull();
    expect(projects.renameProject).toHaveBeenCalledTimes(1);
  });

  it('no envía nada si el nombre está vacío o no cambia', async () => {
    const input = await openEditor();
    type(input, '   ');
    await render();
    expect(el<HTMLButtonElement>('.project-title__save')!.disabled).toBe(true);
    component.save();

    type(input, 'Proyecto Generado');
    component.save();
    await render();

    expect(projects.renameProject).not.toHaveBeenCalled();
    expect(el('.project-title__input')).toBeNull();
  });

  it('avisa del error y deja el editor abierto', async () => {
    projects.renameProject.mockReturnValue(throwError(() => new Error('500')));
    const input = await openEditor();
    type(input, 'Nombre nuevo');
    el<HTMLButtonElement>('.project-title__save')!.click();
    await render();

    expect(el('.project-title__error')?.textContent).toContain(
      'No se ha podido cambiar el nombre del proyecto.',
    );
    expect(component.saving()).toBe(false);
    expect(el('.project-title__input')).not.toBeNull();
  });

  it('ignora un segundo guardado mientras se envía el primero', () => {
    component.draft.set('Nombre');
    component.saving.set(true);
    component.save();
    expect(projects.renameProject).not.toHaveBeenCalled();
  });
});
