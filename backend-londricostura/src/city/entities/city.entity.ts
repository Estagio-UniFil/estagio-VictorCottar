import { Max } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column()
  @Max(2)
  state: string;

  @BeforeInsert()
  @BeforeUpdate()
  transformToUpperCase() {
    this.name = this.name?.trim().toUpperCase();
    this.state = this.state?.trim().toUpperCase();
  }

}