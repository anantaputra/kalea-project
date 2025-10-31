import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { SpkEntity } from '../entities/Spk.entity';
import type {
  SpkRepository as SpkRepositoryInterface,
  CreateSpkFullPayload,
  UpdateSpkFullPayload,
  SpkFullByIdResult,
} from '../../../../core/domain/repositories/spk.repository.interface';
import { Spk } from '../../../../core/domain/entities/spk.entity';
import { SpkDetailEntity } from '../entities/SpkDetail.entity';
import { SpkBomEntity } from '../entities/SpkBom.entity';
import { BomItemEntity } from '../entities/BomItem.entity';
import { SpkStageEntity } from '../entities/SpkStage.entity';
import { ProductVariantEntity } from '../entities/ProductVariant.entity';
import { MaterialEntity } from '../entities/Material.entity';

@Injectable()
export class SpkRepository implements SpkRepositoryInterface {
  constructor(
    @InjectRepository(SpkEntity)
    private readonly ormRepo: Repository<SpkEntity>,
    @InjectRepository(SpkDetailEntity)
    private readonly detailRepo: Repository<SpkDetailEntity>,
    @InjectRepository(SpkBomEntity)
    private readonly bomRepo: Repository<SpkBomEntity>,
    @InjectRepository(BomItemEntity)
    private readonly bomItemRepo: Repository<BomItemEntity>,
    @InjectRepository(SpkStageEntity)
    private readonly stageRepo: Repository<SpkStageEntity>,
  ) {}

  async findAll(): Promise<Spk[]> {
    const rows = await this.ormRepo.find();
    return rows.map((row) => this.mapToDomain(row));
  }

  async findById(id: string): Promise<Spk | null> {
    const row = await this.ormRepo.findOne({ where: { id } });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: Spk): Promise<Spk> {
    const row = this.mapToOrm(entity);
    const saved = await this.ormRepo.save(row);
    return this.mapToDomain(saved);
  }

  async update(entity: Spk): Promise<Spk> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  async createFull(payload: CreateSpkFullPayload): Promise<Spk> {
    return this.ormRepo.manager.transaction(async (mgr) => {
      const spkHeader = new SpkEntity();
      spkHeader.spk_no = payload.spk_no;
      spkHeader.buyer = payload.buyer;
      spkHeader.spk_date = payload.spk_date;
      spkHeader.deadline = payload.deadline;
      spkHeader.status = payload.status;
      spkHeader.notes = payload.notes ?? null;
      spkHeader.created_by = payload.created_by || 'system';
      const savedHeader = await mgr.getRepository(SpkEntity).save(spkHeader);

      // Akumulasi penggunaan material dari BOM untuk pengurangan stok
      const materialUsage = new Map<string, number>();

      for (const d of payload.details) {
        const detail = new SpkDetailEntity();
        detail.spk = savedHeader;
        const pv = new ProductVariantEntity();
        pv.id = d.product_variant_id;
        detail.product_variant = pv;
        detail.cost_price = Number(d.cost_price) || Number(pv.cost_price);
        detail.qty_order = Number(d.qty_order);
        detail.status = payload.status;
        detail.created_by = payload.created_by || 'system';
        const savedDetail = await mgr
          .getRepository(SpkDetailEntity)
          .save(detail);

        // Derive BOM requirements from master BOM items per product variant
        const bomItems = await mgr.getRepository(BomItemEntity).find({
          where: { product_variant: { id: d.product_variant_id } },
          relations: ['material'],
        });
        for (const bi of bomItems) {
          const bom = new SpkBomEntity();
          bom.spk_detail = savedDetail;
          const mat = new MaterialEntity();
          mat.id = bi.material.id;
          bom.material = mat;
          bom.qty_per_unit = Number(bi.qty_per_unit);
          const qtyOrder = Number(d.qty_order);
          // qty_required = qty_order * qty_per_unit (without waste factor)
          bom.qty_required = Number((bom.qty_per_unit * qtyOrder).toFixed(4));
          bom.waste_pct = Number(bi.waste_pct) || 0;
          bom.created_by = payload.created_by || 'system';
          await mgr.getRepository(SpkBomEntity).save(bom);

          // Akumulasi penggunaan untuk pengurangan stok material nanti
          const useQty = Number(bom.qty_required);
          const key = bi.material.id;
          materialUsage.set(key, Number((materialUsage.get(key) ?? 0) + useQty));
        }

        // Buat initial stages untuk setiap detail
        const initialStages: Array<{ stage_name: string; seq: number }> = [
          { stage_name: 'Cutting', seq: 1 },
          { stage_name: 'Jahit', seq: 2 },
          { stage_name: 'Buang Benang', seq: 3 },
          { stage_name: 'Stiman', seq: 4 },
          { stage_name: 'Packing', seq: 5 },
        ];
        for (const st of initialStages) {
          const stage = new SpkStageEntity();
          stage.spk_detail = savedDetail;
          stage.stage_name = st.stage_name;
          stage.seq = Number(st.seq);
          stage.qty_in = 0;
          stage.qty_reject = 0;
          stage.pic_id = payload.created_by || 'system';
          stage.status = 'PENDING';
          stage.created_by = payload.created_by || 'system';
          await mgr.getRepository(SpkStageEntity).save(stage);
        }
      }

      // Update stok material berdasarkan akumulasi BOM
      for (const [materialId, usedQty] of materialUsage.entries()) {
        const matRepo = mgr.getRepository(MaterialEntity);
        const materialRow = await matRepo.findOne({ where: { id: materialId } });
        if (!materialRow) {
          throw new Error(`Material not found: ${materialId}`);
        }
        const before = Number(materialRow.stock_qty ?? 0);
        const afterRaw = before - Number(usedQty);
        const after = Number(afterRaw.toFixed(2));
        if (after < 0) {
          throw new Error(`Stok material '${materialRow.material_name}' tidak mencukupi. Sisa: ${before}, butuh: ${usedQty}`);
        }
        materialRow.stock_qty = after;
        materialRow.changed_by = payload.created_by || 'system';
        materialRow.changed_dt = new Date();
        await matRepo.save(materialRow);
      }

      return this.mapToDomain(savedHeader);
    });
  }

