import { SystemMasterRepository } from '../../domain/repositories/system-master.repository.interface';
import { SystemMaster } from '../../domain/entities/system-master.entity';
import {
  requireNonEmptyTrimmed,
  requireFound,
} from '../../common/validation/assert';

export type UpdateSystemMasterParams = {
  system_type: string;
  system_cd: string;
  system_value: string;
  user_id?: string | number;
};

export class UpdateSystemMasterUseCase {
  constructor(private readonly repo: SystemMasterRepository) {}

  async execute(
    params: UpdateSystemMasterParams,
    lang?: string,
  ): Promise<SystemMaster> {
    const value = requireNonEmptyTrimmed(
      params.system_value,
      'system_value',
      lang,
    );

    const existing = await this.repo.findBySystemTypeSystemCd(
      params.system_type,
      params.system_cd,
    );
    const found = requireFound(existing, 'Data', lang);

    const entity = new SystemMaster(
      params.system_type,
      params.system_cd,
      value,
      found.created_by,
      found.created_dt,
      params.user_id !== undefined ? String(params.user_id) : found.changed_by,
      new Date(),
    );

    return this.repo.update(entity);
  }
}
