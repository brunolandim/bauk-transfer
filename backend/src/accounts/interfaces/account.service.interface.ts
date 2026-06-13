import { EntityManager } from 'typeorm';
import { Account } from '../account.entity';

export interface IAccountService {
  getBalance(accountId: string): Promise<number>;
  createAccount(manager?: EntityManager): Promise<Account>;
  transfer(debitedAccountId: string, creditedAccountId: string, amount: number, manager: EntityManager): Promise<void>;
}

export const IAccountService = Symbol('IAccountService');
