import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTransactionsComponentComponent } from './card-transactions-component.component';

describe('CardTransactionsComponentComponent', () => {
  let component: CardTransactionsComponentComponent;
  let fixture: ComponentFixture<CardTransactionsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTransactionsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardTransactionsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
