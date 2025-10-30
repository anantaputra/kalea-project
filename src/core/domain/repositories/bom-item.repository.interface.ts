import { BomItem } from '../entities/bom-item.entity';

export interface BomItemRepository {
  findById(id: string): Promise<BomItem | null>;
  findAll(): Promise<BomItem[]>;
  findByProductVariantId(productVariantId: string): Promise<BomItem[]>;
  create(entity: BomItem): Promise<BomItem>;
  update(entity: BomItem): Promise<BomItem>;
  delete(id: string): Promise<void>;
}

export const BOM_ITEM_REPOSITORY = Symbol('BomItemRepository');
