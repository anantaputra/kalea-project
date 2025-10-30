import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('TB_M_VENDORS')
export class VendorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  name: string;

  @Column({
    name: 'contact_person',
    type: 'varchar',
    nullable: false,
  })
  contact_person: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    nullable: false,
  })
  phone: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email: string;

  @Column({
    name: 'address',
    type: 'varchar',
    nullable: false,
  })
  address: string;

  @Column({
    name: 'city',
    type: 'varchar',
    nullable: true,
  })
  city: string;

  @Column({
    name: 'province',
    type: 'varchar',
    nullable: true,
  })
  province: string;

  @Column({
    name: 'country',
    type: 'varchar',
    nullable: true,
  })
  country: string;

  @Column({
    name: 'zip_code',
    type: 'varchar',
    nullable: true,
  })
  zip_code: string;

  @Column({
    name: 'tax_number',
    type: 'varchar',
    nullable: true,
  })
  tax_number: string;

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
