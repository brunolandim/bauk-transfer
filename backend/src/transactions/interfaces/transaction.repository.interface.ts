import { EntityManager } from 'typeorm';
import { Transaction } from '../transaction.entity';
import { FilterTransactionsDto } from '../dto/filter-transactions.dto';

export interface ITransactionRepository {
  create(
    debitedAccountId: string,
    creditedAccountId: string,
    value: number,
    manager: EntityManager,
  ): Promise<Transaction>;

  findByAccountId(accountId: string, filters: FilterTransactionsDto): Promise<Transaction[]>;
}

export const ITransactionRepository = Symbol('ITransactionRepository');
