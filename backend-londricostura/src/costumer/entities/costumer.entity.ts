import { City } from 'src/city/entities/city.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  RelationId,
} from 'typeorm';

@Entity()
@Index('IDX_COSTUMER_NAME_UNIQUE', ['name'], {
  unique: true,
  where: `"deleted_at" IS NULL`,
})
export class Costumer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => City, { eager: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @RelationId((costumer: Costumer) => costumer.city)
  city_id: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
