export type CardType = 'DEBIT' | 'CREDIT';
export type CardStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED' | 'INACTIVE';

export interface CardModel {
  id: string;
  type: CardType;
  cardNumber: string;
  expiry: string; // MM/YY
  cvv: string;
  holderName: string;
  status: CardStatus;
  creditLimit?: number;
  themeColor: 'blue' | 'orange';
}

export interface CardResponseModel {
  id: string;
  maskedCardNumber: string;
  last4: string;
  cardHolderName: string;
  cardType: string;
  status: string;
  expiryDate: string;
  accountId: string;
  userId: string;
}
