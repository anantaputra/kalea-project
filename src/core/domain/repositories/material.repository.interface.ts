import { Materials } from '../entities/material.entity';

export interface MaterialsRepository {
  findById(id: string): Promise<Materials | null>;
  findAll(): Promise<Materials[]>;
  findAllPaginated(start: number, length: number): Promise<{ items: Materials[]; total: number }>;
  findByBarcode(barcode: string): Promise<Materials | null>;
  create(entity: Materials): Promise<Materials>;
  update(entity: Materials): Promise<Materials>;
  delete(id: string): Promise<void>;
}

export const MATERIALS_REPOSITORY = Symbol('MaterialsRepository');