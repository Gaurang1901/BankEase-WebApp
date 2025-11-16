import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ActiveLoansComponent } from '../active-loans/active-loans.component';
import { DetailListComponent } from '../detail-list/detail-list.component';
import { LinkedCardsComponent } from '../linked-cards/linked-cards.component';
import {
  Account,
  DetailListItem,
  AccountDetails,
  AccountHolder,
  CloseAccountPayload,
} from '../../models/account.model';
import { AccountService } from '../../service/account.service';
import { PageHeaderService } from '../../../../../core/services/page-header.service';
import { CloseAccountDialogComponent } from '../close-account-dialog/close-account-dialog.component';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-account-overview',
  imports: [
    CommonModule,
    CurrencyPipe,
    ButtonModule,
    TagModule,
    DetailListComponent,
    LinkedCardsComponent,
    ActiveLoansComponent,
    CloseAccountDialogComponent,
  ],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: './account-overview.component.html',
  styleUrl: './account-overview.component.css',
})
export class AccountOverviewComponent {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private datePipe = inject(DatePipe);
  private pageHeaderService = inject(PageHeaderService);
  private messageService = inject(MessageService);

  isCloseDialogVisible = false;
  account$!: Observable<Account>;
  accountDetailsItems$!: Observable<DetailListItem[]>;
  accountHolderItems$!: Observable<DetailListItem[]>;

  ngOnInit(): void {
    this.pageHeaderService.setTitle('Account Overview');
    this.pageHeaderService.setBreadcrumb([{ label: 'Account Overview' }]);
    this.account$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const accountId = params.get('id')!;
        return this.accountService.getAccountOverview(accountId);
      })
    );

    this.accountDetailsItems$ = this.account$.pipe(
      map((acc) => this.transformAccountDetails(acc.details))
    );
    this.accountHolderItems$ = this.account$.pipe(
      map((acc) => this.transformAccountHolder(acc.holder))
    );
  }

  private transformAccountDetails(details: AccountDetails): DetailListItem[] {
    return [
      { label: 'Account Number', value: details.accountNumber },
      { label: 'Account Type', value: details.accountType },
      { label: 'Status', value: details.status, type: 'tag' },
      {
        label: 'Opened On',
        value: this.datePipe.transform(details.openedOn, 'longDate')!,
      },
      { label: 'Currency', value: details.currency },
      { label: 'Branch Code', value: details.branchCode },
    ];
  }

  private transformAccountHolder(holder: AccountHolder): DetailListItem[] {
    return [
      { label: 'Full Name', value: holder.fullName },
      { label: 'Email', value: holder.email },
      { label: 'Phone', value: holder.phone },
      { label: 'Address', value: holder.address },
      { label: 'City', value: holder.city },
      {
        label: 'Date of Birth',
        value: this.datePipe.transform(holder.dateOfBirth, 'dd/MM/yyyy')!,
      },
    ];
  }

  showCloseDialog(): void {
    this.isCloseDialogVisible = true;
  }

  handleAccountClose(payload: CloseAccountPayload, accountId: string): void {
    this.accountService.closeAccount(accountId, payload).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Account closed successfully',
          });
          // Optionally, navigate the user away from this page
          // this.router.navigate(['/accounts']);
        }
        this.isCloseDialogVisible = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to close account. Please try again.',
        });
        this.isCloseDialogVisible = false; // Keep dialog open or close it based on UX preference
      },
    });
  }
}
