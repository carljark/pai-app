import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-info-modal',
  standalone: true,
  templateUrl: './info-modal.component.html',
})
export class InfoModalComponent {
  title = input<string>('Información');
  message = input<string>('');
  type = input<'info' | 'success'>('info');
  closed = output<void>();
}
