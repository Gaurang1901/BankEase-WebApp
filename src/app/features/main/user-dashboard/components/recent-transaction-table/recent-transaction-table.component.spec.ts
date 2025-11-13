import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentTransactionTableComponent } from './recent-transaction-table.component';

describe('RecentTransactionTableComponent', () => {
  let component: RecentTransactionTableComponent;
  let fixture: ComponentFixture<RecentTransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentTransactionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentTransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
