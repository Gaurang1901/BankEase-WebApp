import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActiveLoan } from '../../models/account.model';

@Component({
  selector: 'app-active-loans',
  imports: [CommonModule],
  templateUrl: './active-loans.component.html',
  styleUrl: './active-loans.component.css',
})
export class ActiveLoansComponent {
  @Input({ required: true }) loans: ActiveLoan[] = [];
}
