import { BomItemRepository } from '../../domain/repositories/bom-item.repository.interface';

export class DeleteBomItemUseCase {
  constructor(private readonly repo: BomItemRepository) {}

  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
