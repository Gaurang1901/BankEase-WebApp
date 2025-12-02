import { Component, inject, OnInit } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  Location,
} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LoanService } from '../../service/loan.service';
import { LoanDetailModel } from '../../models/loan.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    CardModule,
    TagModule,
    SkeletonModule,
  ],
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.css',
  providers: [DatePipe, CurrencyPipe],
})
export class LoanDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private loanService = inject(LoanService);

  loanId: string | null = null;
  loanDetails: LoanDetailModel | null = null;
  loading = true;

  ngOnInit() {
    this.loanId = this.route.snapshot.paramMap.get('id');
    if (this.loanId) {
      this.loadDetails(this.loanId);
    }
  }

  loadDetails(id: string) {
    this.loading = true;
    this.loanService.getLoanDetails(id).subscribe({
      next: (data) => {
        this.loanDetails = data.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching loan details', err);
        this.loading = false;
      },
    });
  }

  goBack() {
    this.location.back();
  }

  getSeverity(
    status: string
  ):
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      case 'CLOSED':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
