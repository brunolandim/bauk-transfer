import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Account } from '../accounts/account.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  debitedAccountId!: string;

  @Column()
  creditedAccountId!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Account, { eager: false })
  @JoinColumn({ name: 'debitedAccountId' })
  debitedAccount!: Account;

  @ManyToOne(() => Account, { eager: false })
  @JoinColumn({ name: 'creditedAccountId' })
  creditedAccount!: Account;
}
