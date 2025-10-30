import { SystemMasterRepository } from '../../domain/repositories/system-master.repository.interface';
import { SystemMaster } from '../../domain/entities/system-master.entity';
import { requireNonEmptyTrimmed } from '../../common/validation/assert';

export class FindSystemMasterByTypeUseCase {
  constructor(private readonly repo: SystemMasterRepository) {}

  async execute(system_type: string, lang?: string): Promise<SystemMaster[]> {
    const type = requireNonEmptyTrimmed(system_type, 'system_type', lang);
    return this.repo.findBySystemType(type);
  }
}
