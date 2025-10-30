import { SystemMasterRepository } from '../../domain/repositories/system-master.repository.interface';
import { SystemMaster } from '../../domain/entities/system-master.entity';
import { requireNonEmptyTrimmed } from '../../common/validation/assert';
import { tNotFound } from '../../common/i18n/messages';
import { DomainNotFoundError } from '../../common/exceptions/domain.errors';

export class FindSystemMasterByTypeCdUseCase {
  constructor(private readonly repo: SystemMasterRepository) {}

  async execute(
    system_type: string,
    system_cd: string,
    lang?: string,
  ): Promise<SystemMaster | null> {
    const type = requireNonEmptyTrimmed(system_type, 'system_type', lang);
    const cd = requireNonEmptyTrimmed(system_cd, 'system_cd', lang);
    const result = await this.repo.findBySystemTypeSystemCd(type, cd);

    if (!result) {
      throw new DomainNotFoundError(tNotFound('Data', lang));
    }

    return result;
  }
}
