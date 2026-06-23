import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import type { User } from '../users/user.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 100.00 })
  balance!: number;

  @OneToOne('User', (user: User) => user.account)
  user!: User;
}
