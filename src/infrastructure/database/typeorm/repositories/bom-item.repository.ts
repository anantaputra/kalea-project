import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BomItemEntity } from '../entities/BomItem.entity';
import type { BomItemRepository as BomItemRepositoryInterface } from '../../../../core/domain/repositories/bom-item.repository.interface';
import { BomItem } from '../../../../core/domain/entities/bom-item.entity';

@Injectable()
export class BomItemRepository implements BomItemRepositoryInterface {
  constructor(
    @InjectRepository(BomItemEntity)
    private readonly ormRepo: Repository<BomItemEntity>,
  ) {}

  async findAll(): Promise<BomItem[]> {
    const rows = await this.ormRepo.find({
      relations: ['product_variant', 'material'],
    });
    return rows.map((row) => this.mapToDomain(row));
  }

  async findById(id: string): Promise<BomItem | null> {
    const row = await this.ormRepo.findOne({
      where: { id },
      relations: ['product_variant', 'material'],
    });
    return row ? this.mapToDomain(row) : null;
  }

  async findByProductVariantId(productVariantId: string): Promise<BomItem[]> {
    const rows = await this.ormRepo.find({
      where: { product_variant: { id: productVariantId } },
      relations: ['material', 'product_variant'],
    });
    return rows.map((row) => this.mapToDomain(row));
  }

  async create(entity: BomItem): Promise<BomItem> {
    const row = this.mapToOrm(entity);
    const saved = await this.ormRepo.save(row);
    return this.mapToDomain(saved);
  }

  async update(entity: BomItem): Promise<BomItem> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  private mapToDomain(row: BomItemEntity): BomItem {
    return new BomItem(
      row.id,
      row.product_variant?.id ?? '',
      row.material?.id ?? '',
      Number(row.qty_per_unit),
      row.condition_color ?? null,
      Number(row.waste_pct),
      row.created_by,
      row.created_dt,
      row.changed_by ?? 'system',
      row.changed_dt ?? row.created_dt,
      row.product_variant
        ? {
            id: row.product_variant.id,
            product_name: row.product_variant.product_name,
            size: row.product_variant.size,
            color: row.product_variant.color ?? null,
            sku: row.product_variant.sku ?? null,
          }
        : null,
      row.material
        ? {
            id: row.material.id,
            material_code: row.material.material_code,
            material_name: row.material.material_name,
            material_category: row.material.material_category,
            unit_of_measure: row.material.unit_of_measure,
          }
        : null,
    );
  }

  private mapToOrm(entity: BomItem): BomItemEntity {
    const row = new BomItemEntity();
    if (entity.id) {
      row.id = entity.id;
    }
    row.product_variant = { id: entity.product_variant_id! } as any;
    row.material = { id: entity.material_id! } as any;
    row.qty_per_unit = entity.qty_per_unit as any;
    row.condition_color = entity.condition_color ?? (null as any);
    row.waste_pct = entity.waste_pct as any;
    row.created_by = entity.created_by;
    row.created_dt = entity.created_dt;
    row.changed_by = entity.changed_by;
    row.changed_dt = entity.changed_dt;
    return row;
  }
}
