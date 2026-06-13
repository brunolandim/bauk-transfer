import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Account } from './account.entity';
import { IAccountRepository } from './interfaces/account.repository.interface';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly orm: Repository<Account>,
  ) {}

  findById(id: string): Promise<Account | null> {
    return this.orm.findOne({ where: { id } });
  }

  create(manager?: EntityManager): Promise<Account> {
    const repo = manager ? manager.getRepository(Account) : this.orm;
    const account = repo.create({ balance: 100.00 });
    return repo.save(account);
  }

  async debit(id: string, amount: number, manager: EntityManager): Promise<void> {
    await manager.getRepository(Account).decrement({ id }, 'balance', amount);
  }

  async credit(id: string, amount: number, manager: EntityManager): Promise<void> {
    await manager.getRepository(Account).increment({ id }, 'balance', amount);
  }
}
