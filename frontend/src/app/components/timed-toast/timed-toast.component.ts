import { Component, effect, input, output } from '@angular/core';

@Component({
  selector: 'app-timed-toast',
  standalone: true,
  templateUrl: './timed-toast.component.html',
  styleUrl: './timed-toast.component.scss',
})
export class TimedToastComponent {
  message = input('');
  durationMs = input(5000);
  restartToken = input(0);
  dismissed = output<void>();

  constructor() {
    effect((onCleanup) => {
      if (!this.message()) return;
      this.restartToken();
      const timer = window.setTimeout(() => this.dismissed.emit(), this.durationMs());
      onCleanup(() => window.clearTimeout(timer));
    });
  }
}
