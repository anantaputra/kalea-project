import {
  SpkRepository,
  CreateSpkFullPayload,
} from '../../domain/repositories/spk.repository.interface';
import { Spk } from '../../domain/entities/spk.entity';

export class CreateSpkFullUseCase {
  constructor(private readonly repo: SpkRepository) {}

  async execute(payload: CreateSpkFullPayload): Promise<Spk> {
    return this.repo.createFull(payload);
  }
}
