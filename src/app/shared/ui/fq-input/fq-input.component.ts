import {Component, Input, Self, Optional, TemplateRef, Output, EventEmitter} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import {NgTemplateOutlet} from '@angular/common';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'fq-input',
  templateUrl: './fq-input.component.html',
  styleUrls: ['./fq-input.component.scss'],
  imports: [
    NgTemplateOutlet,
    NgxMaskDirective,
  ]
})
export class FqInputComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'tel' = 'text';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() variant: 'default' | 'ai' = 'default'
  @Input() label?: string;
  @Input() required?: boolean;
  @Input() iconTpl?: TemplateRef<any>;
  @Input() mask?: string;

  @Output() valueChange: EventEmitter<any> = new EventEmitter();

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    @Optional()
    @Self()
    public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  get showError(): boolean {
    const control = this.ngControl?.control;
    if (!control) return false;

    return control.invalid && control.dirty && !control.pending;
  }

  get errorMessage(): string {
    const errors = this.ngControl?.control?.errors;
    if (!errors || !this.showError) return '';

    if (errors['required']) return 'Поле обязательно';
    if (errors['email']) return 'Неверный формат email';
    if (errors['minlength']) return `Минимальная длина: ${errors['minlength'].requiredLength}`;
    if (errors['passwordsMismatch']) return 'Пароли не совпадают';

    return 'Ошибка валидации';
  }

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur() {
    this.onTouched();
  }

  clear() {
    this.value = '';

    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  hasValue(): boolean {
    return this.value.length > 0;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
