import { EntityManager } from 'typeorm';
import { Account } from '../account.entity';

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  create(manager?: EntityManager): Promise<Account>;
  debit(id: string, amount: number, manager: EntityManager): Promise<void>;
  credit(id: string, amount: number, manager: EntityManager): Promise<void>;
}

export const IAccountRepository = Symbol('IAccountRepository');
