import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInterestRateListComponent } from './loan-interest-rate-list.component';

describe('LoanInterestRateListComponent', () => {
  let component: LoanInterestRateListComponent;
  let fixture: ComponentFixture<LoanInterestRateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanInterestRateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanInterestRateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
