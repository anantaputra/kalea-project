import { ApprovalRepository } from '../../domain/repositories/approval.repository.interface';
import { SpkRepository } from '../../domain/repositories/spk.repository.interface';
import { Spk } from '../../domain/entities/spk.entity';

export type ApproveSpkPayload = {
  id: string; // SPK id
  status: 'APPROVED' | 'REJECTED';
  notes?: string | null;
  user_id?: string;
};

export class ApproveSpkUseCase {
  constructor(
    private readonly approvalRepo: ApprovalRepository,
    private readonly spkRepo: SpkRepository,
  ) {}

  async execute(payload: ApproveSpkPayload): Promise<Spk> {
    const existing = await this.spkRepo.findById(payload.id);
    if (!existing) {
      throw new Error(`SPK not found: ${payload.id}`);
    }

    await this.approvalRepo.create({
      module: 'SPK',
      ref_id: payload.id,
      status: payload.status,
      notes: payload.notes ?? null,
      created_by: payload.user_id || 'system',
    });

    const updatedHeader = new Spk(
      existing.id,
      existing.spk_no,
      existing.buyer,
      existing.spk_date,
      existing.deadline,
      payload.status,
      existing.notes,
      existing.created_by,
      existing.created_dt,
      payload.user_id ?? 'system',
      new Date(),
    );

    const saved = await this.spkRepo.update(updatedHeader);
    return saved;
  }
}