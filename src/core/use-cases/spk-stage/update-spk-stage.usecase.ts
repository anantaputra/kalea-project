import { SpkStageRepository } from '../../domain/repositories/spk-stage.repository.interface';
import { SpkStage } from '../../domain/entities/spk-stage.entity';

export class UpdateSpkStageUseCase {
  constructor(private readonly repo: SpkStageRepository) {}

  async execute(entity: SpkStage): Promise<SpkStage> {
    return this.repo.update(entity);
  }
}