import { ProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';
import { ProductVariant } from '../../domain/entities/product-variant.entity';

export class FindProductVariantByBarcodeUseCase {
  constructor(private readonly repo: ProductVariantRepository) {}

  async execute(barcode: string): Promise<ProductVariant | null> {
    return this.repo.findByBarcode(barcode);
  }
}