  async updateFull(payload: UpdateSpkFullPayload): Promise<Spk> {
    return this.ormRepo.manager.transaction(async (mgr) => {
      // Update SPK header
      const spkHeader = await mgr.getRepository(SpkEntity).findOne({
        where: { id: payload.id },
      });
      if (!spkHeader) {
        throw new Error(`SPK not found: ${payload.id}`);
      }

      spkHeader.spk_no = payload.spk_no;
      spkHeader.buyer = payload.buyer;
      spkHeader.spk_date = payload.spk_date;
      spkHeader.deadline = payload.deadline;
      spkHeader.status = payload.status;
      spkHeader.notes = payload.notes ?? null;
      spkHeader.changed_by = payload.changed_by || 'system';
      spkHeader.changed_dt = new Date();
      const savedHeader = await mgr.getRepository(SpkEntity).save(spkHeader);

      // Delta penggunaan material dari BOM untuk penyesuaian stok
      const materialDelta = new Map<string, number>(); // new - old

      // Upsert detail berdasarkan kombinasi spk_id + product_variant_id, dan refresh BOM
      const existingDetails = await mgr.getRepository(SpkDetailEntity).find({
        where: { spk: { id: payload.id } },
        relations: ['product_variant'],
      });
      const detailByVariantId = new Map<string, SpkDetailEntity>();
      for (const ed of existingDetails) {
        const vid = ed.product_variant?.id;
        if (vid) detailByVariantId.set(vid, ed);
      }

      for (const d of payload.details) {
        const variantId = d.product_variant_id;
        const existing = detailByVariantId.get(variantId);

        if (existing) {
          // Update baris detail yang sudah ada
          existing.cost_price = Number(d.cost_price) || Number(existing.cost_price);
          existing.qty_order = Number(d.qty_order);
          existing.status = payload.status;
          existing.changed_by = payload.changed_by || 'system';
          existing.changed_dt = new Date();
          const savedDetail = await mgr.getRepository(SpkDetailEntity).save(existing);

          // Kumpulkan BOM lama (sebelum delete) untuk delta stok
          const oldBoms = await mgr.getRepository(SpkBomEntity).find({
            where: { spk_detail: { id: savedDetail.id } },
            relations: ['material'],
          });
          const oldUsageByMaterial = new Map<string, number>();
          for (const ob of oldBoms) {
            const key = ob.material.id;
            oldUsageByMaterial.set(key, Number((oldUsageByMaterial.get(key) ?? 0) + Number(ob.qty_required)));
          }

          // Refresh BOM: hapus BOM lama untuk detail ini dan buat ulang dari master BOM
          await mgr.getRepository(SpkBomEntity).delete({ spk_detail: { id: savedDetail.id } });

          const bomItems = await mgr.getRepository(BomItemEntity).find({
            where: { product_variant: { id: variantId } },
            relations: ['material'],
          });
          const newUsageByMaterial = new Map<string, number>();
          for (const bi of bomItems) {
            const bom = new SpkBomEntity();
            bom.spk_detail = savedDetail;
            const mat = new MaterialEntity();
            mat.id = bi.material.id;
            bom.material = mat;
            bom.qty_per_unit = Number(bi.qty_per_unit);
            const qtyOrder = Number(d.qty_order);
            bom.qty_required = Number((bom.qty_per_unit * qtyOrder).toFixed(4));
            bom.waste_pct = Number(bi.waste_pct) || 0;
            bom.created_by = payload.changed_by || 'system';
            await mgr.getRepository(SpkBomEntity).save(bom);

            const key = bi.material.id;
            newUsageByMaterial.set(key, Number((newUsageByMaterial.get(key) ?? 0) + Number(bom.qty_required)));
          }

          // Hitung delta (new - old) per material untuk detail ini
          const materialIds = new Set<string>([...oldUsageByMaterial.keys(), ...newUsageByMaterial.keys()]);
          for (const mid of materialIds) {
            const oldQty = Number(oldUsageByMaterial.get(mid) ?? 0);
            const newQty = Number(newUsageByMaterial.get(mid) ?? 0);
            materialDelta.set(mid, Number((materialDelta.get(mid) ?? 0) + (newQty - oldQty)));
          }
        } else {
          // Insert detail baru: validasi product_variant_id harus ada di master
          const pvRow = await mgr.getRepository(ProductVariantEntity).findOne({ where: { id: variantId } });
          if (!pvRow) {
            throw new Error(`Product variant not found: ${variantId}`);
          }

          const detail = new SpkDetailEntity();
          detail.spk = savedHeader;
          detail.product_variant = pvRow;
          detail.cost_price = Number(d.cost_price) || Number(pvRow.cost_price);
          detail.qty_order = Number(d.qty_order);
          detail.status = payload.status;
          detail.created_by = payload.changed_by || 'system';
          const savedDetail = await mgr.getRepository(SpkDetailEntity).save(detail);

          const bomItems = await mgr.getRepository(BomItemEntity).find({
            where: { product_variant: { id: variantId } },
            relations: ['material'],
          });
          const newUsageByMaterial = new Map<string, number>();
          for (const bi of bomItems) {
            const bom = new SpkBomEntity();
            bom.spk_detail = savedDetail;
            const mat = new MaterialEntity();
            mat.id = bi.material.id;
            bom.material = mat;
            bom.qty_per_unit = Number(bi.qty_per_unit);
            const qtyOrder = Number(d.qty_order);
            bom.qty_required = Number((bom.qty_per_unit * qtyOrder).toFixed(4));
            bom.waste_pct = Number(bi.waste_pct) || 0;
            bom.created_by = payload.changed_by || 'system';
            await mgr.getRepository(SpkBomEntity).save(bom);

            const key = bi.material.id;
            newUsageByMaterial.set(key, Number((newUsageByMaterial.get(key) ?? 0) + Number(bom.qty_required)));
          }

          // Untuk detail baru, oldQty = 0, delta = newQty
          for (const [mid, newQty] of newUsageByMaterial.entries()) {
            materialDelta.set(mid, Number((materialDelta.get(mid) ?? 0) + Number(newQty)));
          }
        }
      }

      // Terapkan delta ke stok material: stock = stock - (new - old)
      for (const [materialId, deltaQty] of materialDelta.entries()) {
        const matRepo = mgr.getRepository(MaterialEntity);
        const materialRow = await matRepo.findOne({ where: { id: materialId } });
        if (!materialRow) {
          throw new Error(`Material not found: ${materialId}`);
        }
        const before = Number(materialRow.stock_qty ?? 0);
        const afterRaw = before - Number(deltaQty);
        const after = Number(afterRaw.toFixed(2));
        if (after < 0) {
          throw new Error(`Stok material '${materialRow.material_name}' tidak mencukupi. Sisa: ${before}, perubahan kebutuhan: ${deltaQty}`);
        }
        materialRow.stock_qty = after;
        materialRow.changed_by = payload.changed_by || 'system';
        materialRow.changed_dt = new Date();
        await matRepo.save(materialRow);
      }

      return this.mapToDomain(savedHeader);
    });
  }

