import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'underscore'
})
export class UnderscorePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';
    return value.replace(/_/g, ' ');
  }
}
