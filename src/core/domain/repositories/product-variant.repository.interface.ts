import { ProductVariant } from '../entities/product-variant.entity';

export interface ProductVariantRepository {
  findById(id: string): Promise<ProductVariant | null>;
  findAll(): Promise<ProductVariant[]>;
  findByBarcode(barcode: string): Promise<ProductVariant | null>;
  create(entity: ProductVariant): Promise<ProductVariant>;
  update(entity: ProductVariant): Promise<ProductVariant>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_VARIANT_REPOSITORY = Symbol('ProductVariantRepository');
