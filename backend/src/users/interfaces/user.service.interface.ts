import { EntityManager } from 'typeorm';
import { User } from '../user.entity';

export interface IUserService {
  findByUsername(username: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  createWithAccount(username: string, hashedPassword: string, accountId: string, manager?: EntityManager): Promise<User>;
}

export const IUserService = Symbol('IUserService');
