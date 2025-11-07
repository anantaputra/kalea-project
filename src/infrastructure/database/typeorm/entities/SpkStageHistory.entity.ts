import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpkDetailEntity } from './SpkDetail.entity';
import { SpkStageEntity } from './SpkStage.entity';

@Entity('TB_R_SPK_STAGE_HISTORY')
export class SpkStageHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SpkStageEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'spk_stage_id',
    referencedColumnName: 'id',
  })
  spk_stage_id: SpkStageEntity;

  @Column({
    name: 'field_changed',
    type: 'varchar',
    nullable: false,
  })
  field_changed: string;

  @Column({
    name: 'old_value',
    type: 'varchar',
    nullable: false,
  })
  old_value: string;

  @Column({
    name: 'new_value',
    type: 'varchar',
    nullable: false,
  })
  new_value: string;

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
