import {
  Component,
  inject,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../../components/table/table.component';
import { AccountService } from '../service/account.service';
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
import { DropdownModule } from 'primeng/dropdown';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import { CustomTableService } from '../../../../core/services/table.service';
import { InputGroupComponent } from '../../../../components/input-group/input-group.component';
import { FormHelper } from '../../../../core/utils/form.helper';
import { StatementDownloadDialogComponent } from '../../../main/account-management/components/statement-download-dialog/statement-download-dialog.component';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    DropdownModule,
    TextareaModule,
    InputGroupComponent,
    StatementDownloadDialogComponent,
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.css',
  providers: [MessageService],
})
export class AccountListComponent implements OnInit {
  accountService = inject(AccountService);
  fb = inject(FormBuilder);
  messageService = inject(MessageService);
  tableService = inject(CustomTableService);
  formHelper = inject(FormHelper);

  visible = false;
  statusForm: FormGroup;
  isStatementDialogVisible = false;
  selectedAccount: any;
  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Frozen', value: 'FROZEN' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  errorMessages = {
    required: 'This field is required',
  };

  constructor() {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.accountColumns.find((col) => col.field === 'actions')!.cellTemplate =
      this.actionTemplate;
  }

  accountColumns: Column[] = [
    { field: 'accountNumber', header: 'Account No' },
    { field: 'user', header: 'Customer Name' },
    { field: 'accountTypes', header: 'Account Type' },
    {
      field: 'balance',
      header: 'Balance',
      cellRenderer: (data) => `${data.balance}`,
    },
    {
      field: 'accountStatus',
      header: 'Status',
      cellRenderer: (data) =>
        `<span class="px-2 py-1 rounded text-xs font-bold ${this.getStatusClass(
          data.accountStatus
        )}">${data.accountStatus}</span>`,
    },
    {
      field: 'createdAt',
      header: 'Created Date',
      cellRenderer: (data) => {
        if (data) {
          return new Date(data.createdAt).toLocaleDateString();
        } else {
          return '';
        }
      },
    },
    {
      field: 'actions',
      header: 'Actions',
    },
  ];

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return 'bg-green-500/20 text-green-500';
      case 'FROZEN':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'CLOSED':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  }

  getAccounts = (
    paging: Paging,
    componentInstance: AccountListComponent
  ): Observable<CommonResponseModel<PagingMaster<any>>> => {
    const params = {
      page: paging.page ?? 0,
      size: 10,
      sortBy: paging.sortBy ?? 'createdAt',
      sortDir: paging.sortDir ?? 'desc',
    };
    return componentInstance.accountService.getAccounts(params);
  };

  openStatusDialog(account: any) {
    this.selectedAccount = account;
    this.statusForm.patchValue({
      status: account.status,
      reason: '',
    });
    this.visible = true;
  }

  getControl(controlName: string) {
    return this.formHelper.getFormControl(this.statusForm, controlName);
  }

  onSubmit() {
    if (this.statusForm.valid && this.selectedAccount) {
      const { status, reason } = this.statusForm.value;
      this.accountService
        .updateAccountStatus(this.selectedAccount.accountNumber, status, reason)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Account status updated successfully',
            });
            this.visible = false;
            this.tableService.setrefreshTable(true);
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Failed to update status',
            });
          },
        });
    } else {
      this.statusForm.markAllAsTouched();
    }
  }
  openStatementDialog(account: any) {
    this.selectedAccount = account;
    this.isStatementDialogVisible = true;
  }

  handleStatementDownload(
    event: { startDate: Date; endDate: Date },
    accountId: string
  ): void {
    const payload = {
      accountId: accountId,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      userId: this.selectedAccount.userId,
    };

    this.accountService.downloadStatement(payload).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const filename = `Statement-${
          this.selectedAccount.accountNumber
        }-${event.startDate.toISOString().slice(0, 10)}_to_${event.endDate
          .toISOString()
          .slice(0, 10)}.pdf`;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Statement downloaded successfully',
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to download statement',
        });
      },
    });
  }
}
