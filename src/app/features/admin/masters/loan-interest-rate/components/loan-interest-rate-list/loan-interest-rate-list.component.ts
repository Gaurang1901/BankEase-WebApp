import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Column, Paging } from '../../../../../../core/types/helper.model';
import { MasterService } from '../../../services/master.service';
import { LoanInterestRateModel } from '../../models/loan-interest-rate.model';
import { TableComponent } from '../../../../../../components/table/table.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-loan-interest-rate-list',
  imports: [TableComponent, ButtonModule],
  templateUrl: './loan-interest-rate-list.component.html',
  styleUrl: './loan-interest-rate-list.component.css',
})
export class LoanInterestRateListComponent {
  columns: Column[] = [];
  paging: Paging = {
    page: 1,
    size: 10,
  };

  @ViewChild('actionTemplate') actionTemplate!: TemplateRef<any>;

  router = inject(Router);
  masterService = inject(MasterService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.columns = [
      {
        field: 'loanTypes',
        header: 'Loan Type',
      },
      {
        field: 'interestRate',
        header: 'Interest Rate',
      },
    ];
  }

  ngAfterViewInit(): void {
    this.columns.push({
      field: 'actions',
      header: 'Actions',
      cellTemplate: this.actionTemplate,
    });
  }

  getDataFunc(
    data: Paging,
    component: LoanInterestRateListComponent
  ): Observable<any> {
    return component.masterService.getAllLoanInterestRates(data);
  }

  onAddState() {
    this.router.navigate(['admin/loan-interest-rates-add']);
  }

  navigateToUpdate(data: LoanInterestRateModel) {
    this.router.navigate(['admin/loan-interest-rates-add'], {
      state: { data },
    });
  }

  deleteState(data: LoanInterestRateModel) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this state?',
      header: 'Delete State',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.masterService.deleteLoanInterestRate(data.id!).subscribe({
          next: () => {
            this.router.navigate(['admin/loan-interest-rates-list']);
          },
          error: (err) => {
            this.messageService.add({
              key: 'custom-toast',
              severity: 'error',
              summary: 'Error',
              detail: err.message,
            });
          },
        });
      },
      reject: () => {
        this.messageService.add({
          key: 'custom-toast',
          severity: 'info',
          summary: 'Info',
          detail: 'You have cancelled the action',
        });
      },
    });
  }
}
