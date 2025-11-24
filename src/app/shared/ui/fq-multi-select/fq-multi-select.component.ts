import {
  Component,
  forwardRef,
  Input,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'fq-multi-select',
  imports: [MultiSelect, FormsModule, NgTemplateOutlet],
  templateUrl: './fq-multi-select.component.html',
  styleUrl: './fq-multi-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FqMultiSelect),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class FqMultiSelect implements ControlValueAccessor {
  @Input() placeholder = '';
  @Input() iconTpl?: TemplateRef<any>;
  @Input() options: any[] = [];
  @Input() optionLabel: string = 'label';

  selectedValues: any[] = [];
  disabled = false;

  private onChange = (value: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    this.selectedValues = value ?? [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleSelectionChange(value: any) {
    this.selectedValues = value;
    this.onChange(value);
    this.onTouched();
  }
}
