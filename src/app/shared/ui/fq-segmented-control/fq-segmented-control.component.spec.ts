import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqSegmentedControlComponent } from './fq-segmented-control.component';

describe('FqSegmentedControlComponent', () => {
  let component: FqSegmentedControlComponent;
  let fixture: ComponentFixture<FqSegmentedControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqSegmentedControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqSegmentedControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
