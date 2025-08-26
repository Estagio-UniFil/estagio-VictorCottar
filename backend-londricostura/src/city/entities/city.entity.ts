import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, Index, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('city')
@Index('UQ_CITY_NAME_STATE', ['name', 'state'], { unique: true, where: `"deleted_at" IS NULL` })
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 2 })
  state: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    this.name = this.name?.trim().replace(/\s+/g, ' ');
    this.state = this.state?.trim().toUpperCase();
  }
}