  async findFullById(id: string): Promise<SpkFullByIdResult | null> {
    const headerRow = await this.ormRepo.findOne({ where: { id } });
    if (!headerRow) return null;
    const header = this.mapToDomain(headerRow);

    const details = await this.detailRepo.find({
      where: { spk: { id } },
      relations: ['product_variant'],
    });

    const detailResults = [] as SpkFullByIdResult['details'];
    for (const d of details) {
      const boms = await this.bomRepo.find({
        where: { spk_detail: { id: d.id } },
        relations: ['material'],
      });
      const stages = await this.stageRepo.find({
        where: { spk_detail: { id: d.id } },
        relations: { spk_detail: true },
        order: { seq: 'ASC', created_dt: 'DESC' },
      });
      detailResults.push({
        id: d.id,
        product_variants: {
          id: d.product_variant?.id || '',
          product_name: d.product_variant?.product_name || '',
          size: d.product_variant?.size || '',
          color: d.product_variant?.color ?? null,
          barcode: d.product_variant?.barcode ?? null,
          sku: d.product_variant?.sku ?? null,
          price: Number(d.product_variant?.price ?? 0),
          cost_price: Number(d.cost_price ?? d.product_variant?.cost_price ?? 0),
        },
        qty_order: Number(d.qty_order),
        qty_done: Number(d.qty_done),
        qty_reject: Number(d.qty_reject),
        progress: (() => {
          const order = Number(d.qty_order) || 0;
          const done = Number(d.qty_done) || 0;
          const pct = order > 0 ? Math.round((done / order) * 100) : 0;
          return `${pct}%`;
        })(),
        status: d.status,
        cost_price: Number(d.cost_price ?? 0),
        bom: boms.map((b) => ({
          id: b.id,
          material_id: b.material?.id || '',
          material_name: b.material?.material_name ?? '',
          unit_of_measure: b.material?.unit_of_measure ?? '',
          qty_per_unit: Number(b.qty_per_unit),
          qty_required: Number(b.qty_required),
          waste_pct: Number(b.waste_pct ?? 0),
        })),
        // stages: stages.map((s) => ({
        //   id: s.id,
        //   spk_detail_id: s.spk_detail?.id ?? '',
        //   stage_name: s.stage_name,
        //   seq: Number(s.seq),
        //   qty_in: Number(s.qty_in ?? 0),
        //   qty_reject: Number(s.qty_reject ?? 0),
        //   pic_id: s.pic_id,
        //   start_at: s.start_at,
        //   end_at: s.end_at,
        //   status: s.status,
        //   created_by: s.created_by,
        //   created_dt: s.created_dt,
        //   changed_by: s.changed_by ?? null,
        //   changed_dt: s.changed_dt ?? null,
        // })),
      });
    }

    return { header, details: detailResults };
  }

