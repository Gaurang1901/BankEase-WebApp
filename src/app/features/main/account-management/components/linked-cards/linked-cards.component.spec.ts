import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedCardsComponent } from './linked-cards.component';

describe('LinkedCardsComponent', () => {
  let component: LinkedCardsComponent;
  let fixture: ComponentFixture<LinkedCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkedCardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkedCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
