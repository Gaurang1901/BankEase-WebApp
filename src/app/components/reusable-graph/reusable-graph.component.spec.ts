import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableGraphComponent } from './reusable-graph.component';

describe('ReusableGraphComponent', () => {
  let component: ReusableGraphComponent;
  let fixture: ComponentFixture<ReusableGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
