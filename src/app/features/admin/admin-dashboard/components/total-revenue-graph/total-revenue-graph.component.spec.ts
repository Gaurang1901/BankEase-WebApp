import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalRevenueGraphComponent } from './total-revenue-graph.component';

describe('TotalRevenueGraphComponent', () => {
  let component: TotalRevenueGraphComponent;
  let fixture: ComponentFixture<TotalRevenueGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalRevenueGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalRevenueGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
