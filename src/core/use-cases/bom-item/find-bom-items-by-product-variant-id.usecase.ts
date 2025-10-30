import { BomItemRepository } from '../../domain/repositories/bom-item.repository.interface';
import { BomItem } from '../../domain/entities/bom-item.entity';

export class FindBomItemsByProductVariantIdUseCase {
  constructor(private readonly repo: BomItemRepository) {}

  async execute(productVariantId: string): Promise<BomItem[]> {
    return this.repo.findByProductVariantId(productVariantId);
  }
}