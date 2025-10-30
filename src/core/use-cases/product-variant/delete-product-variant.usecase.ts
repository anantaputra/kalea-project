import { ProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';

export class DeleteProductVariantUseCase {
  constructor(private readonly repo: ProductVariantRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
