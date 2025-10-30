import { VendorRepository } from '../../domain/repositories/vendor.repository.interface';
import { Vendor } from '../../domain/entities/vendor.entity';

export class CreateVendorUseCase {
  constructor(private readonly repo: VendorRepository) {}

  async execute(entity: Vendor): Promise<Vendor> {
    return this.repo.create(entity);
  }
}
