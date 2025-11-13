import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableDateRangePickerComponent } from './reusable-date-range-picker.component';

describe('ReusableDateRangePickerComponent', () => {
  let component: ReusableDateRangePickerComponent;
  let fixture: ComponentFixture<ReusableDateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableDateRangePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
