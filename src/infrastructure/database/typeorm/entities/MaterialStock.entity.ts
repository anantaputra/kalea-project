import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MaterialEntity } from './Material.entity';

@Entity('TB_R_MATERIAL_STOCK')
export class MaterialStockEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MaterialEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'material_id' })
  material!: MaterialEntity;

  @Column({
    name: 'qty',
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  qty: number;

  @Column({
    name: 'is_approved',
    type: 'boolean',
    default: false,
  })
  is_approved!: boolean;

  @Column({
    name: 'created_by',
    type: 'varchar',
    nullable: false,
    default: 'system',
  })
  created_by!: string;

  @Column({
    name: 'created_dt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_dt!: Date;

  @Column({
    name: 'changed_by',
    type: 'varchar',
    nullable: true,
  })
  changed_by!: string | null;

  @Column({
    name: 'changed_dt',
    type: 'timestamp',
    nullable: true,
  })
  changed_dt!: Date | null;
}