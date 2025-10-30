import { ProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';
import { ProductVariant } from '../../domain/entities/product-variant.entity';

export class FindAllProductVariantUseCase {
  constructor(private readonly repo: ProductVariantRepository) {}

  async execute(): Promise<ProductVariant[]> {
    return this.repo.findAll();
  }
}
