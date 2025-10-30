import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalTransactionEntity } from '../entities/ApprovalTransaction.entity';
import type {
  ApprovalRepository as ApprovalRepositoryInterface,
  CreateApprovalTransactionPayload,
} from '../../../../core/domain/repositories/approval.repository.interface';

@Injectable()
export class ApprovalRepository implements ApprovalRepositoryInterface {
  constructor(
    @InjectRepository(ApprovalTransactionEntity)
    private readonly ormRepo: Repository<ApprovalTransactionEntity>,
  ) {}

  async create(payload: CreateApprovalTransactionPayload): Promise<{ approval_id: string }> {
    const row = new ApprovalTransactionEntity();
    row.module = payload.module;
    row.ref_id = payload.ref_id;
    row.status = payload.status as any; // rely on DB enum
    row.notes = payload.notes ?? null;
    row.created_by = payload.created_by || 'system';
    const saved = await this.ormRepo.save(row);
    return { approval_id: saved.approval_id };
  }
}