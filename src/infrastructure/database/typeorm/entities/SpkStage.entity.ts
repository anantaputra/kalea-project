import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SpkDetailEntity } from './SpkDetail.entity';
import { MaterialEntity } from './Material.entity';

@Entity('TB_R_SPK_STAGE')
@Unique('UQ_SPK_STAGE_DETAIL_SEQ', ['spk_detail', 'seq'])
export class SpkStageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SpkDetailEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'spk_detail_id',
    referencedColumnName: 'id',
  })
  spk_detail: SpkDetailEntity;

  @Column({
    name: 'stage_name',
    type: 'varchar',
    nullable: false,
  })
  stage_name: string;

  @Column({
    name: 'seq',
    type: 'numeric',
    nullable: false,
    default: 0,
  })
  seq: number;

  @Column({
    name: 'qty_in',
    type: 'numeric',
    default: 0,
  })
  qty_in: number;

  @Column({
    name: 'qty_reject',
    type: 'numeric',
    default: 0,
  })
  qty_reject: number;

  @Column({
    name: 'pic_id',
    type: 'varchar',
    nullable: true,
  })
  pic_id: string;

  @Column({
    name: 'start_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  start_at: Date;

  @Column({
    name: 'end_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  end_at: Date;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: false,
  })
  status: string;

  @Column({
    name: 'created_by',
    type: 'varchar',
    default: 'system',
    nullable: false,
  })
  created_by: string;

  @Column({
    name: 'created_dt',
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
  changed_by: string;

  @Column({
    name: 'changed_dt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  changed_dt: Date;
}
