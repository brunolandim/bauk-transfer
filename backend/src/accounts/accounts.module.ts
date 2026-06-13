import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { AccountRepository } from './account.repository';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { IAccountRepository } from './interfaces/account.repository.interface';
import { IAccountService } from './interfaces/account.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [
    { provide: IAccountRepository, useClass: AccountRepository },
    { provide: IAccountService, useClass: AccountsService },
  ],
  controllers: [AccountsController],
  exports: [IAccountService],
})
export class AccountsModule {}
