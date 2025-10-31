import { MaterialStockRepository } from '../../domain/repositories/material-stock.repository.interface';
import { MaterialStock } from '../../domain/entities/material-stock.entity';

export class CreateMaterialStockUseCase {
  constructor(private readonly repo: MaterialStockRepository) {}

  async execute(entity: MaterialStock): Promise<MaterialStock> {
    return this.repo.create(entity);
  }
}