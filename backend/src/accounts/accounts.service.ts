import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Account } from './account.entity';
import { IAccountRepository } from './interfaces/account.repository.interface';
import { IAccountService } from './interfaces/account.service.interface';

@Injectable()
export class AccountsService implements IAccountService {
  constructor(
    @Inject(IAccountRepository)
    private readonly accountRepository: IAccountRepository,
  ) {}

  async getBalance(accountId: string): Promise<number> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) throw new NotFoundException('Account not found');
    return Number(account.balance);
  }

  createAccount(manager?: EntityManager): Promise<Account> {
    return this.accountRepository.create(manager);
  }

  async transfer(
    debitedAccountId: string,
    creditedAccountId: string,
    amount: number,
    manager: EntityManager,
  ): Promise<void> {
    const account = await this.accountRepository.findById(debitedAccountId);
    if (!account) throw new NotFoundException('Account not found');
    if (Number(account.balance) < amount) throw new BadRequestException('Insufficient balance');

    await this.accountRepository.debit(debitedAccountId, amount, manager);
    await this.accountRepository.credit(creditedAccountId, amount, manager);
  }
}
