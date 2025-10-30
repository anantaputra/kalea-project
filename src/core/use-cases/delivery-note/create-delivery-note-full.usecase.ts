import { DeliveryNote } from '../../domain/entities/delivery-note.entity';
import {
  DeliveryNoteRepository,
  CreateDeliveryNoteFullPayload,
} from '../../domain/repositories/delivery-note.repository.interface';

export class CreateDeliveryNoteFullUseCase {
  constructor(private readonly repo: DeliveryNoteRepository) {}

  async execute(payload: CreateDeliveryNoteFullPayload): Promise<DeliveryNote> {
    return this.repo.createFull(payload);
  }
}
