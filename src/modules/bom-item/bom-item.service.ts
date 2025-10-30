import { Injectable, NotFoundException } from '@nestjs/common';
import { BomItem } from '../../core/domain/entities/bom-item.entity';
import { tNotFound } from '../../core/common/i18n/messages';
import { CreateBomItemUseCase } from '../../core/use-cases/bom-item/create-bom-item.usecase';
import { UpdateBomItemUseCase } from '../../core/use-cases/bom-item/update-bom-item.usecase';
import { FindAllBomItemUseCase } from '../../core/use-cases/bom-item/find-all-bom-item.usecase';
import { FindBomItemByIdUseCase } from '../../core/use-cases/bom-item/find-bom-item-by-id.usecase';
import { DeleteBomItemUseCase } from '../../core/use-cases/bom-item/delete-bom-item.usecase';
import { FindBomItemsByProductVariantIdUseCase } from '../../core/use-cases/bom-item/find-bom-items-by-product-variant-id.usecase';
import type { CreateBomItemDto } from './dto/create-bom-item.dto';
import type { UpdateBomItemDto } from './dto/update-bom-item.dto';

@Injectable()
export class BomItemService {
  constructor(
    private readonly createUseCase: CreateBomItemUseCase,
    private readonly updateUseCase: UpdateBomItemUseCase,
    private readonly findAllUseCase: FindAllBomItemUseCase,
    private readonly findByIdUseCase: FindBomItemByIdUseCase,
    private readonly deleteUseCase: DeleteBomItemUseCase,
    private readonly findByProductVariantIdUseCase: FindBomItemsByProductVariantIdUseCase,
  ) {}

  async findAllPaginated(start: number, length: number, lang?: string) {
    const items = await this.findAllUseCase.execute();
    const total = items.length;
    const paged = items.slice(start, start + length);
    return { items: paged.map((e) => this.mapToResponse(e)), total };
  }

  async findOne(id: string, lang?: string) {
    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('BOM Item', lang));
    }
    return this.mapToResponse(existing);
  }

  async create(dto: CreateBomItemDto, lang?: string) {
    const entity = new BomItem(
      undefined,
      dto.product_variant_id,
      dto.material_id,
      Number(dto.qty_per_unit),
      dto.condition_color ?? null,
      Number(dto.waste_pct),
      dto.user_id ?? 'system',
      new Date(),
      dto.user_id ?? 'system',
      new Date(),
    );
    const created = await this.createUseCase.execute(entity);
    return this.mapToResponse(created);
  }

  async update(id: string, dto: UpdateBomItemDto, lang?: string) {
    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('BOM Item', lang));
    }
    const entity = new BomItem(
      id,
      dto.product_variant_id ?? existing.product_variant_id,
      dto.material_id ?? existing.material_id,
      dto.qty_per_unit ?? existing.qty_per_unit,
      dto.condition_color ?? existing.condition_color,
      dto.waste_pct ?? existing.waste_pct,
      existing.created_by,
      existing.created_dt,
      dto.user_id ?? existing.changed_by ?? 'system',
      new Date(),
    );
    const updated = await this.updateUseCase.execute(entity);
    return this.mapToResponse(updated);
  }

  async remove(id: string, _lang?: string): Promise<void> {
    await this.deleteUseCase.execute(id);
  }

  async findByProductVariantId(productVariantId: string) {
    const items = await this.findByProductVariantIdUseCase.execute(
      productVariantId,
    );
    return items.map((e) => this.mapToResponse(e));
  }

  private mapToResponse(e: BomItem) {
    return {
      id: e.id,
      product_variant: e.product_variant
        ? {
            id: e.product_variant.id,
            product_name: e.product_variant.product_name,
            size: e.product_variant.size,
            color: e.product_variant.color,
            sku: e.product_variant.sku,
          }
        : e.product_variant_id
        ? { id: e.product_variant_id }
        : null,
      material: e.material
        ? {
            id: e.material.id,
            material_code: e.material.material_code,
            material_name: e.material.material_name,
            material_category: e.material.material_category,
            unit_of_measure: e.material.unit_of_measure,
          }
        : e.material_id
        ? { id: e.material_id }
        : null,
      qty_per_unit: e.qty_per_unit,
      condition_color: e.condition_color,
      waste_pct: e.waste_pct,
      created_by: e.created_by,
      created_dt: e.created_dt,
      changed_by: e.changed_by,
      changed_dt: e.changed_dt,
    };
  }
}