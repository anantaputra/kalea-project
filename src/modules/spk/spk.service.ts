import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateSpkUseCase,
  UpdateSpkUseCase,
  FindAllSpkUseCase,
  FindSpkFullByIdUseCase,
  CreateSpkFullUseCase,
  UpdateSpkFullUseCase,
  ApproveSpkUseCase,
} from 'src/core/use-cases/spk';
import { Spk } from '../../core/domain/entities/spk.entity';
import { tNotFound } from 'src/core/common/i18n/messages';
import type { CreateSpkDto } from './dto/create-spk.dto';
import type { UpdateSpkDto } from './dto/update-spk.dto';
import type { ApprovalSpkDto } from './dto/approval-spk.dto';
import { SPK_REPOSITORY } from 'src/core/domain/repositories/spk.repository.interface';
import { SpkRepository } from 'src/infrastructure/database/typeorm/repositories/spk.repository';
import { FindSystemMasterByTypeCdUseCase } from 'src/core/use-cases/system-master';
import { UnitOfMeasureType } from 'src/core/domain/value-objects/unit-of-measure-id.vo';
import { DeliveryNoteDetailEntity } from 'src/infrastructure/database/typeorm/entities/DeliveryNoteDetail.entity';
import { DeliveryNoteEntity } from 'src/infrastructure/database/typeorm/entities/DeliveryNote.entity';

@Injectable()
export class SpkService {
  constructor(
    private readonly createUseCase: CreateSpkUseCase,
    private readonly updateUseCase: UpdateSpkUseCase,
    private readonly findAllUseCase: FindAllSpkUseCase,
    private readonly findFullByIdUseCase: FindSpkFullByIdUseCase,
    private readonly createFullUseCase: CreateSpkFullUseCase,
    private readonly updateFullUseCase: UpdateSpkFullUseCase,
    private readonly approveUseCase: ApproveSpkUseCase,
    @Inject(SPK_REPOSITORY) private readonly repo: SpkRepository,
    private readonly findSystemMasterByTypeCdUseCase: FindSystemMasterByTypeCdUseCase,
    @InjectRepository(DeliveryNoteDetailEntity)
    private readonly dnDetailRepo: Repository<DeliveryNoteDetailEntity>,
  ) {}

  private mapHeaderToResponse(entity: Spk) {
    const toIso = (value: any) => {
      if (!value) return null;
      if (value instanceof Date) return value.toISOString();
      try {
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d.toISOString();
      } catch {
        return null;
      }
    };
    return {
      id: entity.id,
      spk_no: entity.spk_no,
      buyer: entity.buyer,
      spk_date: toIso(entity.spk_date),
      deadline: toIso(entity.deadline),
      status: entity.status,
      notes: entity.notes ?? null,
      created_by: entity.created_by,
      created_dt: toIso(entity.created_dt),
      changed_by: entity.changed_by ?? null,
      changed_dt: toIso(entity.changed_dt),
    };
  }

  async findAllPaginated(start = 0, length = 10, _lang?: string) {
    const all = await this.findAllUseCase.execute();
    const mapped = all.map((h) => this.mapHeaderToResponse(h));
    const total = mapped.length;
    const items = mapped.slice(start, start + length);
    return { items, total };
  }

  async generateSpkNo(): Promise<string> {
    const now = new Date();
    const month = now.getMonth() + 1; // 1-12
    const year = now.getFullYear();
    const romanMonths = [
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX',
      'X',
      'XI',
      'XII',
    ];
    const monthRoman = romanMonths[month - 1];

    // Ambil semua SPK dan cari urutan terakhir untuk bulan/tahun saat ini
    const all = await this.repo.findAll();
    const relevant = all
      .map((s) => s.spk_no)
      .filter((no) => !!no)
      .filter((no) => {
        const parts = no.split('/');
        return (
          parts.length === 4 &&
          parts[1] === 'SPK' &&
          parts[2] === monthRoman &&
          parts[3] === String(year)
        );
      });

    const lastSeq = relevant.reduce((max, no) => {
      const seqStr = no.split('/')[0];
      const seq = parseInt(seqStr, 10);
      return Number.isFinite(seq) && seq > max ? seq : max;
    }, 0);

    const nextSeq = lastSeq + 1;
    const nextSeqStr = String(nextSeq).padStart(3, '0');
    return `${nextSeqStr}/SPK/${monthRoman}/${year}`;
  }

