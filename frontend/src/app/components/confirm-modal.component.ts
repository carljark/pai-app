import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  templateUrl: './confirm-modal.component.html',
})
export class ConfirmModalComponent {
  title = input<string>('¿Estás seguro?');
  message = input<string>('Esta acción no se puede deshacer.');
  confirm = output<void>();
  cancelled = output<void>();
}
