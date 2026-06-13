import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { ITransactionRepository } from './interfaces/transaction.repository.interface';
import { FilterTransactionsDto, TransactionType } from './dto/filter-transactions.dto';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly orm: Repository<Transaction>,
  ) {}

  create(
    debitedAccountId: string,
    creditedAccountId: string,
    value: number,
    manager: EntityManager,
  ): Promise<Transaction> {
    const repo = manager.getRepository(Transaction);
    const transaction = repo.create({ debitedAccountId, creditedAccountId, value });
    return repo.save(transaction);
  }

  findByAccountId(accountId: string, filters: FilterTransactionsDto): Promise<Transaction[]> {
    const query = this.orm.createQueryBuilder('transaction');

    query.where(
      '(transaction.debitedAccountId = :id OR transaction.creditedAccountId = :id)',
      { id: accountId },
    );

    if (filters.type === TransactionType.CASH_OUT) {
      query.andWhere('transaction.debitedAccountId = :id', { id: accountId });
    } else if (filters.type === TransactionType.CASH_IN) {
      query.andWhere('transaction.creditedAccountId = :id', { id: accountId });
    }

    if (filters.date) {
      query.andWhere('DATE(transaction.createdAt) = :date', { date: filters.date });
    }

    return query.orderBy('transaction.createdAt', 'DESC').getMany();
  }
}
