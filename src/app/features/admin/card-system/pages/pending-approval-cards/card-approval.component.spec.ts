import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PendingApprovalCardComponent } from './card-approval.component';

describe('PendingApprovalCardComponent', () => {
  let component: PendingApprovalCardComponent;
  let fixture: ComponentFixture<PendingApprovalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingApprovalCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PendingApprovalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
