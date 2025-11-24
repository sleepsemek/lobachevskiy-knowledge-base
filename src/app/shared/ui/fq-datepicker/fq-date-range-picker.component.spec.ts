import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqDateRangePickerComponent } from './fq-date-range-picker.component';

describe('FqDatepickerComponent', () => {
  let component: FqDateRangePickerComponent;
  let fixture: ComponentFixture<FqDateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqDateRangePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
