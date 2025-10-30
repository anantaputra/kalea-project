import { ProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';
import { ProductVariant } from '../../domain/entities/product-variant.entity';

export class FindProductVariantByIdUseCase {
  constructor(private readonly repo: ProductVariantRepository) {}

  async execute(id: string): Promise<ProductVariant | null> {
    return this.repo.findById(id);
  }
}
