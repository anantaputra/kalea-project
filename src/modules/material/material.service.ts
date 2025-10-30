import { Injectable, NotFoundException } from '@nestjs/common';
import { Materials } from '../../core/domain/entities/material.entity';
import type { CreateMaterialsDto } from './dto/create-material.dto';
import type { UpdateMaterialsDto } from './dto/update-material.dto';
import { randomUUID } from 'crypto';
import { MaterialCategoryType } from 'src/core/domain/value-objects/material-category-id.vo';
import { UnitOfMeasureType } from 'src/core/domain/value-objects/unit-of-measure-id.vo';
import { tNotFound } from 'src/core/common/i18n/messages';
import {
  CreateMaterialsUseCase,
  UpdateMaterialsUseCase,
  FindAllMaterialsUseCase,
  FindMaterialsByIdUseCase,
  DeleteMaterialsUseCase,
  FindMaterialsByBarcodeUseCase,
} from '../../core/use-cases/material';
import { FindSystemMasterByTypeCdUseCase } from '../../core/use-cases/system-master';
import bwipjs from 'bwip-js';

@Injectable()
export class MaterialsService {
  constructor(
    private readonly createUseCase: CreateMaterialsUseCase,
    private readonly updateUseCase: UpdateMaterialsUseCase,
    private readonly findAllUseCase: FindAllMaterialsUseCase,
    private readonly findByIdUseCase: FindMaterialsByIdUseCase,
    private readonly deleteUseCase: DeleteMaterialsUseCase,
    private readonly findByTypeCdUseCase: FindSystemMasterByTypeCdUseCase,
    private readonly findByBarcodeUseCase: FindMaterialsByBarcodeUseCase,
  ) {}

  private async mapToResponse(entity: Materials, lang?: string) {
    const cat = await this.findByTypeCdUseCase.execute(
      MaterialCategoryType.MATERIAL_CATEGORY,
      entity.material_category!,
      lang,
    );
    const unit = await this.findByTypeCdUseCase.execute(
      UnitOfMeasureType.UNIT_OF_MEASURE,
      entity.unit_of_measure!,
      lang,
    );
    return {
      id: entity.id,
      material_code: entity.material_code,
      material_name: entity.material_name,
      barcode: entity.barcode,
      material_category: cat?.system_value ?? entity.material_category,
      unit_of_measure: unit?.system_value ?? entity.unit_of_measure,
      created_by: entity.created_by ?? null,
      created_dt: entity.created_dt ? entity.created_dt.toISOString() : null,
      changed_by: entity.changed_by ?? null,
      changed_dt: entity.changed_dt ? entity.changed_dt.toISOString() : null,
    };
  }

  async findAll(lang?: string) {
    const list = await this.findAllUseCase.execute();
    const mapped = await Promise.all(list.map((e) => this.mapToResponse(e, lang)));
    return mapped;
  }

  async findAllPaginated(start: number, length: number, lang?: string) {
    const { items, total } = await this.findAllUseCase.executePaginated(start, length);
    const mapped = await Promise.all(items.map((e) => this.mapToResponse(e, lang)));
    return { items: mapped, total };
  }

  async findOne(id: string, lang?: string) {
    const entity = await this.findByIdUseCase.execute(id);
    if (!entity) {
      throw new NotFoundException(tNotFound('Material', lang));
    }
    return this.mapToResponse(entity, lang);
  }

  private async validateRelations(categoryCd: string, unitCd: string, lang?: string) {
    const cat = await this.findByTypeCdUseCase.execute(
      MaterialCategoryType.MATERIAL_CATEGORY,
      categoryCd,
      lang,
    );
    if (!cat) throw new NotFoundException(tNotFound('Material Category', lang));

    const unit = await this.findByTypeCdUseCase.execute(
      UnitOfMeasureType.UNIT_OF_MEASURE,
      unitCd,
      lang,
    );
    if (!unit) throw new NotFoundException(tNotFound('Unit Of Measure', lang));
  }

