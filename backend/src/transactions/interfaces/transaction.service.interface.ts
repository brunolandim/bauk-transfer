import { Transaction } from '../transaction.entity';
import { TransferDto } from '../dto/transfer.dto';
import { FilterTransactionsDto } from '../dto/filter-transactions.dto';

export interface ITransactionService {
  transfer(senderAccountId: string, dto: TransferDto): Promise<void>;
  getTransactions(accountId: string, filters: FilterTransactionsDto): Promise<Transaction[]>;
}

export const ITransactionService = Symbol('ITransactionService');
