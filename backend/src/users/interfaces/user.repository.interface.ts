import { EntityManager } from 'typeorm';
import { User } from '../user.entity';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  create(username: string, hashedPassword: string, accountId: string, manager?: EntityManager): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
