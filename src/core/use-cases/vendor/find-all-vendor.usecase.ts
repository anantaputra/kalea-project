import { VendorRepository } from '../../domain/repositories/vendor.repository.interface';
import { Vendor } from '../../domain/entities/vendor.entity';

export class FindAllVendorUseCase {
  constructor(private readonly repo: VendorRepository) {}

  async execute(): Promise<Vendor[]> {
    return this.repo.findAll();
  }
}
