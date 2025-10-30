import { MaterialsRepository } from '../../domain/repositories/material.repository.interface';
import { Materials } from '../../domain/entities/material.entity';

export class FindMaterialsByBarcodeUseCase {
  constructor(private readonly repo: MaterialsRepository) {}

  async execute(barcode: string): Promise<Materials | null> {
    return this.repo.findByBarcode(barcode);
  }
}