import { Role } from 'src/enums/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity {
  @PrimaryGeneratedColumn() // essa opção é usada para criar uma coluna de auto incremento
  id: number;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  // @CreateDateColumn()
  // created_at: Date;

  // @CreateDateColumn({
  //   nullable: true,
  // })
  // updated_at: Date;

  @Column({
    enum: Role,
  })
  role: string;
}
