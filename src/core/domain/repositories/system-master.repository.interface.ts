import { SystemMaster } from '../entities/system-master.entity';

export interface SystemMasterRepository {
  findBySystemType(system_type: string): Promise<SystemMaster[]>;
  // Tambahan: paginasi berbasis DB dengan total count
  findBySystemTypePaginated(
    system_type: string,
    skip: number,
    take: number,
  ): Promise<{ items: SystemMaster[]; total: number }>;
  findBySystemTypeSystemCd(
    system_type: string,
    system_cd: string,
  ): Promise<SystemMaster | null>;
  create(entity: SystemMaster): Promise<SystemMaster>;
  update(entity: SystemMaster): Promise<SystemMaster>;
  delete(system_type: string, system_cd: string): Promise<void>;
}

export const SYSTEM_MASTER_REPOSITORY = Symbol('SystemMasterRepository');
