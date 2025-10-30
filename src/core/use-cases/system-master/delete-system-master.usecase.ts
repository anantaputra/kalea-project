import { SystemMasterRepository } from '../../domain/repositories/system-master.repository.interface';
import {
  requireNonEmptyTrimmed,
  requireFound,
} from '../../common/validation/assert';

export class DeleteSystemMasterUseCase {
  constructor(private readonly repo: SystemMasterRepository) {}

  async execute(
    system_type: string,
    system_cd: string,
    lang?: string,
  ): Promise<void> {
    const type = requireNonEmptyTrimmed(system_type, 'system_type', lang);
    const cd = requireNonEmptyTrimmed(system_cd, 'system_cd', lang);

    const existing = await this.repo.findBySystemTypeSystemCd(type, cd);
    requireFound(existing, 'Data', lang);

    await this.repo.delete(type, cd);
  }
}
