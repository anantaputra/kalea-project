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
import type { CreateBomItemBulkDto } from './dto/create-bom-item-bulk.dto';
import type { UpdateBomItemBulkDto } from './dto/update-bom-item-bulk.dto';
import { FindSystemMasterByTypeCdUseCase } from '../../core/use-cases/system-master';
import { UnitOfMeasureType } from 'src/core/domain/value-objects/unit-of-measure-id.vo';
import { MaterialCategoryType } from 'src/core/domain/value-objects/material-category-id.vo';

@Injectable()
export class BomItemService {
  constructor(
    private readonly createUseCase: CreateBomItemUseCase,
    private readonly updateUseCase: UpdateBomItemUseCase,
    private readonly findAllUseCase: FindAllBomItemUseCase,
    private readonly findByIdUseCase: FindBomItemByIdUseCase,
    private readonly deleteUseCase: DeleteBomItemUseCase,
    private readonly findByProductVariantIdUseCase: FindBomItemsByProductVariantIdUseCase,
    private readonly findByTypeCdUseCase: FindSystemMasterByTypeCdUseCase,
  ) {}

  async findAllPaginated(start: number, length: number, lang?: string) {
    const items = await this.findAllUseCase.execute();
    const total = items.length;
    const paged = items.slice(start, start + length);
    const mapped = await Promise.all(
      paged.map(async (e) => {
        const base = this.mapToResponse(e);
        // Resolve labels if material is loaded
        if (e.material) {
          const catLabel = e.material.material_category
            ? (
                await this.findByTypeCdUseCase.execute(
                  MaterialCategoryType.MATERIAL_CATEGORY,
                  e.material.material_category,
                  lang,
                )
              )?.system_value ?? e.material.material_category
            : base.material && (base.material as any).material_category;
          const uomLabel = e.material.unit_of_measure
            ? (
                await this.findByTypeCdUseCase.execute(
                  UnitOfMeasureType.UNIT_OF_MEASURE,
                  e.material.unit_of_measure,
                  lang,
                )
              )?.system_value ?? e.material.unit_of_measure
            : base.material && (base.material as any).unit_of_measure;
          if (base.material && 'material_code' in (base.material as any)) {
            (base.material as any).material_category = catLabel ?? (base.material as any).material_category;
            (base.material as any).unit_of_measure = uomLabel ?? (base.material as any).unit_of_measure;
          }
        }
        return base;
      }),
    );
    return { items: mapped, total };
  }

  async findOne(id: string, lang?: string) {
    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('BOM Item', lang));
    }
    const base = this.mapToResponse(existing);
    if (existing.material && base.material && 'material_code' in (base.material as any)) {
      const catLabel = existing.material.material_category
        ? (
            await this.findByTypeCdUseCase.execute(
              MaterialCategoryType.MATERIAL_CATEGORY,
              existing.material.material_category,
              lang,
            )
          )?.system_value ?? existing.material.material_category
        : (base.material as any).material_category;
      const uomLabel = existing.material.unit_of_measure
        ? (
            await this.findByTypeCdUseCase.execute(
              UnitOfMeasureType.UNIT_OF_MEASURE,
              existing.material.unit_of_measure,
              lang,
            )
          )?.system_value ?? existing.material.unit_of_measure
        : (base.material as any).unit_of_measure;
      (base.material as any).material_category = catLabel;
      (base.material as any).unit_of_measure = uomLabel;
    }
    return base;
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

  async createBulk(dto: CreateBomItemBulkDto, _lang?: string) {
    const existingItems = await this.findByProductVariantIdUseCase.execute(
      dto.product_variant_id,
    );

    for (const m of dto.materials) {
      const match = existingItems.find(
        (ex) => ex.material_id === m.material_id,
      );
      if (match) {
        // Update qty_per_unit untuk kombinasi product_variant_id + material_id yang sudah ada
        const entity = new BomItem(
          match.id,
          dto.product_variant_id,
          m.material_id,
          Number(m.qty_per_unit),
          match.condition_color ?? null,
          match.waste_pct ?? 0,
          match.created_by,
          match.created_dt,
          dto.user_id ?? match.changed_by ?? 'system',
          new Date(),
        );
        await this.updateUseCase.execute(entity);
      } else {
        // Buat baru jika belum ada
        const entity = new BomItem(
          undefined,
          dto.product_variant_id,
          m.material_id,
          Number(m.qty_per_unit),
          null,
          0,
          dto.user_id ?? 'system',
          new Date(),
          dto.user_id ?? 'system',
          new Date(),
        );
        await this.createUseCase.execute(entity);
      }
    }

    const items = await this.findByProductVariantIdUseCase.execute(
      dto.product_variant_id,
    );
    return this.mapBulkResponse(dto.product_variant_id, items);
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

  async updateBulk(productVariantId: string, dto: UpdateBomItemBulkDto, _lang?: string) {
    const pvId = productVariantId || dto.product_variant_id;
    const existingItems = await this.findByProductVariantIdUseCase.execute(pvId);
    const providedSet = new Set(dto.materials.map((m) => m.material_id));

    // Hapus item yang tidak ada di daftar baru
    for (const ex of existingItems) {
      if (!providedSet.has(ex.material_id!)) {
        await this.deleteUseCase.execute(ex.id!);
      }
    }

    // Upsert untuk setiap material yang diberikan
    for (const m of dto.materials) {
      const match = existingItems.find((ex) => ex.material_id === m.material_id);
      if (match) {
        const entity = new BomItem(
          match.id,
          pvId,
          m.material_id,
          Number(m.qty_per_unit),
          match.condition_color ?? null,
          match.waste_pct ?? 0,
          match.created_by,
          match.created_dt,
          dto.user_id ?? match.changed_by ?? 'system',
          new Date(),
        );
        await this.updateUseCase.execute(entity);
      } else {
        const entity = new BomItem(
          undefined,
          pvId,
          m.material_id,
          Number(m.qty_per_unit),
          null,
          0,
          dto.user_id ?? 'system',
          new Date(),
          dto.user_id ?? 'system',
          new Date(),
        );
        await this.createUseCase.execute(entity);
      }
    }

    const items = await this.findByProductVariantIdUseCase.execute(pvId);
    return this.mapBulkResponse(pvId, items);
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

  private mapBulkResponse(product_variant_id: string, items: BomItem[]) {
    const pv = items[0]?.product_variant
      ? {
          id: items[0]!.product_variant!.id,
          product_name: items[0]!.product_variant!.product_name,
          size: items[0]!.product_variant!.size,
          color: items[0]!.product_variant!.color,
          sku: items[0]!.product_variant!.sku,
        }
      : { id: product_variant_id };

    const materials = items
      .filter((i) => !!i.material)
      .map((i) => ({
        id: i.material!.id,
        material_code: i.material!.material_code,
        material_name: i.material!.material_name,
        material_category: i.material!.material_category,
        unit_of_measure: i.material!.unit_of_measure,
      }));

    return {
      id: product_variant_id,
      product_variant: pv,
      materials,
    };
  }
}