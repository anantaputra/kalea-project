import { SpkRepository } from '../../domain/repositories/spk.repository.interface';
import { Spk } from '../../domain/entities/spk.entity';

export class FindAllSpkUseCase {
  constructor(private readonly repo: SpkRepository) {}

  async execute(): Promise<Spk[]> {
    return this.repo.findAll();
  }
}