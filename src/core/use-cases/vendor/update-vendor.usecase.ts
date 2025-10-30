import { VendorRepository } from '../../domain/repositories/vendor.repository.interface';
import { Vendor } from '../../domain/entities/vendor.entity';

export class UpdateVendorUseCase {
  constructor(private readonly repo: VendorRepository) {}

  async execute(entity: Vendor): Promise<Vendor> {
    return this.repo.update(entity);
  }
}
