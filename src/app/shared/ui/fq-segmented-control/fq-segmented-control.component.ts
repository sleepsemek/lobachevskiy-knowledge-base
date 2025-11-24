import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {ComponentSize} from '../component-size';

export interface SegmentedControlOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-segmented-control',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'fq-segmented-control.component.html',
  styleUrl: 'fq-segmented-control.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentedControlComponent),
      multi: true
    }
  ]
})
export class SegmentedControlComponent implements ControlValueAccessor {
  @Input() options: SegmentedControlOption[] = [];
  @Input() name: string = 'segmented-control';
  @Input() value: string = '';
  @Input() size: ComponentSize = 'medium';

  @Output() valueChange = new EventEmitter<string>();

  private onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  onOptionChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.valueChange.emit(value);
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  get segmentedControlClasses(): string {
    return [
      'segmented-control',
      `btn--${this.size}`,
    ].join(' ').trim();
  }
}
