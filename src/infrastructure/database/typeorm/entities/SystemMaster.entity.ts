import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('TB_M_SYSTEM')
export class SystemMasterEntity {
  @PrimaryColumn({
    name: 'SYSTEM_TYPE',
    type: 'varchar',
  })
  system_type: string;

  @PrimaryColumn({
    name: 'SYSTEM_CD',
    type: 'varchar',
  })
  system_cd: string;

  @Column({
    name: 'SYSTEM_VALUE',
    type: 'varchar',
    nullable: false,
  })
  system_value: string;

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
