import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanInterestRateCreateComponent } from './loan-interest-rate-create.component';

describe('LoanInterestRateCreateComponent', () => {
  let component: LoanInterestRateCreateComponent;
  let fixture: ComponentFixture<LoanInterestRateCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanInterestRateCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoanInterestRateCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
