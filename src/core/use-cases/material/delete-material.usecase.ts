import { MaterialsRepository } from '../../domain/repositories/material.repository.interface';

export class DeleteMaterialsUseCase {
  constructor(private readonly repo: MaterialsRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}