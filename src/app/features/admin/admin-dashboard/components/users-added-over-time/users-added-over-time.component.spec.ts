import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAddedOverTimeComponent } from './users-added-over-time.component';

describe('UsersAddedOverTimeComponent', () => {
  let component: UsersAddedOverTimeComponent;
  let fixture: ComponentFixture<UsersAddedOverTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersAddedOverTimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersAddedOverTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