  async findOne(id: string, lang?: string) {
    const full = await this.findFullByIdUseCase.execute(id);
    if (!full) {
      throw new NotFoundException(tNotFound('Spk', lang));
    }
    const header = this.mapHeaderToResponse(full.header as Spk);

    // Aggregate BOMs across all details: sum qty_required per material_id
    const bomItems = (full.details ?? []).flatMap((d: any) => d.bom ?? []);
    const grouped = new Map<string, { material_id: string; material_name: string; qty: number; unit_cd: string }>();
    for (const b of bomItems) {
      const key = b.material_id ?? '';
      if (!key) continue;
      const prev = grouped.get(key);
      const qty = Number(b.qty_required ?? 0);
      if (prev) {
        prev.qty = Number((prev.qty + qty).toFixed(4));
      } else {
        grouped.set(key, {
          material_id: key,
          material_name: b.material_name ?? '',
          qty: Number(qty.toFixed(4)),
          unit_cd: b.unit_of_measure ?? '',
        });
      }
    }

    const boms = await Promise.all(
      Array.from(grouped.values()).map(async (g) => {
        let unitLabel = g.unit_cd;
        try {
          if (g.unit_cd) {
            const uom = await this.findSystemMasterByTypeCdUseCase.execute(
              UnitOfMeasureType.UNIT_OF_MEASURE,
              g.unit_cd,
              lang,
            );
            unitLabel = uom?.system_value ?? g.unit_cd;
          }
        } catch {
          unitLabel = g.unit_cd;
        }
        return {
          material_id: g.material_id,
          material_name: g.material_name,
          qty: g.qty,
          unit_of_measure: unitLabel,
        };
      }),
    );

    // Build Surat Jalan history from Delivery Note details where spk_id matches
    const dnRows = await this.dnDetailRepo.find({
      where: { spk: { id } },
      relations: ['delivery_note', 'delivery_note.vendor', 'spk'],
    });
    const toDate = (d: any) => {
      if (!d) return '';
      if (d instanceof Date) return d.toISOString().split('T')[0];
      if (typeof d === 'string') return d;
      try {
        const parsed = new Date(d);
        return Number.isNaN(parsed.getTime())
          ? ''
          : parsed.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };
    const surat_jalan_history = dnRows.map((row) => {
      const dn: DeliveryNoteEntity = row.delivery_note as any;
      return {
        id: row.id,
        delivery_note_no: dn?.delivery_note_no ?? '',
        delivery_note_date: toDate(dn?.delivery_note_date ?? ''),
        delivery_note_type: (dn?.delivery_note_type ?? '').toString().toUpperCase(),
        vendor_id: dn?.vendor?.id ?? '',
        vendor_name: dn?.vendor?.name ?? '',
        destination: dn?.destination ?? '',
        status: dn?.status ?? '',
        notes: dn?.notes ?? '',
      };
    });

    return { ...header, details: full.details, boms, surat_jalan_history };
  }

  async create(dto: CreateSpkDto, _lang?: string) {
    const payload = {
      spk_no: dto.no_spk,
      buyer: dto.buyer,
      spk_date: new Date(dto.tanggal),
      deadline: new Date(dto.deadline),
      status: dto.status,
      notes: dto.notes ?? null,
      created_by: dto.user_id ?? 'system',
      details: dto.details.map((d) => ({
        product_variant_id: d.product_variant_id,
        qty_order: Number(d.qty_order),
        cost_price: Number(d.cost_price),
      })),
    };
    const created = await this.createFullUseCase.execute(payload);
    const full = await this.findFullByIdUseCase.execute(created.id);
    return full ? { ...full, header: this.mapHeaderToResponse(full.header as Spk) } : this.mapHeaderToResponse(created);
  }

  async update(id: string, dto: UpdateSpkDto, _lang?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('Spk', _lang));
    }

    const payload = {
      id,
      spk_no: dto.no_spk ?? existing.spk_no,
      buyer: dto.buyer ?? existing.buyer,
      spk_date: dto.tanggal ? new Date(dto.tanggal) : existing.spk_date,
      deadline: dto.deadline ? new Date(dto.deadline) : existing.deadline,
      status: dto.status ?? existing.status,
      notes: dto.notes ?? existing.notes ?? null,
      changed_by: dto.user_id ?? 'system',
      details: (dto.details ?? []).map((d) => ({
        product_variant_id: d.product_variant_id,
        qty_order: Number(d.qty_order),
        cost_price: Number(d.cost_price),
      })),
    };
    const updated = await this.updateFullUseCase.execute(payload);
    const full = await this.findFullByIdUseCase.execute(updated.id);
    return full ? { ...full, header: this.mapHeaderToResponse(full.header as Spk) } : this.mapHeaderToResponse(updated);
  }

  async approval(dto: ApprovalSpkDto, _lang?: string) {
    const saved = await this.approveUseCase.execute({
      id: dto.id,
      status: dto.status as any,
      notes: dto.notes ?? null,
      user_id: dto.user_id ?? 'system',
    });
    return this.mapHeaderToResponse(saved);
  }
}