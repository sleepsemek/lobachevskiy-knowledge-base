import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqInputComponent } from './fq-input.component';

describe('FqInputComponent', () => {
  let component: FqInputComponent;
  let fixture: ComponentFixture<FqInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
