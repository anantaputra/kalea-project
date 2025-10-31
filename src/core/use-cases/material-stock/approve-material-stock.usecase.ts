import { ApprovalRepository } from '../../domain/repositories/approval.repository.interface';
import { MaterialStockRepository } from '../../domain/repositories/material-stock.repository.interface';
import { MaterialsRepository } from '../../domain/repositories/material.repository.interface';
import { Materials } from '../../domain/entities/material.entity';

export type ApproveMaterialStockPayload = {
  id: string; // MaterialStock id
  status: 'APPROVED' | 'REJECTED';
  notes?: string | null;
  user_id?: string;
};

export class ApproveMaterialStockUseCase {
  constructor(
    private readonly approvalRepo: ApprovalRepository,
    private readonly msRepo: MaterialStockRepository,
    private readonly materialsRepo: MaterialsRepository,
  ) {}

  async execute(payload: ApproveMaterialStockPayload): Promise<Materials> {
    const stock = await this.msRepo.findById(payload.id);
    if (!stock) {
      throw new Error(`Material Stock not found: ${payload.id}`);
    }
    if (!stock.material_id) {
      throw new Error('Material Stock missing material_id');
    }

    await this.approvalRepo.create({
      module: 'material_stock',
      ref_id: payload.id,
      status: payload.status,
      notes: payload.notes ?? null,
      created_by: payload.user_id || 'system',
    });

    const existingMaterial = await this.materialsRepo.findById(stock.material_id);
    if (!existingMaterial) {
      throw new Error(`Material not found: ${stock.material_id}`);
    }

    // Only update stock when approved; on rejected, keep as is
    const newStockQty = payload.status === 'APPROVED'
      ? Number((existingMaterial.stock_qty ?? 0) + (stock.qty ?? 0))
      : Number(existingMaterial.stock_qty ?? 0);

    const updated = new Materials(
      existingMaterial.id,
      existingMaterial.material_code,
      existingMaterial.material_name,
      existingMaterial.barcode,
      existingMaterial.material_category,
      existingMaterial.unit_of_measure,
      newStockQty,
      existingMaterial.is_active ?? true,
      existingMaterial.created_by,
      existingMaterial.created_dt,
      payload.user_id ?? existingMaterial.changed_by ?? 'system',
      new Date(),
    );

    const saved = await this.materialsRepo.update(updated);

    // Update flag is_approved on material stock based on approval status
    const stockApproved = payload.status === 'APPROVED';
    await this.msRepo.update({
      id: stock.id,
      material_id: stock.material_id,
      qty: stock.qty,
      is_approved: stockApproved,
      created_by: stock.created_by,
      created_dt: stock.created_dt,
      changed_by: payload.user_id || 'system',
      changed_dt: new Date(),
    });

    return saved;
  }
}