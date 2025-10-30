import { SpkRepository, UpdateSpkStagePayload } from '../../domain/repositories/spk.repository.interface';

export class UpdateSpkStageUseCase {
  constructor(private readonly repo: SpkRepository) {}

  async execute(payload: UpdateSpkStagePayload): Promise<{ id: string }> {
    return this.repo.updateStage(payload);
  }
}