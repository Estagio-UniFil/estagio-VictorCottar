import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  DeleteDateColumn,
  Index,
} from 'typeorm';

@Entity()
@Index('IDX_USER_EMAIL_ACTIVE_UNIQUE', ['email'], {
  unique: true,
  where: `"deleted_at" IS NULL`,    // só vai permitir criar um usuário com o mesmo email se o outro estiver deletado.
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  admin: boolean;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}