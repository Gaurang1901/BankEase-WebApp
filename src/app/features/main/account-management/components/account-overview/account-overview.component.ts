import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

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
  AccountSummary,
} from '../../models/account.model';
import { AccountService } from '../../service/account.service';
import { PageHeaderService } from '../../../../../core/services/page-header.service';
import { CloseAccountDialogComponent } from '../close-account-dialog/close-account-dialog.component';
import { StatementDownloadDialogComponent } from '../statement-download-dialog/statement-download-dialog.component';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { CommonResponseModel } from '../../../../../core/types/helper.model';
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
    StatementDownloadDialogComponent,
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
  private authService = inject(AuthService);

  isCloseDialogVisible = false;
  isStatementDialogVisible = false;
  account$!: Observable<CommonResponseModel<AccountSummary> | null>;
  accountDetailsItems$!: Observable<DetailListItem[]>;
  accountHolderItems$!: Observable<DetailListItem[]>;

  ngOnInit(): void {
    this.pageHeaderService.setTitle('Account Overview');
    this.pageHeaderService.setBreadcrumb([{ label: 'Account Overview' }]);

    // Use switchMap to map the user profile Observable to the account overview Observable
    this.account$ = this.authService.getUserProfile().pipe(
      take(1),
      switchMap((user) =>
        user
          ? this.accountService.getAccountOverview(user.accountId!)
          : of(null)
      )
    );

    this.accountDetailsItems$ = this.account$.pipe(
      map((acc) => (acc ? this.transformAccountDetails(acc.data) : []))
    );
    this.accountHolderItems$ = this.account$.pipe(
      map((acc) => (acc ? this.transformAccountHolder(acc.data) : []))
    );
  }

  private transformAccountDetails(details: AccountSummary): DetailListItem[] {
    return [
      { label: 'Account Number', value: details.accountNumber },
      { label: 'Account Type', value: details.accountTypes },
      { label: 'Status', value: details.accountStatus, type: 'tag' },
      {
        label: 'Opened On',
        value: this.datePipe.transform(details.createdAt, 'longDate')!,
      },
      { label: 'Currency', value: 'INR' },
      { label: 'Branch Code', value: '123' },
    ];
  }

  private transformAccountHolder(holder: AccountSummary): DetailListItem[] {
    return [
      { label: 'Full Name', value: holder.user.name },
      { label: 'Email', value: holder.user.email },
      { label: 'Phone', value: holder.user.phoneNo },
      { label: 'Address', value: holder.user.address.addressLine1 },
      { label: 'City', value: holder.user.address.city },
      {
        label: 'Date of Birth',
        value: this.datePipe.transform(holder.user.dateOfBirth, 'dd/MM/yyyy')!,
      },
    ];
  }

  showCloseDialog(): void {
    this.isCloseDialogVisible = true;
  }

  handleAccountClose(payload: CloseAccountPayload, accountId: string): void {
    this.accountService.closeAccount(accountId, payload).subscribe({
      next: (response) => {
        if (response) {
          this.messageService.add({
            key: 'custom-toast',
            severity: 'success',
            summary: 'Success',
            detail: 'Account closed successfully',
          });
          window.location.reload();
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

  showStatementDialog(): void {
    this.isStatementDialogVisible = true;
  }

  handleStatementDownload(
    event: { startDate: Date; endDate: Date },
    accountId: string
  ): void {
    this.authService
      .getUserProfile()
      .pipe(take(1))
      .subscribe((user) => {
        if (user) {
          const payload = {
            accountId: user.accountId,
            startDate: event.startDate.toISOString(),
            endDate: event.endDate.toISOString(),
            userId: user.userId,
          };

          this.accountService.downloadStatement(payload).subscribe({
            next: (blob) => {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              const filename = `Custom-${event.startDate
                .toISOString()
                .slice(0, 10)}_to_${event.endDate
                .toISOString()
                .slice(0, 10)}.pdf`;
              link.download = filename;
              link.click();
              window.URL.revokeObjectURL(url);
              this.messageService.add({
                key: 'custom-toast',
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
      });
  }
}
