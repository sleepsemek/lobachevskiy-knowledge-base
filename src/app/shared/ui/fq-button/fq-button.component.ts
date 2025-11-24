import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ComponentSize } from '../component-size';
import {FqSpinnerComponent} from '../fq-spinner/fq-spinner.component';

@Component({
  selector: 'fq-button',
  templateUrl: './fq-button.component.html',
  imports: [
    FqSpinnerComponent
  ],
  styleUrl: './fq-button.component.scss'
})
export class FqButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'text' = 'primary';
  @Input() size: ComponentSize = 'medium';
  @Input() shape: 'circle' | 'square' | 'normal' = 'normal';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth: boolean = false;

  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    return [
      'btn',
      `btn--${this.variant}`,
      `btn--${this.size}`,
      `btn--${this.shape}`,
      this.disabled || this.loading ? 'btn--disabled' : '',
      this.fullWidth ? 'btn--full-width' : '',
    ].join(' ').trim();
  }

  handleClick(event: Event): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit(event);
    }
  }
}
