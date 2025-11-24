import {Component, ElementRef, forwardRef, HostListener, Input} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'fq-checkbox',
  imports: [],
  templateUrl: './fq-checkbox.component.html',
  styleUrl: './fq-checkbox.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FqCheckboxComponent),
      multi: true
    }
  ],
})
export class FqCheckboxComponent {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;

  value: boolean = false;
  private onChange = (value: boolean) => {};
  private onTouched = () => {};

  labelId: string = `checkbox-${Math.random().toString(36).substring(2)}`;

  constructor(private elementRef: ElementRef) {}

  @HostListener('click')
  onClick() {
    if (!this.disabled) {
      this.toggle();
      this.onTouched();
    }
  }

  @HostListener('keydown.space', ['$event'])
  onSpace(event: Event) {
    event.preventDefault();
    this.onClick();
  }

  toggle() {
    if (!this.disabled) {
      this.value = !this.value;
      this.onChange(this.value);
    }
  }

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
