import { ArticleEntity } from './Article.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('TB_M_PRODUCT_VARIANTS')
export class ProductVariantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ArticleEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'article_id',
    referencedColumnName: 'id',
  })
  article: ArticleEntity;

  @Column({
    name: 'product_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  product_name: string;

  @Column({
    name: 'size',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  size: string;

  @Column({
    name: 'color',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  color: string;

  @Column({
    name: 'barcode',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  barcode: string;

  @Column({
    name: 'sku',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  sku: string;

  @Column({
    name: 'price',
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  price: number;

  @Column({
    name: 'cost_price',
    type: 'numeric',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  cost_price: number;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  is_active: boolean;

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
