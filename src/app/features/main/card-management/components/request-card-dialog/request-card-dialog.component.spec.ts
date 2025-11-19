import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCardDialogComponent } from './request-card-dialog.component';

describe('RequestCardDialogComponent', () => {
  let component: RequestCardDialogComponent;
  let fixture: ComponentFixture<RequestCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestCardDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
