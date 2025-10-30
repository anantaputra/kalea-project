import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  Index,
  Collection,
} from 'typeorm';

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('TB_R_APPROVAL')
@Index(['module', 'ref_id'])
export class ApprovalTransactionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'approval_id' })
  approval_id: string;

  @Column({
    name: 'module',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  module: string;

  @Column({
    name: 'ref_id',
    type: 'uuid',
    nullable: false,
  })
  ref_id: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 20,
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
    nullable: false,
  })
  status: ApprovalStatus;

  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes: string | null;

  @Column({
    name: 'created_by',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  created_by: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  created_dt: Date;

  @Column({
    name: 'changed_by',
    type: 'varchar',
    default: 'system',
    nullable: true,
  })
  changed_by: string | null;

  @Column({
    name: 'changed_dt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  changed_dt: Date | null;
}