import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  accountId: string;

  @OneToOne(() => Account, { eager: false })
  @JoinColumn({ name: 'accountId' })
  account: Account;
}
