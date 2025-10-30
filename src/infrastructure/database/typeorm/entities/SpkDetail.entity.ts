import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpkEntity } from './Spk.entity';
import { ProductVariantEntity } from './ProductVariant.entity';

@Entity('TB_R_SPK_D')
export class SpkDetailEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SpkEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'spk_id',
    referencedColumnName: 'id',
  })
  spk: SpkEntity;

  @ManyToOne(() => ProductVariantEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'product_variant_id',
    referencedColumnName: 'id',
  })
  product_variant: ProductVariantEntity;

  @Column({
    name: 'cost_price',
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: false,
    default: 0,
  })
  cost_price: number;

  @Column({
    name: 'qty_order',
    type: 'numeric',
    nullable: false,
  })
  qty_order: number;

  @Column({
    name: 'qty_done',
    type: 'numeric',
    default: 0,
  })
  qty_done: number;

  @Column({
    name: 'qty_reject',
    type: 'numeric',
    default: 0,
  })
  qty_reject: number;

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
