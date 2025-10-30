import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorEntity } from './Vendor.entity';

@Entity('TB_R_DELIVERY_NOTES_H')
export class DeliveryNoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'delivery_note_no',
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  delivery_note_no: string;

  @Column({
    name: 'delivery_note_date',
    type: 'date',
    nullable: false,
  })
  delivery_note_date: Date;

  @Column({
    name: 'delivery_note_type',
    type: 'varchar',
    nullable: false,
  })
  delivery_note_type: string;

  @ManyToOne(() => VendorEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'vendor_id',
    referencedColumnName: 'id',
  })
  vendor: VendorEntity;

  @Column({
    name: 'destination',
    type: 'varchar',
    nullable: false,
  })
  destination: string;

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
