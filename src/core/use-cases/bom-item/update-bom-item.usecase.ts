import { BomItemRepository } from '../../domain/repositories/bom-item.repository.interface';
import { BomItem } from '../../domain/entities/bom-item.entity';

export class UpdateBomItemUseCase {
  constructor(private readonly repo: BomItemRepository) {}

  async execute(entity: BomItem): Promise<BomItem> {
    return this.repo.update(entity);
  }
}
