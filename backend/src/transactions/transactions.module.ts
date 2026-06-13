import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ITransactionRepository } from './interfaces/transaction.repository.interface';
import { ITransactionService } from './interfaces/transaction.service.interface';
import { AccountsModule } from '../accounts/accounts.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    AccountsModule,
    UsersModule,
  ],
  providers: [
    { provide: ITransactionRepository, useClass: TransactionRepository },
    { provide: ITransactionService, useClass: TransactionsService },
  ],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
