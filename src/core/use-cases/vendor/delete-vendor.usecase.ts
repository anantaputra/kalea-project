import { VendorRepository } from '../../domain/repositories/vendor.repository.interface';

export class DeleteVendorUseCase {
  constructor(private readonly repo: VendorRepository) {}

  async execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
