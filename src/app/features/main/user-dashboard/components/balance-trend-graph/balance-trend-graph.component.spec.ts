import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceTrendGraphComponent } from './balance-trend-graph.component';

describe('BalanceTrendGraphComponent', () => {
  let component: BalanceTrendGraphComponent;
  let fixture: ComponentFixture<BalanceTrendGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceTrendGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceTrendGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
