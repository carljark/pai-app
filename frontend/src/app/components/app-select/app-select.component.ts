import { Component, input, output } from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.scss'],
})
export class AppSelectComponent {
  inputId = input<string | null>(null);
  label = input<string | null>(null);
  options = input<SelectOption[]>([]);
  value = input<string>('');
  placeholder = input<string | null>(null);
  size = input<'sm' | 'md'>('md');
  disabled = input<boolean>(false);
  valueChange = output<string>();

  onSelect(event: Event): void {
    this.valueChange.emit((event.target as HTMLSelectElement).value);
  }
}