  async create(dto: CreateMaterialsDto, lang?: string) {
    await this.validateRelations(dto.material_category, dto.unit_of_measure, lang);

    const now = new Date();
    const creator = dto.user_id ?? 'system';
    const barcode = await this.generateUniqueBarcode();
    const entity = new Materials(
      randomUUID(),
      dto.material_code,
      dto.material_name,
      barcode,
      dto.material_category,
      dto.unit_of_measure,
      dto.is_active ?? true,
      creator,
      now,
      creator,
      now,
    );
    const saved = await this.createUseCase.execute(entity);
    return this.mapToResponse(saved, lang);
  }

  async update(id: string, dto: UpdateMaterialsDto, lang?: string) {
    await this.validateRelations(dto.material_category!, dto.unit_of_measure!, lang);

    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('Material', lang));
    }
    const entity = new Materials(
      id,
      existing.material_code, // kode tidak diubah di update
      dto.material_name ?? existing.material_name,
      existing.barcode,
      dto.material_category ?? existing.material_category,
      dto.unit_of_measure ?? existing.unit_of_measure,
      dto.is_active ?? existing.is_active,
      existing.created_by,
      existing.created_dt,
      dto.user_id ?? existing.changed_by ?? 'system',
      new Date(),
    );
    const updated = await this.updateUseCase.execute(entity);
    return this.mapToResponse(updated, lang);
  }

  async remove(id: string, lang?: string): Promise<void> {
    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('Material', lang));
    }
    await this.deleteUseCase.execute(id);
  }

  // --- Barcode generation helpers (EAN-13) ---
  private async generateUniqueBarcode(): Promise<string> {
    // Generate EAN-13 barcode: 12 digits + 1 check digit
    // Loop until unique and renderable by bwip-js
    for (let i = 0; i < 100; i++) {
      const base12 = this.random12Digits();
      const check = this.computeEan13CheckDigit(base12);
      const candidate = `${base12}${check}`;

      const existing = await this.findByBarcodeUseCase.execute(candidate);
      if (existing) {
        continue; // not unique
      }

      const ok = await this.renderWithBwip(candidate);
      if (!ok) {
        continue; // avoid invalid render
      }

      return candidate;
    }
    // Fallback to a timestamp-based number (still check digit validated)
    const base = `${Date.now()}`.slice(0, 12).padEnd(12, '0');
    return `${base}${this.computeEan13CheckDigit(base)}`;
  }

  private computeEan13CheckDigit(d12: string): number {
    // EAN-13 check digit: sum of digits in odd positions + 3 * sum of digits in even positions
    const digits = d12.split('').map((d) => parseInt(d, 10));
    const sum = digits.reduce((acc, val, idx) => {
      const pos = idx + 1; // 1-indexed
      return acc + (pos % 2 === 0 ? val * 3 : val);
    }, 0);
    return (10 - (sum % 10)) % 10;
  }

  private random12Digits(): string {
    let s = '';
    for (let i = 0; i < 12; i++) {
      s += Math.floor(Math.random() * 10).toString();
    }
    return s;
  }

  private async renderWithBwip(text: string): Promise<boolean> {
    try {
      await bwipjs.toBuffer({
        bcid: 'ean13',
        text,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });
      return true;
    } catch {
      return false;
    }
  }

  // --- Backfill helpers ---
  async backfillMissingBarcodes(lang?: string) {
    const all = await this.findAllUseCase.execute();
    let updatedCount = 0;
    for (const m of all) {
      if (!m.barcode || m.barcode.trim() === '') {
        const barcode = await this.generateUniqueBarcode();
        const entity = new Materials(
          m.id,
          m.material_code,
          m.material_name,
          barcode,
          m.material_category,
          m.unit_of_measure,
          m.is_active,
          m.created_by,
          m.created_dt,
          'system',
          new Date(),
        );
        await this.updateUseCase.execute(entity);
        updatedCount++;
      }
    }
    return { updated: updatedCount };
  }
}