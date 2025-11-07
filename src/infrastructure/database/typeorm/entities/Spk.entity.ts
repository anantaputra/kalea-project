import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TB_R_SPK_H')
export class SpkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'spk_no',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  spk_no: string;

  @Column({
    name: 'barcode',
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  barcode: string | null;

  @Column({
    name: 'buyer',
    type: 'varchar',
    nullable: false,
  })
  buyer: string;

  @Column({
    name: 'spk_date',
    type: 'date',
    nullable: false,
  })
  spk_date: Date;

  @Column({
    name: 'deadline',
    type: 'date',
    nullable: false,
  })
  deadline: Date;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: false,
  })
  status: string;

  @Column({
    name: 'notes',
    type: 'text',
    nullable: true,
  })
  notes: string | null;

  @Column({
    name: 'sewing_cost',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  sewing_cost: number | null;

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
  changed_by: string | null;

  @Column({
    name: 'changed_dt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  changed_dt: Date | null;
}