  private mapToDomain(row: SpkEntity): Spk {
    return new Spk(
      row.id,
      row.spk_no,
      row.buyer,
      row.spk_date,
      row.deadline,
      row.status,
      row.notes ?? null,
      row.created_by,
      row.created_dt,
      row.changed_by ?? null,
      row.changed_dt,
    );
  }

  private mapToOrm(entity: Spk): SpkEntity {
    const row = new SpkEntity();
    if (entity.id) row.id = entity.id;
    row.spk_no = entity.spk_no;
    row.buyer = entity.buyer;
    row.spk_date = entity.spk_date;
    row.deadline = entity.deadline;
    row.status = entity.status;
    row.notes = entity.notes ?? null;
    if (entity.created_by !== undefined)
      row.created_by = entity.created_by || 'system';
    if (entity.created_dt !== undefined) row.created_dt = entity.created_dt;
    if (entity.changed_by !== undefined)
      row.changed_by = entity.changed_by ?? null;
    if (entity.changed_dt !== undefined) row.changed_dt = entity.changed_dt;
    return row;
  }

  async createStage(payload: {
    spk_detail_id: string;
    stage_name: string;
    seq: number;
    qty_in?: number;
    qty_reject?: number;
    pic_id: string;
    start_at?: Date;
    end_at?: Date;
    status: string;
    created_by?: string;
  }): Promise<{ id: string }> {
    return this.ormRepo.manager.transaction(async (mgr) => {
      const repo = mgr.getRepository(SpkStageEntity);
      const stage = new SpkStageEntity();
      // Ensure referenced SpkDetail exists to avoid FK violation
      const detail = await mgr
        .getRepository(SpkDetailEntity)
        .findOne({ where: { id: payload.spk_detail_id } });
      if (!detail) {
        throw new Error(`SPK Detail not found: ${payload.spk_detail_id}`);
      }
      // Geser stage yang memiliki seq >= target secara descending untuk hindari konflik unik
      const targetSeq = Number(payload.seq);
      const toShift = await repo.find({
        where: { spk_detail: { id: payload.spk_detail_id }, seq: MoreThanOrEqual(targetSeq) },
        order: { seq: 'DESC' },
        relations: { spk_detail: true },
      });
      for (const s of toShift) {
        s.seq = Number(s.seq) + 1;
        await repo.save(s);
      }
      stage.spk_detail = detail;
      stage.stage_name = payload.stage_name;
      stage.seq = Number(payload.seq);
      stage.qty_in = Number(payload.qty_in || 0);
      stage.qty_reject = Number(payload.qty_reject || 0);
      stage.pic_id = payload.pic_id;
      stage.start_at = payload.start_at || new Date();
      stage.end_at = payload.end_at || new Date();
      stage.status = payload.status;
      stage.created_by = payload.created_by || 'system';
      const saved = await repo.save(stage);
      return { id: saved.id };
    });
  }

