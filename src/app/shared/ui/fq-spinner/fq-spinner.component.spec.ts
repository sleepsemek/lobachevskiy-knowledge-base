import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqSpinnerComponent } from './fq-spinner.component';

describe('FqSpinnerComponent', () => {
  let component: FqSpinnerComponent;
  let fixture: ComponentFixture<FqSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqSpinnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
