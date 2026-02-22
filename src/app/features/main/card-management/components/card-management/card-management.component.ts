import { Component, inject, signal } from '@angular/core';
import { CardModel, CardStatus } from '../../models/card.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardService } from '../../service/card.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardItemComponent } from '../card-item/card-item.component';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { User } from '../../../../../core/auth/store/auth.state';
import { RequestCardDialogComponent } from '../request-card-dialog/request-card-dialog.component';
import { CardTransactionsComponentComponent } from '../card-transactions-component/card-transactions-component.component';
import { IdempotencyService } from '../../../../../core/auth/services/idempotency.service';

@Component({
  selector: 'app-card-management',
  imports: [
    CommonModule,
    CardItemComponent,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    RequestCardDialogComponent,
    CardTransactionsComponentComponent,
  ],
  templateUrl: './card-management.component.html',
  styleUrl: './card-management.component.css',
})
export class CardManagementComponent {
  isRequestCardTransactionDialogVisible: boolean = false;
  onRequestCardTransactionDialogClose($event: any) {
    this.isRequestCardTransactionDialogVisible = $event;
  }
  openRequestCardDialog() {
    this.isRequestCardDialogVisible = true;
  }
  private cardService = inject(CardService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private idempotencyService = inject(IdempotencyService);

  // State using Signals
  cards = signal<CardModel[]>([]);
  isLoading = signal<boolean>(true);
  user: User | null = null;
  isRequestCardDialogVisible: boolean = false;
  selectedCardId: string | null = null;

  ngOnInit() {
    this.authService.getUserProfile().subscribe((user) => {
      if (user) {
        this.user = user;
        this.loadCards(user.accountId!);
      }
    });
  }

  loadCards(accountId: string) {
    this.isLoading.set(true);
    this.cardService.getCards(accountId).subscribe({
      next: (data) => {
        const cardModel: CardModel[] = [];
        data.data.map((card) => {
          cardModel.push({
            id: card.id,
            type: card.cardType === 'DEBIT' ? 'DEBIT' : 'CREDIT',
            cardNumber: card.maskedCardNumber,
            expiry: card.expiryDate,
            cvv: '***',
            holderName: card.cardHolderName,
            status: card.status as CardStatus,
            creditLimit: card.cardType === 'CREDIT' ? 100 : undefined,
            themeColor: card.cardType === 'DEBIT' ? 'blue' : 'orange',
          });
        });
        this.cards.set(cardModel);
        console.log(this.cards());

        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  confirmBlock(card: CardModel) {
    this.confirmationService.confirm({
      header: 'Block Card?',
      message: `Are you sure you want to block your ${
        card.type
      } card ending in ${card.cardNumber.slice(
        -4,
      )}? This action allows you to temporarily freeze activity.`,
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: 'pi pi-lock',
      rejectIcon: 'pi pi-times',
      acceptLabel: 'Yes, Block it',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: '!bg-red-600 !border-red-600 !text-white',
      rejectButtonStyleClass: '!text-gray-300 !bg-transparent !border-gray-600',
      accept: () => {
        this.handleBlockAction(card.id);
      },
    });
  }

  private handleBlockAction(cardId: string) {
    this.idempotencyService.generateKey().subscribe((key) => {
      this.cardService
        .blockCard(cardId, this.user?.userId!, key)
        .subscribe(() => {
          this.messageService.add({
            key: 'custom-toast',
            severity: 'success',
            summary: 'Card Blocked',
            detail: 'Your card has been successfully blocked.',
          });

          // Update local state to reflect change
          this.cards.update((cards) =>
            cards.map((c) =>
              c.id === cardId ? { ...c, status: 'BLOCKED' } : c,
            ),
          );
        });
    });
  }

  viewTransactions(card: CardModel) {
    this.messageService.add({
      severity: 'info',
      summary: 'Navigating',
      detail: `Viewing transactions for card ending in ${card.cardNumber.slice(
        -4,
      )}`,
    });
    this.isRequestCardTransactionDialogVisible = true;
    this.selectedCardId = card.id;
  }

  onRequestCardDialogClose($event: {
    visible: boolean;
    type: 'submit' | 'cancel';
  }) {
    if ($event.type === 'submit') {
      this.loadCards(this.user!.accountId!);
    }
    this.isRequestCardDialogVisible = $event.visible;
  }
}
