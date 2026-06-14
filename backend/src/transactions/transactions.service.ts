import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ITransactionRepository } from './interfaces/transaction.repository.interface';
import { ITransactionService } from './interfaces/transaction.service.interface';
import { IAccountService } from '../accounts/interfaces/account.service.interface';
import { IUserService } from '../users/interfaces/user.service.interface';
import { TransferDto } from './dto/transfer.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionsService implements ITransactionService {
  constructor(
    @Inject(ITransactionRepository)
    private readonly transactionRepository: ITransactionRepository,

    @Inject(IAccountService)
    private readonly accountService: IAccountService,

    @Inject(IUserService)
    private readonly userService: IUserService,

    private readonly dataSource: DataSource,
  ) { }

  async transfer(senderAccountId: string, dto: TransferDto): Promise<void> {
    const recipient = await this.userService.findByUsername(dto.creditedUsername);
    if (!recipient) throw new NotFoundException('Recipient user not found');
    if (recipient.accountId === senderAccountId) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.accountService.transfer(
        senderAccountId,
        recipient.accountId,
        dto.value,
        queryRunner.manager,
      );

      await this.transactionRepository.create(
        senderAccountId,
        recipient.accountId,
        dto.value,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  getTransactions(accountId: string, filters: FilterTransactionsDto): Promise<TransactionResponseDto[]> {
    return this.transactionRepository.findByAccountId(accountId, filters);
  }
}
