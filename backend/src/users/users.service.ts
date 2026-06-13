import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from './user.entity';
import { IUserRepository } from './interfaces/user.repository.interface';
import { IUserService } from './interfaces/user.service.interface';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  createWithAccount(username: string, hashedPassword: string, accountId: string, manager?: EntityManager): Promise<User> {
    return this.userRepository.create(username, hashedPassword, accountId, manager);
  }
}
