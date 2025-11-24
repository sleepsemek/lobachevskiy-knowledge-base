import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqButtonComponent } from './fq-button.component';

describe('FqButton', () => {
  let component: FqButtonComponent;
  let fixture: ComponentFixture<FqButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
