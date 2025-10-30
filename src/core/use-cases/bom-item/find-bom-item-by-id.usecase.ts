import { BomItemRepository } from '../../domain/repositories/bom-item.repository.interface';
import { BomItem } from '../../domain/entities/bom-item.entity';

export class FindBomItemByIdUseCase {
  constructor(private readonly repo: BomItemRepository) {}

  async execute(id: string): Promise<BomItem | null> {
    return this.repo.findById(id);
  }
}
