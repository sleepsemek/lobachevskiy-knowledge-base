import {Component, Input} from '@angular/core';

@Component({
  selector: 'fq-spinner',
  imports: [],
  templateUrl: './fq-spinner.component.html',
  styleUrl: './fq-spinner.component.scss',
})
export class FqSpinnerComponent {
  @Input() className: string = '';
}
