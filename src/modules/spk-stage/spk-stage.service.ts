import { Injectable } from '@nestjs/common';
import { CreateSpkStageUseCase, UpdateSpkStageUseCase } from '../../core/use-cases/spk';
import type { CreateSpkStageDto } from './dto/create-spk-stage.dto';
import type { UpdateSpkStageDto } from './dto/update-spk-stage.dto';

@Injectable()
export class SpkStageService {
  constructor(
    private readonly createUseCase: CreateSpkStageUseCase,
    private readonly updateUseCase: UpdateSpkStageUseCase,
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
}