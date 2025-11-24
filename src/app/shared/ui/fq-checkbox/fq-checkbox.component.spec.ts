import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqCheckboxComponent } from './fq-checkbox.component';

describe('FqCheckboxComponent', () => {
  let component: FqCheckboxComponent;
  let fixture: ComponentFixture<FqCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
