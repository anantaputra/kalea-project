import { SpkRepository } from '../../domain/repositories/spk.repository.interface';
import { Spk } from '../../domain/entities/spk.entity';

export class CreateSpkUseCase {
  constructor(private readonly repo: SpkRepository) {}

  async execute(entity: Spk): Promise<Spk> {
    return this.repo.create(entity);
  }
}
