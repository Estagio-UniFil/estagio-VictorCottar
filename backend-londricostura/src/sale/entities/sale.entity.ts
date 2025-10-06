import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Costumer } from 'src/costumer/entities/costumer.entity';
import { SaleItem } from 'src/sale-item/entities/sale-item.entity';
import { User } from 'src/user/entities/user.entity'; 

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  costumerId?: number;

  @ManyToOne(() => Costumer, { nullable: true })
  costumer?: Costumer;

  @Column({ nullable: true })
  userId?: number;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @OneToMany(() => SaleItem, item => item.sale)
  items?: SaleItem[];

  @Column()
  date: string;
}
