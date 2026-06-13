import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IAuthService } from './interfaces/auth.service.interface';
import { IUserService } from '../users/interfaces/user.service.interface';
import { IAccountService } from '../accounts/interfaces/account.service.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(IUserService)
    private readonly userService: IUserService,

    @Inject(IAccountService)
    private readonly accountService: IAccountService,

    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) { }

  async register(dto: RegisterDto): Promise<void> {
    const existing = await this.userService.findByUsername(dto.username);
    if (existing) throw new ConflictException('Username already taken');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const account = await this.accountService.createAccount(queryRunner.manager);

      await this.userService.createWithAccount(dto.username, hashedPassword, account.id, queryRunner.manager);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    const user = await this.userService.findByUsername(dto.username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({
      sub: user.id,
      username: user.username,
      accountId: user.accountId,
    });

    return { token };
  }
}
