export interface TransactionResponseDto {
  id: string;
  debitedAccountId: string;
  creditedAccountId: string;
  value: number;
  createdAt: Date;
  debitedUsername: string;
  creditedUsername: string;
}
