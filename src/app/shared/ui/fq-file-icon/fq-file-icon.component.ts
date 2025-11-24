import { Component, Input, OnInit, OnChanges } from '@angular/core';
import {NgStyle} from '@angular/common';
import {sanitizedExtension} from '../../utils/sanitizedExtension';

@Component({
  selector: 'fq-file-icon',
  imports: [
    NgStyle
  ],
  templateUrl: './fq-file-icon.component.html',
  styleUrl: './fq-file-icon.component.scss',
})
export class FqFileIconComponent implements OnInit, OnChanges {
  @Input() width: number = 2;
  @Input() extension: string = 'txt';

  backgroundColor: string = '';
  iconColor: string = '';

  ngOnInit() {
    this.generateColors();
  }

  ngOnChanges() {
    this.generateColors();
  }

  private generateColors() {
    const sanitizedExt = sanitizedExtension(this.extension);

    let hash = 0;
    for (let i = 0; i < sanitizedExt.length; i++) {
      hash = sanitizedExt.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const saturation = 40 + (Math.abs(hash) % 30);
    const lightness = 70 + (Math.abs(hash) % 15);

    this.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    const bgLightness = lightness > 75 ? lightness - 20 : lightness + 15;
    this.iconColor = `hsl(${hue}, ${saturation}%, ${bgLightness}%)`;
  }

  get styles() {
    return {
      'background-color': this.backgroundColor,
      'color': this.iconColor
    };
  }

  protected readonly sanitizedExtension = sanitizedExtension;
}
