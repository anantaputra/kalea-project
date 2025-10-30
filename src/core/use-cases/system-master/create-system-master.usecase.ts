import { randomUUID } from 'crypto';
import { SystemMasterRepository } from '../../domain/repositories/system-master.repository.interface';
import { SystemMaster } from '../../domain/entities/system-master.entity';
import { DomainConflictError } from '../../common/exceptions/domain.errors';
import { requireNonEmptyTrimmed } from '../../common/validation/assert';
import { tDomainConflictError } from '../../common/i18n/messages';

export type CreateSystemMasterParams = {
  system_type: string;
  system_value: string;
  system_cd?: string;
  user_id?: string | number;
};

export class CreateSystemMasterUseCase {
  constructor(private readonly repo: SystemMasterRepository) {}

  private async generateUniqueId(system_type: string): Promise<string> {
    for (let i = 0; i < 5; i++) {
      const candidate = randomUUID();
      const exists = await this.repo.findBySystemTypeSystemCd(
        system_type,
        candidate,
      );
      if (!exists) return candidate;
    }
    return `${Date.now()}-${randomUUID()}`;
  }

  async execute(
    params: CreateSystemMasterParams,
    lang?: string,
  ): Promise<SystemMaster> {
    const type = requireNonEmptyTrimmed(
      params.system_type,
      'SYSTEM TYPE',
      lang,
    );
    const value = requireNonEmptyTrimmed(
      params.system_value,
      'SYSTEM VALUE',
      lang,
    );
    const input_cd = params.system_cd?.trim();

    if (input_cd) {
      const dup = await this.repo.findBySystemTypeSystemCd(type, input_cd);
      if (dup) {
        throw tDomainConflictError('Data', lang);
      }
    }

    const id =
      input_cd && input_cd.length > 0
        ? input_cd
        : await this.generateUniqueId(type);
    const creator =
      params.user_id !== undefined ? String(params.user_id) : 'system';

    const now = new Date();
    const entity = new SystemMaster(type, id, value, creator, now);
    return this.repo.create(entity);
  }
}
