import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UsersService } from './users.service';
import { IUserRepository } from './interfaces/user.repository.interface';
import { IUserService } from './interfaces/user.service.interface';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IUserService, useClass: UsersService },
  ],
  exports: [IUserService],
})
export class UsersModule {}
