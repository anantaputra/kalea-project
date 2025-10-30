import { BomItemRepository } from '../../domain/repositories/bom-item.repository.interface';
import { BomItem } from '../../domain/entities/bom-item.entity';

export class FindAllBomItemUseCase {
  constructor(private readonly repo: BomItemRepository) {}

  async execute(): Promise<BomItem[]> {
    return this.repo.findAll();
  }
}
