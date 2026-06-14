import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { ITransactionRepository } from './interfaces/transaction.repository.interface';
import { FilterTransactionsDto, TransactionType } from './dto/filter-transactions.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

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

  async findByAccountId(accountId: string, filters: FilterTransactionsDto): Promise<TransactionResponseDto[]> {
    let where: FindOptionsWhere<Transaction> | FindOptionsWhere<Transaction>[]

    if (filters.type === TransactionType.CASH_OUT) {
      where = { debitedAccountId: accountId }
    } else if (filters.type === TransactionType.CASH_IN) {
      where = { creditedAccountId: accountId }
    } else {
      where = [
        { debitedAccountId: accountId },
        { creditedAccountId: accountId },
      ]
    }

    if (filters.date) {
      const start = new Date(filters.date)
      start.setHours(0, 0, 0, 0)
      const end = new Date(filters.date)
      end.setHours(23, 59, 59, 999)

      const dateFilter = { createdAt: Between(start, end) }

      where = Array.isArray(where)
        ? where.map((condition) => ({ ...condition, ...dateFilter }))
        : { ...where, ...dateFilter }
    }

    const transactions = await this.orm.find({
      where,
      relations: { debitedAccount: { user: true }, creditedAccount: { user: true } },
      order: { createdAt: 'DESC' },
    })

    return transactions.map((transaction) => ({
      id: transaction.id,
      debitedAccountId: transaction.debitedAccountId,
      creditedAccountId: transaction.creditedAccountId,
      value: transaction.value,
      createdAt: transaction.createdAt,
      debitedUsername: transaction.debitedAccount?.user?.username ?? '',
      creditedUsername: transaction.creditedAccount?.user?.username ?? '',
    }))
  }
}
