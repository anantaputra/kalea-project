import { MaterialStockRepository } from '../../domain/repositories/material-stock.repository.interface';

export class DeleteMaterialStockUseCase {
  constructor(private readonly repo: MaterialStockRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}