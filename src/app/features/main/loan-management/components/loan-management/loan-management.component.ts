import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoanModel } from '../../models/loan.model';
import { LoanService } from '../../service/loan.service';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { MessageService } from 'primeng/api';
import { User } from '../../../../../core/auth/store/auth.state';
import { LoanItemComponent } from '../loan-item/loan-item.component';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { UpdateLoanDialogComponent } from '../update-loan-dialog/update-loan-dialog.component';
import { RequestLoanDialogComponent } from '../request-loan-dialog/request-loan-dialog.component';

@Component({
  selector: 'app-loan-management',
  imports: [
    CommonModule,
    LoanItemComponent,
    ButtonModule,
    PaginatorModule,
    ToastModule,
    UpdateLoanDialogComponent,
    RequestLoanDialogComponent,
  ],
  templateUrl: './loan-management.component.html',
  styleUrl: './loan-management.component.css',
})
export class LoanManagementComponent {
  private loanService = inject(LoanService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  // State using Signals
  loans = signal<LoanModel[]>([]);
  isLoading = signal<boolean>(true);
  currentPage = signal<number>(0);
  totalPages = signal<number>(0);
  totalElements = signal<number>(0);
  pageSize = signal<number>(10);
  user: User | null = null;

  // Update Dialog State
  isUpdateLoanDialogVisible: boolean = false;
  selectedLoan: LoanModel | null = null;

  // Request Loan Dialog State
  isRequestLoanDialogVisible: boolean = false;

  ngOnInit() {
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        if (user) {
          this.user = user;
          this.loadLoans(user.userId!, 0);
        }
      },
      error: (err) => {
        console.error('Failed to load user profile', err);
        this.isLoading.set(false);
      },
    });
  }

  loadLoans(userId: string, page: number) {
    this.isLoading.set(true);
    this.loanService
      .getLoansByUserId(userId, {
        page: page,
        size: this.pageSize(),
        sortBy: 'appliedDate',
        sortDir: 'desc',
      })
      .subscribe({
        next: (response) => {
          const loanModels: LoanModel[] = response.data.content.map((loan) => ({
            id: loan.id,
            userId: loan.userId,
            loanNumber: loan.loanNumber,
            loanType: loan.loanType,
            principalAmount: loan.principalAmount,
            interestRate: loan.interestRate,
            totalMonths: loan.totalMonths,
            emiAmount: loan.emiAmount,
            loanStatus: loan.loanStatus,
            applicationDate: loan.applicationDate,
            totalAmountPaid: loan.totalAmountPaid,
            approvedDate: loan.approvedDate,
          }));
          this.loans.set(loanModels);
          this.currentPage.set(response.data.number);
          this.totalPages.set(response.data.totalPages);
          this.totalElements.set(response.data.totalElements);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Failed to load loans', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load loans. Please try again.',
          });
          this.isLoading.set(false);
        },
      });
  }

  handleUpdateLoan(loan: LoanModel) {
    this.selectedLoan = loan;
    this.isUpdateLoanDialogVisible = true;
  }

  onUpdateLoanDialogClose($event: {
    visible: boolean;
    type: 'submit' | 'cancel';
  }) {
    if ($event.type === 'submit' && this.user) {
      this.loadLoans(this.user.userId!, this.currentPage());
    }
    this.isUpdateLoanDialogVisible = $event.visible;
    this.selectedLoan = null;
  }

  onPageChange(event: any) {
    if (this.user) {
      this.loadLoans(this.user.userId!, event.page);
    }
  }

  openApplyLoanDialog() {
    this.isRequestLoanDialogVisible = true;
  }

  onRequestLoanDialogClose($event: {
    visible: boolean;
    type: 'submit' | 'cancel';
  }) {
    if ($event.type === 'submit' && this.user) {
      this.loadLoans(this.user.userId!, this.currentPage());
    }
    this.isRequestLoanDialogVisible = $event.visible;
  }
}
