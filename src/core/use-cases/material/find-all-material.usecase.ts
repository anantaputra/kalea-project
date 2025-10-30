import { MaterialsRepository } from '../../domain/repositories/material.repository.interface';
import { Materials } from '../../domain/entities/material.entity';

export class FindAllMaterialsUseCase {
  constructor(private readonly repo: MaterialsRepository) {}

  async execute(): Promise<Materials[]> {
    return this.repo.findAll();
  }

  async executePaginated(start: number, length: number): Promise<{ items: Materials[]; total: number }> {
    return this.repo.findAllPaginated(start, length);
  }
}