import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity()
@Index('IDX_PRODUCT_CODE_NAME_UNIQUE', ['code', 'name'], {
  unique: true,
  where: `"deleted_at" IS NULL`, // só vai permitir criar um produto com o mesmo nome e code se o outro estiver deletado.
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
