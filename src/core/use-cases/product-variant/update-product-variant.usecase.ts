import { ProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';
import { ProductVariant } from '../../domain/entities/product-variant.entity';

export class UpdateProductVariantUseCase {
  constructor(private readonly repo: ProductVariantRepository) {}

  async execute(entity: ProductVariant): Promise<ProductVariant> {
    return this.repo.update(entity);
  }
}
