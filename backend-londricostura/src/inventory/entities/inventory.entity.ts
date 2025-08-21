import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Index } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

export type MovementType = 'IN' | 'OUT';

@Entity()
@Index('IDX_INVENTORY_PRODUCT_ID', ['product_id'])
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_id: number;

  @Column({ type: 'varchar', length: 3 })
  movement_type: MovementType;

  @Column('int')
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
