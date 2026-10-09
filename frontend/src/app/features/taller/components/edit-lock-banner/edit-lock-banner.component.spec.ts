import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { EditLockBannerComponent } from './edit-lock-banner.component';
import { EditLockFacade } from '../../../projects/services/edit-lock.facade';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';
import { TRANSLATIONS_CA } from '../../../../services/translations.ca';

describe('EditLockBannerComponent', () => {
  let fixture: ComponentFixture<EditLockBannerComponent>;
  let editLock: any;
  let t: ReturnType<typeof signal<any>>;

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
    await TestBed.configureTestingModule({
      imports: [EditLockBannerComponent],
      providers: [
        { provide: EditLockFacade, useValue: editLock },
        { provide: TranslationService, useValue: { t } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EditLockBannerComponent);
    fixture.detectChanges();
  });

  it('no muestra nada si nadie tiene el turno', () => {
    expect(banner()).toBeNull();
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
