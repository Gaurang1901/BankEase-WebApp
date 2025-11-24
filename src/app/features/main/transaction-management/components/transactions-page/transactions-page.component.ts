import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  TransactionSummary,
  TransactionType,
} from '../../models/transaction.model';
import {
  TransactionDialogComponent,
  TransactionSubmitEvent,
} from '../../components/transaction-dialog/transaction-dialog.component';
import { TransactionService } from '../../service/transaction.service';
import { PageHeaderService } from '../../../../../core/services/page-header.service';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { TransactionTableComponent } from '../transaction-table/transaction-table.component';
import { CommonResponseModel } from '../../../../../core/types/helper.model';
import { User } from '../../../../../core/auth/store/auth.state';

@Component({
  selector: 'app-transactions-page',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    ToastModule,
    TransactionDialogComponent,
    TransactionTableComponent,
  ],
  providers: [MessageService],
  templateUrl: './transactions-page.component.html',
})
export class TransactionsPageComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private pageHeaderService = inject(PageHeaderService);

  summary$!: Observable<CommonResponseModel<TransactionSummary>>;
  private accountId!: string;
  user: User | null = null;

  isDialogVisible = false;
  currentTransactionType!: TransactionType;

  ngOnInit(): void {
    this.pageHeaderService.setTitle('Transactions');
    this.pageHeaderService.setBreadcrumb([{ label: 'Transactions' }]);

    this.authService.getUserProfile().subscribe((user) => {
      if (user) {
        this.accountId = user.userId!;
        this.user = user;
        this.summary$ = this.transactionService.getTransactionSummary(
          this.user?.accountId!
        );
      }
    });
    this.accountId =
      this.route.snapshot.parent?.paramMap.get('id') ?? 'default-account';
  }

  openTransactionDialog(type: TransactionType): void {
    this.currentTransactionType = type;
    this.isDialogVisible = true;
  }

  handleTransactionSubmit(event: TransactionSubmitEvent): void {
    const { payload, idempotencyKey } = event;

    this.transactionService
      .executeTransaction(this.accountId, idempotencyKey, payload)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `${this.currentTransactionType} completed successfully!`,
          });
          // Refresh summary data after a successful transaction
          this.summary$ = this.transactionService.getTransactionSummary(
            this.accountId
          );
          this.isDialogVisible = false;
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to process ${this.currentTransactionType}. Please try again.`,
          });
          // Keep the dialog open for the user to retry
        },
      });
  }
}
