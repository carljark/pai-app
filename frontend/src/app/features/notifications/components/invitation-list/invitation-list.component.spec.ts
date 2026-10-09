import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InvitationListComponent } from './invitation-list.component';
import { NotificationsFacade } from '../../services/notifications.facade';
import { LayoutService } from '../../../../services/layout.service';
import { TranslationService } from '../../../../services/translation.service';
import { TRANSLATIONS_ES } from '../../../../services/translations.es';
import { TRANSLATIONS_CA } from '../../../../services/translations.ca';
import { AppNotification } from '../../models/notification.model';

const invitation = (overrides: Partial<AppNotification> = {}): AppNotification => ({
  id: 'n1',
  type: 'INVITATION',
  title: 'Huerto escolar',
  message: '',
  projectId: 'p1',
  userName: 'Ana',
  timestamp: new Date(),
  read: false,
  ...overrides,
});

describe('InvitationListComponent', () => {
  let fixture: ComponentFixture<InvitationListComponent>;
  let invitations: ReturnType<typeof signal<AppNotification[]>>;
  let notifications: any;
  let layout: any;
  let t: ReturnType<typeof signal<any>>;

  const el = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    invitations = signal<AppNotification[]>([]);
    notifications = { invitations, closeRecentActivity: vi.fn() };
    layout = { switchView: vi.fn(), requestedProject: { set: vi.fn() } };
    t = signal<any>(TRANSLATIONS_ES);
    await TestBed.configureTestingModule({
      imports: [InvitationListComponent],
      providers: [
        { provide: NotificationsFacade, useValue: notifications },
        { provide: LayoutService, useValue: layout },
        { provide: TranslationService, useValue: { t } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(InvitationListComponent);
    fixture.detectChanges();
  });

  it('no se muestra sin invitaciones', () => {
    expect(el().querySelector('.invitation-list')).toBeNull();
  });

  it('muestra quién invita y a qué proyecto, en castellano y en catalán', () => {
    invitations.set([invitation(), invitation({ id: 'n2', read: true })]);
    fixture.detectChanges();
    const items = el().querySelectorAll('.invitation-list__item');
    expect(items.length).toBe(2);
    expect(items[0].classList).toContain('invitation-list__item--unread');
    expect(items[1].classList).not.toContain('invitation-list__item--unread');
    expect(items[0].textContent).toContain('Ana');
    expect(items[0].textContent).toContain(TRANSLATIONS_ES.invitationInvitedYou);
    expect(items[0].textContent).toContain('«Huerto escolar»');

    t.set(TRANSLATIONS_CA);
    fixture.detectChanges();
    expect(el().textContent).toContain(TRANSLATIONS_CA.invitationsTitle);
  });

  it('al pulsar abre el proyecto en el taller y cierra la actividad reciente', () => {
    invitations.set([invitation()]);
    fixture.detectChanges();
    (el().querySelector('.invitation-list__open') as HTMLButtonElement).click();
    expect(notifications.closeRecentActivity).toHaveBeenCalled();
    expect(layout.switchView).toHaveBeenCalledWith('taller', 'p1');
    expect(layout.requestedProject.set).toHaveBeenCalledWith('p1');
  });

  it('ignora invitaciones sin proyecto', () => {
    fixture.componentInstance.open(invitation({ projectId: undefined }));
    expect(layout.switchView).not.toHaveBeenCalled();
  });
});
