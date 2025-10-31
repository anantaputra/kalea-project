import { ProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';
import { ProductVariant } from '../../domain/entities/product-variant.entity';

export class FindProductVariantsByArticleIdUseCase {
  constructor(private readonly repo: ProductVariantRepository) {}

  async execute(articleId: string): Promise<ProductVariant[]> {
    return this.repo.findByArticleId(articleId);
  }
}