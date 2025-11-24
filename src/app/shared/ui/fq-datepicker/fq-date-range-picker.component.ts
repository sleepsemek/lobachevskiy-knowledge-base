import {Component, forwardRef, Input, ViewEncapsulation} from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import {FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'fq-datepicker',
  imports: [DatePickerModule, FormsModule],
  templateUrl: './fq-date-range-picker.component.html',
  styleUrl: './fq-date-range-picker.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FqDateRangePickerComponent),
      multi: true,
    },
  ],
})
export class FqDateRangePickerComponent implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() selectionMode: 'single' | 'range' | 'multiple' = 'range';
  @Input() readonlyInput = false;

  value: any;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  onChangeHandler(value: any) {
    this.value = value;
    this.onChange(value);
  }
}
