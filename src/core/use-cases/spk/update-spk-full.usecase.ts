import {
  SpkRepository,
  UpdateSpkFullPayload,
} from '../../domain/repositories/spk.repository.interface';
import { Spk } from '../../domain/entities/spk.entity';

export class UpdateSpkFullUseCase {
  constructor(private readonly repo: SpkRepository) {}

  async execute(payload: UpdateSpkFullPayload): Promise<Spk> {
    return this.repo.updateFull(payload);
  }
}