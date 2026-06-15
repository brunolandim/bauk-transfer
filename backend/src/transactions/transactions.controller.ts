import { Body, Controller, Get, Inject, Post, Query, Request as Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ITransactionService } from './interfaces/transaction.service.interface';
import { TransferDto } from './dto/transfer.dto';
import { FilterTransactionsDto } from './dto/filter-transactions.dto';

@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(ITransactionService)
    private readonly transactionsService: ITransactionService,
  ) {}

  @Post('transfer')
  transfer(@Req() req: Request & { user: { accountId: string } }, @Body() dto: TransferDto) {
    return this.transactionsService.transfer(req.user.accountId, dto);
  }

  @Get()
  getTransactions(@Req() req: Request & { user: { accountId: string } }, @Query() filters: FilterTransactionsDto) {
    return this.transactionsService.getTransactions(req.user.accountId, filters);
  }
}
