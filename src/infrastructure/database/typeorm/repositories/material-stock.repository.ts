import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialStockEntity } from '../entities/MaterialStock.entity';
import { MaterialEntity } from '../entities/Material.entity';
import type { MaterialStockRepository as MaterialStockRepositoryInterface } from '../../../../core/domain/repositories/material-stock.repository.interface';
import { MaterialStock } from '../../../../core/domain/entities/material-stock.entity';

@Injectable()
export class MaterialStockRepository implements MaterialStockRepositoryInterface {
  constructor(
    @InjectRepository(MaterialStockEntity)
    private readonly ormRepo: Repository<MaterialStockEntity>,
  ) {}

  async findAll(): Promise<MaterialStock[]> {
    const rows = await this.ormRepo.find({ relations: ['material'] });
    return rows.map((row) => this.mapToDomain(row));
  }

  async findById(id: string): Promise<MaterialStock | null> {
    const row = await this.ormRepo.findOne({ where: { id }, relations: ['material'] });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: MaterialStock): Promise<MaterialStock> {
    const row = this.mapToOrm(entity);
    const saved = await this.ormRepo.save(row);
    return this.mapToDomain(saved);
  }

  async update(entity: MaterialStock): Promise<MaterialStock> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  private mapToDomain(row: MaterialStockEntity): MaterialStock {
    return new MaterialStock(
      row.id,
      row.material?.id,
      Number(row.qty ?? 0),
      Number(row.price ?? 0),
      Boolean(row.is_approved),
      row.approved_dt ?? null,
      row.created_by,
      row.created_dt,
      row.changed_by ?? null,
      row.changed_dt ?? null,
    );
  }

  private mapToOrm(entity: MaterialStock): MaterialStockEntity {
    const row = new MaterialStockEntity();
    if (entity.id) row.id = entity.id;
    if (entity.material_id) {
      // Assign relation by id only
      (row as any).material = { id: entity.material_id } as MaterialEntity as any;
    }
    row.qty = Number(entity.qty ?? 0);
    row.price = Number(entity.price ?? 0);
    // Jangan menimpa nilai is_approved jika tidak disediakan secara eksplisit
    if (typeof entity.is_approved === 'boolean') {
      row.is_approved = entity.is_approved;
    }
    // Sinkronkan approved_dt jika disediakan dari domain entity
    if (entity.approved_dt) {
      row.approved_dt = entity.approved_dt;
    }
    row.created_by = entity.created_by ?? 'system';
    row.created_dt = entity.created_dt ?? new Date();
    row.changed_by = entity.changed_by ?? null as any;
    row.changed_dt = entity.changed_dt ?? null as any;
    return row;
  }
}