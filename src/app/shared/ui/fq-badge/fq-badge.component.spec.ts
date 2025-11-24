import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqBadgeComponent } from './fq-badge.component';

describe('FqBadgeComponent', () => {
  let component: FqBadgeComponent;
  let fixture: ComponentFixture<FqBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
