import { Component, inject } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';
import { EditLockFacade } from '../../../projects/services/edit-lock.facade';

/**
 * Aviso del taller sobre quién puede modificar el proyecto: solo lectura para quien no es
 * autor ni colaborador, el nombre de quien tiene el turno de edición, o el turno propio.
 */
@Component({
  selector: 'app-edit-lock-banner',
  standalone: true,
  templateUrl: './edit-lock-banner.component.html',
  styleUrl: './edit-lock-banner.component.scss',
})
export class EditLockBannerComponent {
  editLock = inject(EditLockFacade);
  trans = inject(TranslationService);
}
