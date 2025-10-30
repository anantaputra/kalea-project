import type {
  DeliveryNoteFullByIdResult,
  DeliveryNoteRepository,
} from '../../domain/repositories/delivery-note.repository.interface';

export class FindDeliveryNoteFullByIdUseCase {
  constructor(private readonly repo: DeliveryNoteRepository) {}

  async execute(id: string): Promise<DeliveryNoteFullByIdResult | null> {
    return this.repo.findFullById(id);
  }
}