  async updateStage(payload: {
    id: string;
    stage_name?: string;
    seq?: number;
    qty_in?: number;
    qty_reject?: number;
    pic_id?: string;
    start_at?: Date;
    end_at?: Date;
    status?: string;
    changed_by?: string;
  }): Promise<{ id: string }> {
    return this.ormRepo.manager.transaction(async (mgr) => {
      const repo = mgr.getRepository(SpkStageEntity);
      const stage = await repo.findOne({ where: { id: payload.id }, relations: { spk_detail: true } });
      if (!stage) throw new Error(`SPK Stage not found: ${payload.id}`);

      // If seq is being changed, ensure uniqueness within the same spk_detail
      if (payload.seq != null) {
        const dupSeq = await repo.findOne({
          where: { spk_detail: { id: stage.spk_detail.id }, seq: Number(payload.seq) },
          relations: { spk_detail: true },
        });
        if (dupSeq && dupSeq.id !== stage.id) {
          throw new Error(`Seq sudah digunakan pada SPK Detail tersebut`);
        }
      }

      if (payload.stage_name != null) stage.stage_name = payload.stage_name;
      if (payload.seq != null) stage.seq = Number(payload.seq);
      if (payload.qty_in != null) stage.qty_in = Number(payload.qty_in);
      if (payload.qty_reject != null)
        stage.qty_reject = Number(payload.qty_reject);
      if (payload.pic_id != null) stage.pic_id = payload.pic_id;
      if (payload.start_at) stage.start_at = payload.start_at;
      if (payload.end_at) stage.end_at = payload.end_at;
      if (payload.status != null) stage.status = payload.status;
      stage.changed_by = payload.changed_by || 'system';
      stage.changed_dt = new Date();

      const saved = await repo.save(stage);
      return { id: saved.id };
    });
  }
}