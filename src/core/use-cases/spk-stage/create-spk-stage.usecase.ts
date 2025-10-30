import { SpkStageRepository } from '../../domain/repositories/spk-stage.repository.interface';
import { SpkStage } from '../../domain/entities/spk-stage.entity';

export class CreateSpkStageUseCase {
  constructor(private readonly repo: SpkStageRepository) {}

  async execute(entity: SpkStage): Promise<SpkStage> {
    return this.repo.create(entity);
  }
}