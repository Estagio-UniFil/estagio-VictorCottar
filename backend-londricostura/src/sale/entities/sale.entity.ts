import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Costumer } from 'src/costumer/entities/costumer.entity';
import { User } from 'src/user/entities/user.entity';
import { SaleItem } from '../../sale-item/entities/sale-item.entity';

@Entity('sale')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'costumer_id' })
  costumerId: number;

  @ManyToOne(() => Costumer, { eager: true })
  @JoinColumn({ name: 'costumer_id' })
  costumer: Costumer;

  @Column({ type: 'date' })
  date: string;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SaleItem, (item) => item.sale, { cascade: ['insert'], eager: true })
  items: SaleItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;
}
