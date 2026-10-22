import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectsFacade } from '../../../projects/services/projects.facade';
import { AppFacade } from '../../../../app.facade';
import { LayoutService } from '../../../../services/layout.service';
import { HELP_ES } from '../../../help/i18n/help.es';
import { HELP_CA } from '../../../help/i18n/help.ca';
import { EditLockBannerComponent } from './edit-lock-banner.component';
import { EditLockFacade } from '../../../projects/services/edit-lock.facade';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';
import { TRANSLATIONS_CA } from '../../../../services/translations.ca';

describe('EditLockBannerComponent', () => {
  let fixture: ComponentFixture<EditLockBannerComponent>;
  let editLock: any;
  let t: ReturnType<typeof signal<any>>;
  let currentProject: ReturnType<typeof signal<any>>;
  let appFacade: any;
  let language: ReturnType<typeof signal<'castellano' | 'catalan'>>;

  const text = () => (fixture.nativeElement as HTMLElement).textContent || '';
  const banner = () => fixture.nativeElement.querySelector('.edit-lock-banner') as HTMLElement;

  beforeEach(async () => {
    editLock = {
      readOnly: signal(false),
      lockedByOther: signal(false),
      hasLock: signal(false),
      holderName: signal(''),
    };
    t = signal<any>(TRANSLATIONS_ES);
    currentProject = signal<any>(null);
    appFacade = { cloneProject: vi.fn() };
    language = signal<'castellano' | 'catalan'>('castellano');
    await TestBed.configureTestingModule({
      imports: [EditLockBannerComponent],
      providers: [
        { provide: EditLockFacade, useValue: editLock },
        { provide: TranslationService, useValue: { t } },
        { provide: ProjectsFacade, useValue: { currentProject } },
        { provide: AppFacade, useValue: appFacade },
        { provide: LayoutService, useValue: { language } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EditLockBannerComponent);
    fixture.detectChanges();
  });

  it('no muestra nada si nadie tiene el turno', () => {
    expect(banner()).toBeNull();
  });

  it('en el proyecto de ejemplo invita a hacer una copia, en castellano y en catalán', () => {
    const example = { _id: 'ex', isExample: true };
    currentProject.set(example);
    editLock.readOnly.set(true);
    fixture.detectChanges();
    expect(banner().classList).toContain('edit-lock-banner--example');
    expect(text()).toContain(HELP_ES.example.banner);
    expect(text()).not.toContain(TRANSLATIONS_ES.editReadOnly);

    (banner().querySelector('button') as HTMLButtonElement).click();
    expect(appFacade.cloneProject).toHaveBeenCalledWith(example);

    language.set('catalan');
    fixture.detectChanges();
    expect(text()).toContain(HELP_CA.example.copy);
  });

  it('avisa de quién está editando, en castellano y en catalán', () => {
    editLock.lockedByOther.set(true);
    editLock.holderName.set('Ana');
    fixture.detectChanges();
    expect(banner().classList).toContain('edit-lock-banner--locked');
    expect(text()).toContain('Ana');
    expect(text()).toContain(TRANSLATIONS_ES.editLockOther);

    t.set(TRANSLATIONS_CA);
    fixture.detectChanges();
    expect(text()).toContain(TRANSLATIONS_CA.editLockOther);
  });

  it('indica solo lectura y el turno propio', () => {
    editLock.readOnly.set(true);
    fixture.detectChanges();
    expect(text()).toContain(TRANSLATIONS_ES.editReadOnly);

    editLock.readOnly.set(false);
    editLock.hasLock.set(true);
    fixture.detectChanges();
    expect(banner().classList).toContain('edit-lock-banner--mine');
    expect(text()).toContain(TRANSLATIONS_ES.editLockMine);
  });
});
