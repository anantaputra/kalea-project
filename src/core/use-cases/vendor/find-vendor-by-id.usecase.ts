import { VendorRepository } from '../../domain/repositories/vendor.repository.interface';
import { Vendor } from '../../domain/entities/vendor.entity';

export class FindVendorByIdUseCase {
  constructor(private readonly repo: VendorRepository) {}

  async execute(id: string): Promise<Vendor | null> {
    return this.repo.findById(id);
  }
}
