import type { UpdateDeliveryNoteFullPayload } from '../../domain/repositories/delivery-note.repository.interface';
import { DeliveryNoteRepository } from '../../domain/repositories/delivery-note.repository.interface';
import { DeliveryNote } from '../../domain/entities/delivery-note.entity';

export class UpdateDeliveryNoteFullUseCase {
  constructor(private readonly repo: DeliveryNoteRepository) {}

  async execute(payload: UpdateDeliveryNoteFullPayload): Promise<DeliveryNote> {
    return this.repo.updateFull(payload);
  }
}