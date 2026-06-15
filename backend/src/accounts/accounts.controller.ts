import { Controller, Get, Inject, Request as Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IAccountService } from './interfaces/account.service.interface';

@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(
    @Inject(IAccountService)
    private readonly accountService: IAccountService,
  ) {}

  @Get('balance')
  async getBalance(@Req() req: Request & { user: { accountId: string } }) {
    const balance = await this.accountService.getBalance(req.user.accountId);
    return { balance };
  }
}
