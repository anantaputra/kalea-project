import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendorEntity } from '../entities/Vendor.entity';
import type { VendorRepository as VendorRepositoryInterface } from '../../../../core/domain/repositories/vendor.repository.interface';
import { Vendor } from '../../../../core/domain/entities/vendor.entity';

@Injectable()
export class VendorRepository implements VendorRepositoryInterface {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly ormRepo: Repository<VendorEntity>,
  ) {}

  async findAll(): Promise<Vendor[]> {
    const rows = await this.ormRepo.find({ where: { is_active: true } });
    return rows.map((row) => this.mapToDomain(row));
  }

  async findById(id: string): Promise<Vendor | null> {
    const row = await this.ormRepo.findOne({ where: { id, is_active: true } });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: Vendor): Promise<Vendor> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  async update(entity: Vendor): Promise<Vendor> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.ormRepo.delete({ id });
  }

  private mapToDomain(row: VendorEntity): Vendor {
    return new Vendor(
      row.id,
      row.name,
      row.contact_person,
      row.phone,
      row.email,
      row.address,
      row.city ?? null,
      row.province ?? null,
      row.country ?? null,
      row.zip_code ?? null,
      row.tax_number ?? null,
      row.is_active,
      row.created_by,
      row.created_dt,
      row.changed_by,
      row.changed_dt,
    );
  }

  private mapToOrm(entity: Vendor): VendorEntity {
    const row = new VendorEntity();
    row.id = entity.id;
    row.name = entity.name;
    row.contact_person = entity.contact_person;
    row.phone = entity.phone;
    row.email = entity.email;
    row.address = entity.address;
    row.city = entity.city ?? (null as any);
    row.province = entity.province ?? (null as any);
    row.country = entity.country ?? (null as any);
    row.zip_code = entity.zip_code ?? (null as any);
    row.tax_number = entity.tax_number ?? (null as any);
    row.is_active = entity.is_active;
    row.created_by = entity.created_by;
    row.created_dt = entity.created_dt;
    row.changed_by = entity.changed_by;
    row.changed_dt = entity.changed_dt;
    return row;
  }
}
