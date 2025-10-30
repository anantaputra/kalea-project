import { Vendor } from '../entities/vendor.entity';

export interface VendorRepository {
  findById(id: string): Promise<Vendor | null>;
  findAll(): Promise<Vendor[]>;
  create(entity: Vendor): Promise<Vendor>;
  update(entity: Vendor): Promise<Vendor>;
  delete(id: string): Promise<void>;
}

export const VENDOR_REPOSITORY = Symbol('VendorRepository');
