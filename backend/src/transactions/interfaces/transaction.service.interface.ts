import { TransferDto } from '../dto/transfer.dto';
import { FilterTransactionsDto } from '../dto/filter-transactions.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

export interface ITransactionService {
  transfer(senderAccountId: string, dto: TransferDto): Promise<void>;
  getTransactions(accountId: string, filters: FilterTransactionsDto): Promise<TransactionResponseDto[]>;
}

export const ITransactionService = Symbol('ITransactionService');
