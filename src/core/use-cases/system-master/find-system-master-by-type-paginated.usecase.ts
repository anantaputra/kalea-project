import { SystemMasterRepository } from '../../domain/repositories/system-master.repository.interface';
import { SystemMaster } from '../../domain/entities/system-master.entity';
import { requireNonEmptyTrimmed } from '../../common/validation/assert';

export class FindSystemMasterByTypePaginatedUseCase {
  constructor(private readonly repo: SystemMasterRepository) {}

  async execute(
    system_type: string,
    skip: number,
    take: number,
    lang?: string,
  ): Promise<{ items: SystemMaster[]; total: number }> {
    const type = requireNonEmptyTrimmed(system_type, 'system_type', lang);

    const safeSkip = Number.isFinite(skip) && skip >= 0 ? skip : 0;
    const safeTake = Number.isFinite(take) && take > 0 ? take : 10;

    return this.repo.findBySystemTypePaginated(type, safeSkip, safeTake);
  }
}