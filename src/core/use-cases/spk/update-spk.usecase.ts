import { SpkRepository } from '../../domain/repositories/spk.repository.interface';
import { Spk } from '../../domain/entities/spk.entity';

export class UpdateSpkUseCase {
  constructor(private readonly repo: SpkRepository) {}

  async execute(entity: Spk): Promise<Spk> {
    return this.repo.update(entity);
  }
}
