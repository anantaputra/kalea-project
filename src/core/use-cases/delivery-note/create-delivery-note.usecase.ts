import { DeliveryNoteRepository } from '../../domain/repositories/delivery-note.repository.interface';
import { DeliveryNote } from '../../domain/entities/delivery-note.entity';

export class CreateDeliveryNoteUseCase {
  constructor(private readonly repo: DeliveryNoteRepository) {}

  async execute(entity: DeliveryNote): Promise<DeliveryNote> {
    return this.repo.create(entity);
  }
}
