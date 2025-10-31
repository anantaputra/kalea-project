import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialEntity } from '../entities/Material.entity';
import type { MaterialsRepository as MaterialsRepositoryInterface } from '../../../../core/domain/repositories/material.repository.interface';
import { Materials } from '../../../../core/domain/entities/material.entity';

@Injectable()
export class MaterialsRepository implements MaterialsRepositoryInterface {
  constructor(
    @InjectRepository(MaterialEntity)
    private readonly ormRepo: Repository<MaterialEntity>,
  ) {}

  async findAll(): Promise<Materials[]> {
    const rows = await this.ormRepo.find();
    return rows.map((row) => this.mapToDomain(row));
  }

  async findAllPaginated(start: number, length: number): Promise<{ items: Materials[]; total: number }> {
    const [rows, total] = await this.ormRepo.findAndCount({
      skip: start,
      take: length,
    });
    const items = rows.map((row) => this.mapToDomain(row));
    return { items, total };
  }

  async findById(id: string): Promise<Materials | null> {
    const row = await this.ormRepo.findOne({ where: { id } });
    return row ? this.mapToDomain(row) : null;
  }

  async findByBarcode(barcode: string): Promise<Materials | null> {
    const row = await this.ormRepo.findOne({ where: { barcode } });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: Materials): Promise<Materials> {
    const row = this.mapToOrm(entity);
    const saved = await this.ormRepo.save(row);
    return this.mapToDomain(saved);
  }

  async update(entity: Materials): Promise<Materials> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  private mapToDomain(row: MaterialEntity): Materials {
    return new Materials(
      row.id,
      row.material_code,
      row.material_name,
      row.barcode,
      row.material_category,
      row.unit_of_measure,
      row.stock_qty,
      row.is_active,
      row.created_by,
      row.created_dt,
      row.changed_by,
      row.changed_dt,
    );
  }

  private mapToOrm(entity: Materials): MaterialEntity {
    const row = new MaterialEntity();
    if (entity.id) row.id = entity.id;
    row.material_code = entity.material_code!;
    row.material_name = entity.material_name!;
    row.barcode = entity.barcode ?? '';
    row.material_category = entity.material_category!;
    row.unit_of_measure = entity.unit_of_measure!;
    row.is_active = entity.is_active ?? true;
    row.created_by = entity.created_by ?? 'system';
    row.created_dt = entity.created_dt ?? new Date();
    row.changed_by = entity.changed_by ?? null as any;
    row.changed_dt = entity.changed_dt ?? null as any;
    return row;
  }
}