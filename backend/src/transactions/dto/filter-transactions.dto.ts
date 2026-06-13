import { IsOptional, IsDateString, IsEnum } from 'class-validator';

export enum TransactionType {
  CASH_IN = 'cash-in',
  CASH_OUT = 'cash-out',
}

export class FilterTransactionsDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;
}
