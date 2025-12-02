import {
  Component,
  inject,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../components/table/table.component';
import { TransactionService } from '../service/transaction.service';
import {
  Column,
  Paging,
  CommonResponseModel,
  PagingMaster,
} from '../../../../core/types/helper.model';
import { Observable } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { CustomTableService } from '../../../../core/services/table.service';
import { InputGroupComponent } from '../../../../components/input-group/input-group.component';
import { FormHelper } from '../../../../core/utils/form.helper';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { User } from '../../../../core/auth/store/auth.state';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    TextareaModule,
    InputGroupComponent,
    TooltipModule,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.css',
  providers: [MessageService],
})
export class TransactionListComponent implements OnInit {
  transactionService = inject(TransactionService);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  tableService = inject(CustomTableService);
  formHelper = inject(FormHelper);
  authService = inject(AuthService);

  revertDialogVisible = false;
  revertForm: FormGroup;
  verifiedTransaction: any = null;
  isVerifying = false;
  user: User | null = null;

  errorMessages = {
    required: 'This field is required',
  };

  constructor() {
    this.revertForm = this.fb.group({
      transactionNumber: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  transactionColumns: Column[] = [
    {
      field: 'transactionNumber',
      header: 'Transaction Number',
    },
    {
      field: 'transactionDate',
      header: 'Date & Time',
      cellRenderer: (data) => {
        if (data && data.transactionDate) {
          return new Date(data.transactionDate).toLocaleString();
        }
        return '';
      },
    },
    { field: 'accountNumber', header: 'Account No' },
    { field: 'transactionType', header: 'Type' },
    {
      field: 'amount',
      header: 'Amount',
      cellRenderer: (data) => {
        const color =
          data.transactionType === 'DEPOSIT'
            ? 'text-green-500'
            : 'text-red-500';
        const sign = data.transactionType === 'DEPOSIT' ? '+' : '-';
        return `<span class="${color}">${sign}$${data.amount}</span>`;
      },
    },
    { field: 'budgetCategory', header: 'Category' },
    { field: 'description', header: 'Description' },
    {
      field: 'transactionStatus',
      header: 'Status',
      cellRenderer: (data) =>
        `<span class="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-500">${data.transactionStatus}</span>`,
    },
  ];

  getTransactions = (
    paging: Paging,
    componentInstance: TransactionListComponent
  ): Observable<CommonResponseModel<PagingMaster<any>>> => {
    const params = {
      page: paging.page ?? 0,
      size: 10,
      sortBy: paging.sortBy ?? 'createdAt',
      sortDir: paging.sortDir ?? 'desc',
    };
    return componentInstance.transactionService.getAllTransactions(params);
  };

  openRevertDialog() {
    this.revertDialogVisible = true;
    this.verifiedTransaction = null;
    this.revertForm.reset();
  }

  getControl(controlName: string) {
    return this.formHelper.getFormControl(this.revertForm, controlName);
  }

  verifyTransaction() {
    const transactionNumberControl = this.revertForm.get('transactionNumber');
    if (transactionNumberControl?.valid) {
      this.isVerifying = true;
      const transactionNumber = transactionNumberControl.value;
      this.transactionService.verifyTransaction(transactionNumber).subscribe({
        next: (res) => {
          this.verifiedTransaction = res.data;
          this.isVerifying = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Verified',
            detail: 'Transaction verified successfully',
          });
        },
        error: (err) => {
          this.isVerifying = false;
          this.verifiedTransaction = null;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Transaction not found',
          });
        },
      });
    } else {
      transactionNumberControl?.markAsTouched();
    }
  }

  onRevert() {
    if (this.revertForm.valid && this.verifiedTransaction) {
      const { transactionNumber, reason } = this.revertForm.value;
      const userId = this.verifiedTransaction.userId;
      this.transactionService
        .revertTransaction(transactionNumber, userId, reason)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Transaction reverted successfully',
            });
            this.revertDialogVisible = false;
            this.tableService.setrefreshTable(true);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to revert transaction',
            });
          },
        });
    } else {
      this.revertForm.markAllAsTouched();
    }
  }
}
