import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpkStageUseCase, UpdateSpkStageUseCase } from '../../core/use-cases/spk';
import type { CreateSpkStageDto } from './dto/create-spk-stage.dto';
import type { UpdateSpkStageDto } from './dto/update-spk-stage.dto';
import { SpkStageEntity } from '../../infrastructure/database/typeorm/entities/SpkStage.entity';
import { SpkDetailEntity } from '../../infrastructure/database/typeorm/entities/SpkDetail.entity';
import type { ApprovalSpkDto } from '../spk/dto/approval-spk.dto';
import type { ApprovalRepository } from '../../core/domain/repositories/approval.repository.interface';
import { APPROVAL_REPOSITORY } from '../../core/domain/repositories/approval.repository.interface';
import { tNotFound } from '../../core/common/i18n/messages';

@Injectable()
export class SpkStageService {
  constructor(
    private readonly createUseCase: CreateSpkStageUseCase,
    private readonly updateUseCase: UpdateSpkStageUseCase,
    @InjectRepository(SpkStageEntity)
    private readonly stageRepo: Repository<SpkStageEntity>,
    @InjectRepository(SpkDetailEntity)
    private readonly detailRepo: Repository<SpkDetailEntity>,
    @Inject(APPROVAL_REPOSITORY)
    private readonly approvalRepo: ApprovalRepository,
  ) {}

  findAll(_filter?: { spk_detail_id?: string }) {
    // TODO: implement list use-case if needed
    return [];
  }

  findById(id: string) {
    // TODO: implement get-by-id use-case if needed
    return { id };
  }

  async create(dto: CreateSpkStageDto, lang?: string) {
    const payload = {
      spk_detail_id: dto.spk_detail_id,
      stage_name: dto.stage_name,
      seq: dto.seq, // Already transformed to number by @Type(() => Number)
      qty_in: dto.qty_in, // Already transformed to number by @Type(() => Number)
      qty_reject: dto.qty_reject, // Already transformed to number by @Type(() => Number)
      pic_id: dto.pic_id,
      start_at: dto.start_at ? new Date(dto.start_at) : undefined,
      end_at: dto.end_at ? new Date(dto.end_at) : undefined,
      status: dto.status,
      created_by: dto.user_id ?? 'system',
    };
    return this.createUseCase.execute(payload);
  }

  async update(id: string, dto: UpdateSpkStageDto, lang?: string) {
    const payload = {
      id,
      stage_name: dto.stage_name,
      seq: dto.seq, // Already transformed to number by @Type(() => Number) in PartialType
      qty_in: dto.qty_in, // Already transformed to number by @Type(() => Number) in PartialType
      qty_reject: dto.qty_reject, // Already transformed to number by @Type(() => Number) in PartialType
      pic_id: dto.pic_id,
      start_at: dto.start_at ? new Date(dto.start_at) : undefined,
      end_at: dto.end_at ? new Date(dto.end_at) : undefined,
      status: dto.status,
      changed_by: dto.user_id ?? 'system',
    };
    return this.updateUseCase.execute(payload);
  }

  delete(id: string) {
    // TODO: implement delete use-case if needed
    return { id };
  }

  async findStageSpkDetail(id: string) {
    const stages = await this.stageRepo.find({
      where: { spk_detail: { id } },
      relations: { spk_detail: true },
      order: { seq: 'ASC' },
    });

    return stages.map((s) => ({
      id: s.id,
      spk_detail_id: s.spk_detail?.id ?? '',
      stage_name: s.stage_name,
      seq: Number(s.seq ?? 0),
      qty_in: Number(s.qty_in ?? 0),
      qty_reject: Number(s.qty_reject ?? 0),
      pic_id: s.pic_id,
      start_at: s.start_at,
      end_at: s.end_at,
      status: s.status,
      status_approval: s.status_approval ?? null,
      status_approved: s.is_approved ? (s.status_approval ?? 'APPROVED') : 'WAITING APPROVAL',
      created_by: s.created_by,
      created_dt: s.created_dt,
      changed_by: s.changed_by ?? null,
      changed_dt: s.changed_dt ?? null,
    }));
  }

  async findStageSpkDetailNotApproved(id: string) {
    const stages = await this.stageRepo.find({
      where: { spk_detail: { id }, is_approved: false },
      relations: { spk_detail: true },
      order: { seq: 'ASC' },
    });

    return stages.map((s) => ({
      id: s.id,
      spk_detail_id: s.spk_detail?.id ?? '',
      stage_name: s.stage_name,
      seq: Number(s.seq ?? 0),
      qty_in: Number(s.qty_in ?? 0),
      qty_reject: Number(s.qty_reject ?? 0),
      pic_id: s.pic_id,
      start_at: s.start_at,
      end_at: s.end_at,
      status: s.status,
      is_approved: !!s.is_approved,
      status_approval: s.status_approval ?? null,
      status_approved: s.is_approved ? (s.status_approval ?? 'APPROVED') : 'WAITING APPROVAL',
      created_by: s.created_by,
      created_dt: s.created_dt,
      changed_by: s.changed_by ?? null,
      changed_dt: s.changed_dt ?? null,
    }));
  }

