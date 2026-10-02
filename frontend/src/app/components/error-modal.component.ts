import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-modal',
  standalone: true,
  templateUrl: './error-modal.component.html',
})
export class ErrorModalComponent {
  title = input<string>('Ha ocurrido un error');
  message = input<string>('');
  closed = output<void>();
}
