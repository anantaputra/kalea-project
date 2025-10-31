import { Injectable, Inject } from '@nestjs/common';
import { CreateMaterialStockUseCase, UpdateMaterialStockUseCase, DeleteMaterialStockUseCase, ApproveMaterialStockUseCase } from '../../core/use-cases/material-stock';
import { MaterialStock } from '../../core/domain/entities/material-stock.entity';
import { MATERIAL_STOCK_REPOSITORY } from '../../core/domain/repositories/material-stock.repository.interface';
import type { MaterialStockRepository } from '../../core/domain/repositories/material-stock.repository.interface';
import { MATERIALS_REPOSITORY } from '../../core/domain/repositories/material.repository.interface';
import type { MaterialsRepository } from '../../core/domain/repositories/material.repository.interface';
import type { CreateMaterialStockDto } from './dto/create-material-stock.dto';
import type { UpdateMaterialStockDto } from './dto/update-material-stock.dto';
import { FindSystemMasterByTypeCdUseCase } from '../../core/use-cases/system-master';
import { UnitOfMeasureType } from 'src/core/domain/value-objects/unit-of-measure-id.vo';
import { MaterialCategoryType } from 'src/core/domain/value-objects/material-category-id.vo';

@Injectable()
export class MaterialStockService {
  constructor(
    private readonly createUseCase: CreateMaterialStockUseCase,
    private readonly updateUseCase: UpdateMaterialStockUseCase,
    private readonly deleteUseCase: DeleteMaterialStockUseCase,
    private readonly approveUseCase: ApproveMaterialStockUseCase,
    @Inject(MATERIAL_STOCK_REPOSITORY)
    private readonly repo: MaterialStockRepository,
    @Inject(MATERIALS_REPOSITORY)
    private readonly materialsRepo: MaterialsRepository,
    private readonly findByTypeCdUseCase: FindSystemMasterByTypeCdUseCase,
  ) {}

  async findAllPaginated(start: number, length: number, lang?: string) {
    const rows = await this.repo.findAll();
    const total = rows.length;
    const slice = rows.slice(start, start + length);
    const items = await Promise.all(
      slice.map(async (s) => {
        const m = s.material_id ? await this.materialsRepo.findById(s.material_id) : null;
        const catLabel = m?.material_category
          ? (
              await this.findByTypeCdUseCase.execute(
                MaterialCategoryType.MATERIAL_CATEGORY,
                m.material_category,
                lang,
              )
            )?.system_value ?? m.material_category ?? ''
          : '';
        const uomLabel = m?.unit_of_measure
          ? (
              await this.findByTypeCdUseCase.execute(
                UnitOfMeasureType.UNIT_OF_MEASURE,
                m.unit_of_measure,
                lang,
              )
            )?.system_value ?? m.unit_of_measure ?? ''
          : '';
        return {
          id: s.id ?? '',
          material: m
            ? {
                id: m.id ?? '',
                material_code: m.material_code ?? '',
                material_name: m.material_name ?? '',
                material_category: catLabel,
                unit_of_measure: uomLabel,
                barcode: m.barcode ?? '',
              }
            : {
                id: s.material_id ?? '',
                material_code: '',
                material_name: '',
                material_category: '',
                unit_of_measure: '',
                barcode: '',
              },
          qty: Number(s.qty ?? 0),
          status: s.is_approved ? 'APPROVED' : 'NOT APPROVED',
          created_by: s.created_by ?? 'system',
          created_dt: s.created_dt ?? new Date(),
          changed_by: s.changed_by ?? null,
          changed_dt: s.changed_dt ?? null,
        };
      }),
    );
    return { items, total };
  }

