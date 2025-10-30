import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemMasterEntity } from '../entities/SystemMaster.entity';
import type { SystemMasterRepository as SystemMasterRepositoryInterface } from '../../../../core/domain/repositories/system-master.repository.interface';
import { SystemMaster } from '../../../../core/domain/entities/system-master.entity';

@Injectable()
export class SystemMasterRepository implements SystemMasterRepositoryInterface {
  constructor(
    @InjectRepository(SystemMasterEntity)
    private readonly ormRepo: Repository<SystemMasterEntity>,
  ) {}

  async findBySystemType(system_type: string): Promise<SystemMaster[]> {
    const rows = await this.ormRepo.find({ where: { system_type } });
    return rows.map((row) => this.mapToDomain(row));
  }

  // Implementasi paginasi di DB: skip/take + total count
  async findBySystemTypePaginated(
    system_type: string,
    skip: number,
    take: number,
  ): Promise<{ items: SystemMaster[]; total: number }> {
    const [rows, total] = await this.ormRepo.findAndCount({
      where: { system_type },
      skip,
      take,
      order: { system_cd: 'ASC' },
    });
    return {
      items: rows.map((row) => this.mapToDomain(row)),
      total,
    };
  }

  async findBySystemTypeSystemCd(
    system_type: string,
    system_cd: string,
  ): Promise<SystemMaster | null> {
    const row = await this.ormRepo.findOne({
      where: { system_type, system_cd },
    });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: SystemMaster): Promise<SystemMaster> {
    const row = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(row);
  }

  async update(entity: SystemMaster): Promise<SystemMaster> {
    await this.ormRepo.update(
      { system_type: entity.system_type, system_cd: entity.system_cd },
      {
        system_value: entity.system_value,
        changed_by: entity.changed_by,
        changed_dt: entity.changed_dt ?? new Date(),
      },
    );
    const updated = await this.ormRepo.findOne({
      where: { system_type: entity.system_type, system_cd: entity.system_cd },
    });
    return this.mapToDomain(updated!);
  }

  async delete(system_type: string, system_cd: string): Promise<void> {
    await this.ormRepo.delete({ system_type, system_cd });
  }

  private mapToDomain(row: SystemMasterEntity): SystemMaster {
    return new SystemMaster(
      row.system_type,
      row.system_cd,
      row.system_value,
      row.created_by,
      row.created_dt,
      row.changed_by,
      row.changed_dt,
    );
  }

  private mapToOrm(entity: SystemMaster): SystemMasterEntity {
    const row = new SystemMasterEntity();
    row.system_type = entity.system_type;
    row.system_cd = entity.system_cd;
    row.system_value = entity.system_value;
    if (entity.created_by !== undefined) {
      row.created_by = entity.created_by || 'system';
    }
    if (entity.created_dt !== undefined) {
      row.created_dt = entity.created_dt;
    }
    if (entity.changed_by !== undefined) {
      row.changed_by = entity.changed_by ?? null;
    } else if (entity.created_by !== undefined) {
      row.changed_by = entity.created_by || 'system';
    }
    if (entity.changed_dt !== undefined) {
      row.changed_dt = entity.changed_dt;
    }
    return row;
  }
}