  async findStagesByStatusMenungguPersetujuan() {
    const stages = await this.stageRepo.find({
      where: { 
        status: 'MENUNGGU_PERSETUJUAN'
      },
      relations: { 
        spk_detail: {
          spk: true,
          product_variant: true
        }
      },
      order: { seq: 'ASC' },
    });

    return stages.map((s) => ({
      id: s.id,
      stage_name: s.stage_name,
      spk: s.spk_detail?.spk ? {
        id: s.spk_detail.spk.id,
        spk_no: s.spk_detail.spk.spk_no,
        buyer: s.spk_detail.spk.buyer,
        spk_date: s.spk_detail.spk.spk_date,
        deadline: s.spk_detail.spk.deadline,
        status: s.spk_detail.spk.status,
        notes: s.spk_detail.spk.notes,
        created_by: s.spk_detail.spk.created_by,
        created_dt: s.spk_detail.spk.created_dt,
        changed_by: s.spk_detail.spk.changed_by,
        changed_dt: s.spk_detail.spk.changed_dt,
      } : null,
      product_variant: s.spk_detail?.product_variant ? {
        id: s.spk_detail.product_variant.id,
        product_name: s.spk_detail.product_variant.product_name,
        size: s.spk_detail.product_variant.size,
        color: s.spk_detail.product_variant.color,
        barcode: s.spk_detail.product_variant.barcode,
        sku: s.spk_detail.product_variant.sku,
        price: Number(s.spk_detail.product_variant.price).toFixed(2),
        cost_price: Number(s.spk_detail.product_variant.cost_price).toFixed(2),
      } : null,
      seq: Number(s.seq ?? 0),
      qty_in: Number(s.qty_in ?? 0),
      qty_reject: Number(s.qty_reject ?? 0),
      pic_id: s.pic_id,
      start_at: s.start_at,
      end_at: s.end_at,
      status: s.status,
      created_by: s.created_by,
      created_dt: s.created_dt,
      changed_by: s.changed_by ?? null,
      changed_dt: s.changed_dt ?? null,
    }));
  }

  async approval(dto: ApprovalSpkDto, _lang?: string) {
    const stage = await this.stageRepo.findOne({ where: { id: dto.id }, relations: { spk_detail: true } });
    if (!stage) {
      throw new NotFoundException(tNotFound('SPK Stage', _lang));
    }

    await this.approvalRepo.create({
      module: 'spk_stage',
      ref_id: dto.id,
      status: dto.status,
      notes: dto.notes ?? null,
      created_by: dto.user_id || 'system',
    });

    const approved = dto.status === 'APPROVED';
    stage.status = dto.status;
    stage.is_approved = approved;
    stage.status_approval = dto.status;
    stage.changed_by = dto.user_id || 'system';
    stage.changed_dt = new Date();
    const saved = await this.stageRepo.save(stage);

    // Jika stage yang di-approve adalah stage terakhir (max seq) pada spk_detail yang sama,
    // maka update qty_done = qty_in dari stage max(seq) dan qty_reject SpkDetail = total qty_reject dari semua stage.
    if (approved && saved.spk_detail?.id) {
      const lastStage = await this.stageRepo.findOne({
        where: { spk_detail: { id: saved.spk_detail.id } },
        order: { seq: 'DESC' },
      });

      if (lastStage && lastStage.id === saved.id) {
        const detail = await this.detailRepo.findOne({ where: { id: saved.spk_detail.id } });
        if (detail) {
          // qty_done di SpkDetail diisi dengan qty_in dari stage terakhir
          detail.qty_done = Number(lastStage.qty_in ?? 0);
          // qty_reject di SpkDetail diakumulasi dari seluruh stage pada spk_detail yang sama
          const allStages = await this.stageRepo.find({ where: { spk_detail: { id: saved.spk_detail.id } } });
          const totalReject = allStages.reduce((acc, s) => acc + Number(s.qty_reject ?? 0), 0);
          detail.qty_reject = Number(totalReject);
          // Jika qty_in last stage + totalReject sama dengan qty_order, tandai DONE
          const qtyOrder = Number(detail.qty_order ?? 0);
          const sumCompleted = Number(lastStage.qty_in ?? 0) + Number(totalReject);
          if (sumCompleted === qtyOrder) {
            detail.status = 'DONE';
          }
          detail.changed_by = dto.user_id || 'system';
          detail.changed_dt = new Date();
          await this.detailRepo.save(detail);
        }
      }
    }

    return {
      id: saved.id,
      spk_detail_id: saved.spk_detail?.id ?? '',
      stage_name: saved.stage_name,
      seq: Number(saved.seq ?? 0),
      qty_in: Number(saved.qty_in ?? 0),
      qty_reject: Number(saved.qty_reject ?? 0),
      pic_id: saved.pic_id,
      start_at: saved.start_at,
      end_at: saved.end_at,
      status: saved.status,
      is_approved: !!saved.is_approved,
      status_approval: saved.status_approval ?? null,
      status_approved: saved.is_approved ? (saved.status_approval ?? 'APPROVED') : 'WAITING APPROVAL',
      created_by: saved.created_by,
      created_dt: saved.created_dt,
      changed_by: saved.changed_by ?? null,
      changed_dt: saved.changed_dt ?? null,
    };
  }
}