  async findOne(id: string, lang?: string) {
    const s = await this.repo.findById(id);
    if (!s) return null;
    const m = s.material_id ? await this.materialsRepo.findById(s.material_id) : null;
    const catLabel = m?.material_category
      ? (
          await this.findByTypeCdUseCase.execute(
            MaterialCategoryType.MATERIAL_CATEGORY,
            m.material_category,
            lang,
          )
        )?.system_value ?? m.material_category ?? ''
      : '';
    const uomLabel = m?.unit_of_measure
      ? (
          await this.findByTypeCdUseCase.execute(
            UnitOfMeasureType.UNIT_OF_MEASURE,
            m.unit_of_measure,
            lang,
          )
        )?.system_value ?? m.unit_of_measure ?? ''
      : '';
    return {
      id: s.id ?? '',
      material: m
        ? {
            id: m.id ?? '',
            material_code: m.material_code ?? '',
            material_name: m.material_name ?? '',
            material_category: catLabel,
            unit_of_measure: uomLabel,
            barcode: m.barcode ?? '',
          }
        : {
            id: s.material_id ?? '',
            material_code: '',
            material_name: '',
            material_category: '',
            unit_of_measure: '',
            barcode: '',
          },
      qty: Number(s.qty ?? 0),
      status: s.is_approved ? 'APPROVED' : 'NOT APPROVED',
      created_by: s.created_by ?? 'system',
      created_dt: s.created_dt ?? new Date(),
      changed_by: s.changed_by ?? null,
      changed_dt: s.changed_dt ?? null,
    };
  }

  async create(dto: CreateMaterialStockDto, lang?: string) {
    const entity = new MaterialStock(
      undefined,
      dto.material_id,
      dto.qty,
      true,
      'system',
      new Date(),
      null,
      null,
    );
    const created = await this.createUseCase.execute(entity);
    const m = created.material_id ? await this.materialsRepo.findById(created.material_id) : null;
    return {
      id: created.id ?? '',
      material: m
        ? {
            id: m.id ?? '',
            material_code: m.material_code ?? '',
            material_name: m.material_name ?? '',
            material_category: m.material_category ?? '',
            unit_of_measure: m.unit_of_measure ?? '',
            barcode: m.barcode ?? '',
          }
        : {
            id: created.material_id ?? '',
            material_code: '',
            material_name: '',
            material_category: '',
            unit_of_measure: '',
            barcode: '',
          },
      qty: Number(created.qty ?? 0),
      created_by: created.created_by ?? 'system',
      created_dt: created.created_dt ?? new Date(),
      changed_by: created.changed_by ?? null,
      changed_dt: created.changed_dt ?? null,
    };
  }

  async update(id: string, dto: UpdateMaterialStockDto, lang?: string) {
    const entity = new MaterialStock(
      id,
      dto.material_id,
      dto.qty,
      true,
      'system',
      new Date(),
      'system',
      new Date(),
    );
    const saved = await this.updateUseCase.execute(entity);
    const m = saved.material_id ? await this.materialsRepo.findById(saved.material_id) : null;
    return {
      id: saved.id ?? '',
      material: m
        ? {
            id: m.id ?? '',
            material_code: m.material_code ?? '',
            material_name: m.material_name ?? '',
            material_category: m.material_category ?? '',
            unit_of_measure: m.unit_of_measure ?? '',
            barcode: m.barcode ?? '',
          }
        : {
            id: saved.material_id ?? '',
            material_code: '',
            material_name: '',
            material_category: '',
            unit_of_measure: '',
            barcode: '',
          },
      qty: Number(saved.qty ?? 0),
      created_by: saved.created_by ?? 'system',
      created_dt: saved.created_dt ?? new Date(),
      changed_by: saved.changed_by ?? null,
      changed_dt: saved.changed_dt ?? null,
    };
  }

  async remove(id: string, lang?: string): Promise<void> {
    await this.deleteUseCase.execute(id);
  }

  async approval(dto: { id: string; status: 'APPROVED' | 'REJECTED'; notes?: string | null; user_id?: string }, _lang?: string) {
    const savedMaterial = await this.approveUseCase.execute({
      id: dto.id,
      status: dto.status,
      notes: dto.notes ?? null,
      user_id: dto.user_id ?? 'system',
    });
    return {
      id: savedMaterial.id ?? '',
      material_code: savedMaterial.material_code ?? '',
      material_name: savedMaterial.material_name ?? '',
      barcode: savedMaterial.barcode ?? '',
      material_category: savedMaterial.material_category ?? '',
      unit_of_measure: savedMaterial.unit_of_measure ?? '',
      stock_qty: Number(savedMaterial.stock_qty ?? 0),
      created_by: savedMaterial.created_by ?? 'system',
      created_dt: savedMaterial.created_dt ?? new Date(),
      changed_by: savedMaterial.changed_by ?? null,
      changed_dt: savedMaterial.changed_dt ?? null,
    };
  }
}