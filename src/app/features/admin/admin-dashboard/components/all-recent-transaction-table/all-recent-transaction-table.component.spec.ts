import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRecentTransactionTableComponent } from './all-recent-transaction-table.component';

describe('RecentTransactionTableComponent', () => {
  let component: AllRecentTransactionTableComponent;
  let fixture: ComponentFixture<AllRecentTransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRecentTransactionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AllRecentTransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
