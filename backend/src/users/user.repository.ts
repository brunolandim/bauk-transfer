import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './user.entity';
import { IUserRepository } from './interfaces/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly orm: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User | null> {
    return this.orm.findOne({ where: { username } });
  }

  findById(id: string): Promise<User | null> {
    return this.orm.findOne({ where: { id } });
  }

  create(username: string, hashedPassword: string, accountId: string, manager?: EntityManager): Promise<User> {
    const repo = manager ? manager.getRepository(User) : this.orm;
    const user = repo.create({ username, password: hashedPassword, accountId });
    return repo.save(user);
  }
}
