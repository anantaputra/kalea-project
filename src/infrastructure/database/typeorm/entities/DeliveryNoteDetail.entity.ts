import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorEntity } from './Vendor.entity';
import { DeliveryNoteEntity } from './DeliveryNote.entity';
import { SpkDetailEntity } from './SpkDetail.entity';
import { SpkEntity } from './Spk.entity';

@Entity('TB_R_DELIVERY_NOTES_D')
export class DeliveryNoteDetailEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DeliveryNoteEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'delivery_note_id',
    referencedColumnName: 'id',
  })
  delivery_note: DeliveryNoteEntity;

  @ManyToOne(() => SpkEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({
    name: 'spk_id',
    referencedColumnName: 'id',
  })
  spk: SpkEntity | null;

  @ManyToOne(() => SpkDetailEntity, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({
    name: 'spk_detail_id',
    referencedColumnName: 'id',
  })
  spk_detail: SpkDetailEntity | null;

  @Column({
    name: 'item_type',
    type: 'varchar',
    nullable: false,
  })
  item_type: string;

  @Column({
    name: 'item_id',
    type: 'varchar',
    nullable: false,
  })
  item_id: string;

  @Column({
    name: 'qty_out',
    type: 'numeric',
    default: 0,
  })
  qty_out: number;

  @Column({
    name: 'qty_in',
    type: 'numeric',
    default: 0,
  })
  qty_in: number;

  @Column({
    name: 'labor_cost',
    type: 'numeric',
    default: 0,
  })
  labor_cost: number;

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
  changed_by: string | null;

  @Column({
    name: 'changed_dt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  changed_dt: Date | null;
}
