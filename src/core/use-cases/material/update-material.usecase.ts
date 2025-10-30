import { MaterialsRepository } from '../../domain/repositories/material.repository.interface';
import { Materials } from '../../domain/entities/material.entity';

export class UpdateMaterialsUseCase {
  constructor(private readonly repo: MaterialsRepository) {}

  async execute(entity: Materials): Promise<Materials> {
    return this.repo.update(entity);
  }
}