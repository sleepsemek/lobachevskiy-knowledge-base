import {
  Component,
  forwardRef,
  Input,
  TemplateRef,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  OnInit
} from '@angular/core';
import { Select } from 'primeng/select';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';

export interface SelectOption {
  id: number | string;
  name: string;
}

@Component({
  selector: 'fq-select',
  standalone: true,
  imports: [Select, FormsModule, NgTemplateOutlet],
  templateUrl: './fq-select.component.html',
  styleUrls: ['./fq-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FqSelect),
      multi: true,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class FqSelect implements ControlValueAccessor, OnChanges, OnInit {
  @Input() placeholder = '';
  @Input() iconTpl?: TemplateRef<any>;
  @Input() options: SelectOption[] = [];
  @Input() label = '';
  @Input() required = false;
  @Input() setDefaultFirst = false;
  @Input() size: 'default' | 'large' = 'default';

  selectedOption: SelectOption | null = null;
  disabled = false;

  private propagateChange = (value: any) => {};
  private propagateTouched = () => {};

  ngOnInit(): void {
    this.setDefaultOption();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      this.setDefaultOption();

      if (this.selectedOption) {
        const updatedOption = this.options.find(o => o.id === this.selectedOption?.id) || null;
        this.selectedOption = updatedOption;
      }
    }

    if (changes['setDefaultFirst'] && this.setDefaultFirst) {
      this.setDefaultOption();
    }
  }

  private setDefaultOption(): void {
    if (this.setDefaultFirst && this.options.length > 0 && !this.selectedOption) {
      this.selectedOption = this.options[0];
      this.propagateChange(this.selectedOption.id);
    }
  }

  writeValue(value: number | string | null): void {
    if (value === null || value === undefined) {
      this.selectedOption = null;
      return;
    }

    const found = this.options.find(o => o.id === value) || null;
    this.selectedOption = found;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleSelectionChange(option: SelectOption | null): void {
    this.selectedOption = option;

    const emittedValue = option ? option.id : null;
    this.propagateChange(emittedValue);
    this.propagateTouched();
  }
}
