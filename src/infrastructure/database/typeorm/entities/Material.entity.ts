import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TB_M_MATERIALS')
export class MaterialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'material_code',
    type: 'varchar',
    nullable: false,
    // unique: true,
  })
  material_code: string;

  @Column({
    name: 'material_name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  material_name: string;

  @Column({
    name: 'barcode',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  barcode: string;

  @Column({
    name: 'material_category',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  material_category: string;

  @Column({
    name: 'unit_of_measure',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  unit_of_measure: string;

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
