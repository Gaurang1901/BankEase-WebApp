import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { TableComponent } from '../../../../../components/table/table.component';
import { Column, Paging } from '../../../../../core/types/helper.model';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { CardModel } from '../../model/card.model';
import { CardService } from '../../service/card.service';
import { AuthStore } from '../../../../../core/auth/store/auth.store';
import { User } from '../../../../../core/auth/store/auth.state';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { CustomTableService } from '../../../../../core/services/table.service';

@Component({
  selector: 'app-pending-approval-cards',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './card-approval.component.html',
  styleUrl: './card-approval.component.css',
  providers: [DatePipe, CurrencyPipe, DialogService, MessageService],
})
export class PendingApprovalCardComponent {
  loanService = inject(CardService);
  authService = inject(AuthService);
  dialogService = inject(DialogService);
  messageService = inject(MessageService);
  tableService = inject(CustomTableService);
  datePipe = inject(DatePipe);
  currencyPipe = inject(CurrencyPipe);
  router = inject(Router);

  @ViewChild('actionTemplate', { static: true })
  actionTemplate!: TemplateRef<any>;

  user: User | null = null;

  columns: Column[] = [
    { field: 'maskedCardNumber', header: 'Card Number' },
    { field: 'cardType', header: 'Card Type' },
    { field: 'status', header: 'Status' },
    { field: 'accountNumber', header: 'Account Number' },
    {
      field: 'cardHolderName',
      header: 'Card Holder Name',
    },
  ];

  getPendingLoans = (paging: Paging) =>
    this.loanService.getLoans(paging, 'PENDING');

  handleAction(row: CardModel, action: string) {
    if (action === 'APPROVE') {
      this.updateStatus(row.id, 'ACTIVE');
    } else if (action === 'REJECT') {
      this.updateStatus(row.id, 'CANCELLED');
    } else if (action === 'VIEW') {
      this.openDetails(row);
    }
  }

  ngAfterViewInit() {
    this.authService.getUserProfile().subscribe((res) => {
      this.user = res;
    });
    this.columns.push({
      field: 'actions',
      header: 'Actions',
      cellTemplate: this.actionTemplate,
    });
  }

  updateStatus(id: string, status: string) {
    this.loanService
      .updateCardStatus(id, status, this.user?.userId!)
      .subscribe({
        next: () => {
          this.messageService.add({
            key: 'custom-toast',
            severity: 'success',
            summary: 'Success',
            detail: `Card ${status.toLowerCase()} successfully`,
          });
          this.tableService.setrefreshTable(true);
          this.tableService.setrefreshTable(false);
        },
        error: (err) => {
          this.messageService.add({
            key: 'custom-toast',
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update card status',
          });
        },
      });
  }

  openDetails(loan: CardModel) {
    this.router.navigate(['/admin/loans/details', loan.id]);
  }
}
