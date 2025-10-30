import { ApprovalRepository } from '../../domain/repositories/approval.repository.interface';
import { DeliveryNoteRepository } from '../../domain/repositories/delivery-note.repository.interface';
import { DeliveryNote } from '../../domain/entities/delivery-note.entity';

export type ApproveDeliveryNotePayload = {
  id: string; // Delivery Note id
  status: 'APPROVED' | 'REJECTED';
  notes?: string | null;
  user_id?: string;
};

export class ApproveDeliveryNoteUseCase {
  constructor(
    private readonly approvalRepo: ApprovalRepository,
    private readonly dnRepo: DeliveryNoteRepository,
  ) {}

  async execute(payload: ApproveDeliveryNotePayload): Promise<DeliveryNote> {
    const existing = await this.dnRepo.findById(payload.id);
    if (!existing) {
      throw new Error(`Delivery Note not found: ${payload.id}`);
    }

    await this.approvalRepo.create({
      module: 'delivery_note',
      ref_id: payload.id,
      status: payload.status,
      notes: payload.notes ?? null,
      created_by: payload.user_id || 'system',
    });

    const saved = await this.dnRepo.updateStatus({
      id: payload.id,
      status: payload.status,
      changed_by: payload.user_id || 'system',
    });
    return saved;
  }
}