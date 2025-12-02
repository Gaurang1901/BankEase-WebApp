export interface CardModel {
  id: string;
  maskedCardNumber: string;
  last4: string;
  cardHolderName: string;
  cardType: string;
  status: string;
  expiryDate: string | Date;
  accountId: string;
  userId: string;
  userFullName: string;
}
