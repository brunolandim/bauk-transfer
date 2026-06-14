import { EntityManager } from 'typeorm';
import { Transaction } from '../transaction.entity';
import { FilterTransactionsDto } from '../dto/filter-transactions.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

export interface ITransactionRepository {
  create(
    debitedAccountId: string,
    creditedAccountId: string,
    value: number,
    manager: EntityManager,
  ): Promise<Transaction>;

  findByAccountId(accountId: string, filters: FilterTransactionsDto): Promise<TransactionResponseDto[]>;
}

export const ITransactionRepository = Symbol('ITransactionRepository');
