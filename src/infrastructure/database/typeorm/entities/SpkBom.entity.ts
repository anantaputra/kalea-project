import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpkDetailEntity } from './SpkDetail.entity';
import { MaterialEntity } from './Material.entity';

@Entity('TB_R_SPK_BOM')
export class SpkBomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SpkDetailEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'spk_detail_id',
    referencedColumnName: 'id',
  })
  spk_detail: SpkDetailEntity;

  @ManyToOne(() => MaterialEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'material_id',
    referencedColumnName: 'id',
  })
  material: MaterialEntity;

  @Column({
    name: 'qty_per_unit',
    type: 'numeric',
    nullable: false,
  })
  qty_per_unit: number;

  @Column({
    name: 'qty_required',
    type: 'numeric',
    nullable: false,
  })
  qty_required: number;

  @Column({
    name: 'waste_pct',
    type: 'numeric',
    default: 0,
  })
  waste_pct: number;

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
