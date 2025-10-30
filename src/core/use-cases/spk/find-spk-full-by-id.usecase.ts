import {
  SpkRepository,
  SpkFullByIdResult,
} from '../../domain/repositories/spk.repository.interface';

export class FindSpkFullByIdUseCase {
  constructor(private readonly repo: SpkRepository) {}

  async execute(id: string): Promise<SpkFullByIdResult | null> {
    return this.repo.findFullById(id);
  }
}