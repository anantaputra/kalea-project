import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateVendorUseCase,
  UpdateVendorUseCase,
  FindAllVendorUseCase,
  FindVendorByIdUseCase,
  DeleteVendorUseCase,
} from 'src/core/use-cases/vendor';
import { Vendor } from '../../core/domain/entities/vendor.entity';

@Injectable()
export class VendorService {
  constructor(
    private readonly createUseCase: CreateVendorUseCase,
    private readonly updateUseCase: UpdateVendorUseCase,
    private readonly findAllUseCase: FindAllVendorUseCase,
    private readonly findByIdUseCase: FindVendorByIdUseCase,
    private readonly deleteUseCase: DeleteVendorUseCase,
  ) {}

  async findAllPaginated(start: number, length: number, _lang?: string) {
    const items = await this.findAllUseCase.execute();
    const total = items.length;
    const paged = items.slice(start, start + length);
    return { items: paged, total };
  }

  async findOne(id: string, _lang?: string) {
    const data = await this.findByIdUseCase.execute(id);
    if (!data) throw new NotFoundException('Vendor not found');
    return data;
  }

  async create(dto: any, _lang?: string) {
    const auditUser = dto.user_id || 'system';
    const now = new Date();
    const entity = new Vendor(
      (undefined as any),
      dto.name,
      dto.contact_person,
      dto.phone,
      dto.email,
      dto.address,
      dto.city ?? null,
      dto.province ?? null,
      dto.country ?? null,
      dto.zip_code ?? null,
      dto.tax_number ?? null,
      dto.is_active ?? true,
      auditUser,
      now,
      auditUser,
      now,
    );
    return this.createUseCase.execute(entity);
  }

  async update(id: string, dto: any, _lang?: string) {
    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) throw new NotFoundException('Vendor not found');
    const auditUser = dto.user_id || existing.changed_by || 'system';
    const now = new Date();
    const entity = new Vendor(
      id,
      dto.name ?? existing.name,
      dto.contact_person ?? existing.contact_person,
      dto.phone ?? existing.phone,
      dto.email ?? existing.email,
      dto.address ?? existing.address,
      dto.city ?? existing.city ?? null,
      dto.province ?? existing.province ?? null,
      dto.country ?? existing.country ?? null,
      dto.zip_code ?? existing.zip_code ?? null,
      dto.tax_number ?? existing.tax_number ?? null,
      dto.is_active ?? existing.is_active,
      existing.created_by,
      existing.created_dt,
      auditUser,
      now,
    );
    return this.updateUseCase.execute(entity);
  }

  async remove(id: string, _lang?: string) {
    await this.deleteUseCase.execute(id);
    return null;
  }
}