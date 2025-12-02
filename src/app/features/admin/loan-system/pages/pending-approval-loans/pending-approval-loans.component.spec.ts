import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingApprovalLoansComponent } from './pending-approval-loans.component';

describe('PendingApprovalLoansComponent', () => {
  let component: PendingApprovalLoansComponent;
  let fixture: ComponentFixture<PendingApprovalLoansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApprovalLoansComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingApprovalLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
