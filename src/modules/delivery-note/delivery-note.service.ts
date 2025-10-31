import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  CreateDeliveryNoteUseCase,
  UpdateDeliveryNoteUseCase,
  ApproveDeliveryNoteUseCase,
  CreateDeliveryNoteFullUseCase,
  FindDeliveryNoteFullByIdUseCase,
  UpdateDeliveryNoteFullUseCase,
} from 'src/core/use-cases/delivery-note';
import { DeliveryNote } from '../../core/domain/entities/delivery-note.entity';
import type { ApprovalDeliveryNoteDto } from './dto/approval-delivery-note.dto';
import { DELIVERY_NOTE_REPOSITORY } from 'src/core/domain/repositories/delivery-note.repository.interface';
import { DeliveryNoteRepository } from 'src/infrastructure/database/typeorm/repositories/delivery-note.repository';
import type { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import type { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';
import { tNotFound } from 'src/core/common/i18n/messages';
import { SystemMasterService } from '../system-master/system-master.service';
import { DeliveryNoteTypes } from 'src/core/domain/value-objects/delivery-note-type.vo';

@Injectable()
export class DeliveryNoteService {
  constructor(
    private readonly createUseCase: CreateDeliveryNoteUseCase,
    private readonly updateUseCase: UpdateDeliveryNoteUseCase,
    private readonly approveUseCase: ApproveDeliveryNoteUseCase,
    @Inject(DELIVERY_NOTE_REPOSITORY) private readonly repo: DeliveryNoteRepository,
    private readonly createFullUseCase: CreateDeliveryNoteFullUseCase,
    private readonly findFullByIdUseCase: FindDeliveryNoteFullByIdUseCase,
    private readonly updateFullUseCase: UpdateDeliveryNoteFullUseCase,
    private readonly systemMasterService: SystemMasterService,
  ) {}

  async findTypes(lang?: string) {
    const list = await this.systemMasterService.findOptionsBySystemType(
      'DELIVERY_NOTE_TYPE',
      lang,
    );

    if (!list) {
      throw new NotFoundException(tNotFound('Surat Jalan', lang));
    }

    return list;
  }

  async findAllPaginated(start = 0, length = 10, _lang?: string) {
    const headers = await this.repo.findAllHeaders();
    const total = headers.length;
    const items = headers.slice(start, start + length);
    return { items, total };
  }

  async findAllByTypePaginated(deliveryNoteType: string, start = 0, length = 10, _lang?: string) {
    const headers = await this.repo.findAllByType(deliveryNoteType);
    const total = headers.length;
    const items = headers.slice(start, start + length);
    return { items, total };
  }

  async findOne(id: string, lang?: string) {
    const full = await this.findFullByIdUseCase.execute(id);
    if (!full) {
      throw new NotFoundException(tNotFound('Surat Jalan', lang));
    }
    return full;
  }

  async create(dto: CreateDeliveryNoteDto, _lang?: string) {
    const payload = {
      delivery_note_no: dto.delivery_note_no,
      delivery_note_date: dto.delivery_note_date,
      delivery_note_type: dto.delivery_note_type,
      vendor_id: dto.vendor_id,
      destination: dto.destination,
      status: dto.status,
      notes: dto.notes ?? null,
      user_id: dto.user_id ?? 'system',
      details: (dto.details || []).map((d: any) => ({
        spk_detail_id: d.spk_detail_id,
        item_type: d.item_type,
        product_variant_id: d.product_variant_id ?? null,
        material_id: d.material_id ?? null,
        qty_out: Number(d.qty_out ?? 0),
        qty_in: Number(d.qty_in ?? 0),
        labor_cost: Number(d.labor_cost ?? 0),
      })),
    };
    const created = await this.createFullUseCase.execute(payload);
    const full = await this.findFullByIdUseCase.execute(created.id);
    return full ?? { id: created.id, delivery_note_no: created.delivery_note_no };
  }

  async update(id: string, dto: UpdateDeliveryNoteDto, lang?: string) {
    const existing = await this.findFullByIdUseCase.execute(id);
    if (!existing) {
      throw new NotFoundException(tNotFound('Surat Jalan', lang));
    }
    const payload = {
      id,
      delivery_note_no: existing.delivery_note_no,
      delivery_note_date: dto.delivery_note_date ? new Date(dto.delivery_note_date) : existing.delivery_note_date,
      delivery_note_type: dto.delivery_note_type ?? existing.delivery_note_type,
      vendor_id: dto.vendor_id ?? existing.vendor_id,
      destination: dto.destination ?? existing.destination,
      status: dto.status ?? existing.status,
      notes: dto.notes ?? existing.notes ?? null,
      changed_by: dto.user_id ?? 'system',
      details: (dto.details || []).map((d: any) => ({
        spk_detail_id: d.spk_detail_id,
        item_type: d.item_type,
        product_variant_id: d.product_variant_id ?? null,
        material_id: d.material_id ?? null,
        qty_out: d.qty_out !== undefined ? Number(d.qty_out) : undefined,
        qty_in: d.qty_in !== undefined ? Number(d.qty_in) : undefined,
        labor_cost: d.labor_cost !== undefined ? Number(d.labor_cost) : undefined,
      })),
    };
    const updated = await this.updateFullUseCase.execute(payload);
    const full = await this.findFullByIdUseCase.execute(updated.id);
    return full ?? { id: updated.id, delivery_note_no: updated.delivery_note_no };
  }

  async generateDeliveryNoteNo(type: string): Promise<string> {
    if (!type) {
      throw new BadRequestException('Parameter "type" is required');
    }
    const typeDef = DeliveryNoteTypes.find((d) => d.type.toLocaleUpperCase() === type.toLocaleUpperCase());
    const code = typeDef?.code ?? type.toLocaleUpperCase();
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

    const all = await this.repo.findAll();
    const relevant = all
      .map((d) => d.delivery_note_no)
      .filter((no) => !!no)
      .filter((no) => {
        const parts = no.split('/');
        // Expected format: seq/SJ/{code}/{monthRoman}/{year}
        return (
          parts.length === 5 &&
          parts[1] === 'SJ' &&
          parts[2] === code &&
          parts[3] === monthRoman &&
          parts[4] === String(year)
        );
      });

    const lastSeq = relevant.reduce((max, no) => {
      const seqStr = no.split('/')[0];
      const seq = parseInt(seqStr, 10);
      return Number.isFinite(seq) && seq > max ? seq : max;
    }, 0);

    const nextSeq = lastSeq + 1;
    const nextSeqStr = String(nextSeq).padStart(3, '0');
    return `${nextSeqStr}/SJ/${code}/${monthRoman}/${year}`;
  }

  async approval(dto: ApprovalDeliveryNoteDto, _lang?: string) {
    const saved = await this.approveUseCase.execute({
      id: dto.id,
      status: dto.status as any,
      notes: dto.notes ?? null,
      user_id: dto.user_id ?? 'system',
    });
    const full = await this.findFullByIdUseCase.execute(saved.id);
    return full ?? { id: saved.id, delivery_note_no: saved.delivery_note_no, status: dto.status };
  }
}