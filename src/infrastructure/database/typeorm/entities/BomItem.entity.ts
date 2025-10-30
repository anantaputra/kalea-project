import { MaterialEntity } from './Material.entity';
import { ProductVariantEntity } from './ProductVariant.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('TB_M_BOM_ITEMS')
export class BomItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProductVariantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'product_variant_id',
    referencedColumnName: 'id',
  })
  product_variant: ProductVariantEntity;

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
    name: 'condition_color',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  condition_color: string;

  @Column({
    name: 'waste_pct',
    type: 'numeric',
    nullable: false,
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
