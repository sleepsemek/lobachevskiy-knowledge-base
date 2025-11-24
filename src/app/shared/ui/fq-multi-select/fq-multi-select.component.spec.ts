import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqMultiSelect } from './fq-multi-select.component';

describe('FqMultiSelect', () => {
  let component: FqMultiSelect;
  let fixture: ComponentFixture<FqMultiSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqMultiSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqMultiSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
