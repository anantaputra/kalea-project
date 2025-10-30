import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TB_M_AUTH' })
export class AuthEntity {
  @PrimaryColumn('uuid')
  id!: string;
}