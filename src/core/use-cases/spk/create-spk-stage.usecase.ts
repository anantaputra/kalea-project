import { SpkRepository, CreateSpkStagePayload } from '../../domain/repositories/spk.repository.interface';

export class CreateSpkStageUseCase {
  constructor(private readonly repo: SpkRepository) {}

  async execute(payload: CreateSpkStagePayload): Promise<{ id: string }> {
    return this.repo.createStage(payload);
  }
}