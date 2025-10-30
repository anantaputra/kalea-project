import { MaterialsRepository } from '../../domain/repositories/material.repository.interface';
import { Materials } from '../../domain/entities/material.entity';

export class FindMaterialsByIdUseCase {
  constructor(private readonly repo: MaterialsRepository) {}

  async execute(id: string): Promise<Materials | null> {
    return this.repo.findById(id);
  }
}