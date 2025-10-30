import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  DeliveryNoteRepository as DeliveryNoteRepositoryInterface,
  DeliveryNoteFullByIdResult,
} from '../../../../core/domain/repositories/delivery-note.repository.interface';
import { DeliveryNote } from '../../../../core/domain/entities/delivery-note.entity';
import { DeliveryNoteDetailEntity } from '../entities/DeliveryNoteDetail.entity';
import { VendorEntity } from '../entities/Vendor.entity';
import { SpkDetailEntity } from '../entities/SpkDetail.entity';
import { SpkEntity } from '../entities/Spk.entity';
import type { CreateDeliveryNoteFullPayload } from '../../../../core/domain/repositories/delivery-note.repository.interface';
import type { UpdateDeliveryNoteFullPayload } from '../../../../core/domain/repositories/delivery-note.repository.interface';
import { DeliveryNoteEntity } from '../entities/DeliveryNote.entity';

@Injectable()
export class DeliveryNoteRepository implements DeliveryNoteRepositoryInterface {
  constructor(
    @InjectRepository(DeliveryNoteEntity)
    private readonly ormRepo: Repository<DeliveryNoteEntity>,
  ) {}

  async findAll(): Promise<DeliveryNote[]> {
    const rows = await this.ormRepo.find();
    return rows.map((row) => this.mapToDomain(row));
  }

  async findAllHeaders(): Promise<import('../../../../core/domain/repositories/delivery-note.repository.interface').DeliveryNoteHeader[]> {
    const rows = await this.ormRepo.find({ relations: ['vendor'] });
    const mapDate = (d: any): string => {
      if (!d) return '';
      if (d instanceof Date) return d.toISOString().split('T')[0];
      if (typeof d === 'string') return d; // assume YYYY-MM-DD
      try {
        const parsed = new Date(d);
        return Number.isNaN(parsed.getTime())
          ? ''
          : parsed.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };
    return rows.map((header) => ({
      id: header.id,
      delivery_note_no: header.delivery_note_no,
      delivery_note_date: mapDate(header.delivery_note_date as any),
      delivery_note_type: header.delivery_note_type,
      vendor: header.vendor
        ? {
            id: header.vendor.id,
            name: header.vendor.name,
            contact_person: header.vendor.contact_person ?? null,
            phone: header.vendor.phone ?? null,
            email: header.vendor.email ?? null,
            address: header.vendor.address ?? null,
            city: header.vendor.city ?? null,
            province: header.vendor.province ?? null,
            country: header.vendor.country ?? null,
            zip_code: header.vendor.zip_code ?? null,
            tax_number: header.vendor.tax_number ?? null,
          }
        : null,
      destination: header.destination,
      status: header.status,
      notes: header.notes ?? null,
    }));
  }

  async findAllByType(deliveryNoteType: string): Promise<import('../../../../core/domain/repositories/delivery-note.repository.interface').DeliveryNoteHeader[]> {
    const rows = await this.ormRepo.find({ 
      where: { delivery_note_type: deliveryNoteType },
      relations: ['vendor'] 
    });
    const mapDate = (d: any): string => {
      if (!d) return '';
      if (d instanceof Date) return d.toISOString().split('T')[0];
      if (typeof d === 'string') return d; // assume YYYY-MM-DD
      try {
        const parsed = new Date(d);
        return Number.isNaN(parsed.getTime())
          ? ''
          : parsed.toISOString().split('T')[0];
      } catch {
        return '';
      }
    };
    return rows.map((header) => ({
      id: header.id,
      delivery_note_no: header.delivery_note_no,
      delivery_note_date: mapDate(header.delivery_note_date as any),
      delivery_note_type: header.delivery_note_type,
      vendor: header.vendor
        ? {
            id: header.vendor.id,
            name: header.vendor.name,
            contact_person: header.vendor.contact_person ?? null,
            phone: header.vendor.phone ?? null,
            email: header.vendor.email ?? null,
            address: header.vendor.address ?? null,
            city: header.vendor.city ?? null,
            province: header.vendor.province ?? null,
            country: header.vendor.country ?? null,
            zip_code: header.vendor.zip_code ?? null,
            tax_number: header.vendor.tax_number ?? null,
          }
        : null,
      destination: header.destination,
      status: header.status,
      notes: header.notes ?? null,
    }));
  }

  async findById(id: string): Promise<DeliveryNote | null> {
    const row = await this.ormRepo.findOne({ where: { id } });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: DeliveryNote): Promise<DeliveryNote> {
    const row = this.mapToOrm(entity);
    const saved = await this.ormRepo.save(row);
    return this.mapToDomain(saved);
  }

  async update(entity: DeliveryNote): Promise<DeliveryNote> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  async createFull(
    payload: CreateDeliveryNoteFullPayload,
  ): Promise<DeliveryNote> {
    const savedHeader = await this.ormRepo.manager.transaction(async (mgr) => {
      const header = new DeliveryNoteEntity();
      header.delivery_note_no = payload.delivery_note_no;
      header.delivery_note_date = new Date(payload.delivery_note_date);
      header.delivery_note_type = payload.delivery_note_type;
      const vendor = new VendorEntity();
      vendor.id = payload.vendor_id;
      header.vendor = vendor;
      header.destination = payload.destination;
      header.status = payload.status;
      header.notes = payload.notes ?? null;
      header.created_by = payload.user_id || 'system';

      const saved = await mgr.getRepository(DeliveryNoteEntity).save(header);

      for (const d of payload.details || []) {
        const detail = new DeliveryNoteDetailEntity();
        detail.delivery_note = saved;
        // Attach spk and spk_detail using provided spk_detail_id
        const spkDetail = await mgr.getRepository(SpkDetailEntity).findOne({
          where: { id: d.spk_detail_id },
          relations: ['spk'],
        });
        if (!spkDetail) {
          throw new Error(`SPK Detail not found: ${d.spk_detail_id}`);
        }
        detail.spk_detail = spkDetail;
        detail.spk = spkDetail.spk as SpkEntity;

        detail.item_type = d.item_type;
        // Choose item_id based on item_type
        const itemId =
          d.item_type === 'PRODUCT'
            ? d.product_variant_id || ''
            : d.material_id || '';
        detail.item_id = itemId;

        detail.qty_out = Number(d.qty_out) || 0;
        detail.qty_in = Number(d.qty_in) || 0;
        detail.labor_cost = Number(d.labor_cost ?? 0) || 0;
        detail.status = payload.status || 'OPEN';
        detail.created_by = payload.user_id || 'system';

        await mgr.getRepository(DeliveryNoteDetailEntity).save(detail);
      }

      return saved;
    });

    return this.mapToDomain(savedHeader);
  }

  async updateFull(payload: UpdateDeliveryNoteFullPayload): Promise<DeliveryNote> {
    const savedHeader = await this.ormRepo.manager.transaction(async (mgr) => {
      // Update DN header
      const headerRepo = mgr.getRepository(DeliveryNoteEntity);
      const header = await headerRepo.findOne({ where: { id: payload.id }, relations: ['vendor'] });
      if (!header) throw new Error(`Delivery Note not found: ${payload.id}`);

      if (payload.delivery_note_no !== undefined) header.delivery_note_no = payload.delivery_note_no;
      if (payload.delivery_note_date !== undefined) header.delivery_note_date = payload.delivery_note_date instanceof Date ? payload.delivery_note_date : new Date(payload.delivery_note_date);
      if (payload.delivery_note_type !== undefined) header.delivery_note_type = payload.delivery_note_type;
      if (payload.vendor_id !== undefined) {
        const vendor = new VendorEntity();
        vendor.id = payload.vendor_id;
        header.vendor = vendor;
      }
      if (payload.destination !== undefined) header.destination = payload.destination;
      if (payload.status !== undefined) header.status = payload.status;
      if (payload.notes !== undefined) header.notes = payload.notes ?? null;
      header.changed_by = payload.changed_by || 'system';
      header.changed_dt = new Date();
      const saved = await headerRepo.save(header);

      // Upsert details by spk_detail_id
      const detailsRepo = mgr.getRepository(DeliveryNoteDetailEntity);
      const existingDetails = await detailsRepo.find({
        where: { delivery_note: { id: payload.id } },
        relations: ['spk_detail', 'spk', 'delivery_note'],
      });
      const detailBySpkDetailId = new Map<string, DeliveryNoteDetailEntity>();
      for (const ed of existingDetails) {
        const sdid = ed.spk_detail?.id;
        if (sdid) detailBySpkDetailId.set(sdid, ed);
      }

      for (const d of payload.details || []) {
        const sdid = d.spk_detail_id;
        const existing = detailBySpkDetailId.get(sdid);
        if (existing) {
          // Update existing row
          existing.item_type = d.item_type;
          const itemId = d.item_type === 'PRODUCT' ? d.product_variant_id || '' : d.material_id || '';
          existing.item_id = itemId;
          if (d.qty_out !== undefined) existing.qty_out = Number(d.qty_out) || 0;
          if (d.qty_in !== undefined) existing.qty_in = Number(d.qty_in) || 0;
          if (d.labor_cost !== undefined) existing.labor_cost = Number(d.labor_cost) || 0;
          if (payload.status) existing.status = payload.status;
          existing.changed_by = payload.changed_by || 'system';
          existing.changed_dt = new Date();
          await detailsRepo.save(existing);
        } else {
          // Create new row (attach spk_detail and spk)
          const spkDetail = await mgr.getRepository(SpkDetailEntity).findOne({ where: { id: sdid }, relations: ['spk'] });
          if (!spkDetail) throw new Error(`SPK Detail not found: ${sdid}`);
          const detail = new DeliveryNoteDetailEntity();
          detail.delivery_note = saved;
          detail.spk_detail = spkDetail;
          detail.spk = spkDetail.spk as SpkEntity;
          detail.item_type = d.item_type;
          detail.item_id = d.item_type === 'PRODUCT' ? d.product_variant_id || '' : d.material_id || '';
          detail.qty_out = Number(d.qty_out) || 0;
          detail.qty_in = Number(d.qty_in) || 0;
          detail.labor_cost = Number(d.labor_cost ?? 0) || 0;
          detail.status = payload.status || header.status;
          detail.created_by = payload.changed_by || 'system';
          await detailsRepo.save(detail);
        }
      }

      return saved;
    });

    return this.mapToDomain(savedHeader);
  }

  async findFullById(id: string): Promise<DeliveryNoteFullByIdResult | null> {
    const header = await this.ormRepo.findOne({
      where: { id },
      relations: ['vendor'],
    });
    if (!header) return null;
    const detailsRepo = this.ormRepo.manager.getRepository(
      DeliveryNoteDetailEntity,
    );
    const rows = await detailsRepo.find({
      where: { delivery_note: { id } },
      relations: ['spk', 'spk_detail'],
    });

    const toUiItemType = (t: string) => {
      if (!t) return '';
      const x = t.toUpperCase();
      return x === 'PRODUCT' ? 'barang' : x === 'MATERIAL' ? 'bahan' : t;
    };

    const details = rows.map((d) => ({
      id: d.id,
      spk_id: (d.spk as SpkEntity)?.id ?? '',
      spk_detail_id: (d.spk_detail as SpkDetailEntity)?.id ?? '',
      item_type: toUiItemType(d.item_type),
      item_id: d.item_id,
      qty_out: Number(d.qty_out) || 0,
      qty_in: Number(d.qty_in) || 0,
      labor_cost: Number(d.labor_cost) || 0,
      status: d.status,
    }));

    return {
      id: header.id,
      delivery_note_no: header.delivery_note_no,
      delivery_note_date: (() => {
        const d: any = header.delivery_note_date as any;
        if (!d) return '';
        if (d instanceof Date) {
          return d.toISOString().split('T')[0];
        }
        if (typeof d === 'string') {
          // TypeORM often returns DATE as string (e.g., Postgres)
          // Assume it's already in YYYY-MM-DD format
          return d;
        }
        // Fallback: attempt to parse
        try {
          const parsed = new Date(d);
          return Number.isNaN(parsed.getTime())
            ? ''
            : parsed.toISOString().split('T')[0];
        } catch {
          return '';
        }
      })(),
      delivery_note_type: header.delivery_note_type,
      vendor_id: header.vendor?.id || '',
      destination: header.destination,
      status: header.status,
      notes: header.notes ?? '',
      details,
    };
  }

  private mapToDomain(row: DeliveryNoteEntity): DeliveryNote {
    return new DeliveryNote(row.id, row.delivery_note_no);
  }

  private mapToOrm(entity: DeliveryNote): DeliveryNoteEntity {
    const row = new DeliveryNoteEntity();
    row.id = entity.id;
    row.delivery_note_no = entity.delivery_note_no;
    return row;
  }

  async updateStatus(payload: {
    id: string;
    status: string;
    changed_by?: string;
  }): Promise<DeliveryNote> {
    const header = await this.ormRepo.findOne({ where: { id: payload.id } });
    if (!header) throw new Error(`Delivery Note not found: ${payload.id}`);
    header.status = payload.status;
    header.changed_by = payload.changed_by || 'system';
    header.changed_dt = new Date();
    const saved = await this.ormRepo.save(header);
    return this.mapToDomain(saved);
  }

  async updateDetailsLaborCost(payload: {
    delivery_note_id: string;
    details: Array<{ spk_detail_id: string; labor_cost: number }>;
    user_id?: string;
  }): Promise<void> {
    await this.ormRepo.manager.transaction(async (mgr) => {
      const dn = await mgr.getRepository(DeliveryNoteEntity).findOne({ where: { id: payload.delivery_note_id } });
      if (!dn) throw new Error(`Delivery Note not found: ${payload.delivery_note_id}`);

      const detailsRepo = mgr.getRepository(DeliveryNoteDetailEntity);
      for (const item of payload.details) {
        const row = await detailsRepo.findOne({
          where: {
            delivery_note: { id: payload.delivery_note_id },
            spk_detail: { id: item.spk_detail_id },
          },
          relations: ['delivery_note', 'spk_detail'],
        });
        if (!row) {
          // Skip silently if not found; alternatively throw
          continue;
        }
        row.labor_cost = Number(item.labor_cost) || 0;
        row.changed_by = payload.user_id || 'system';
        row.changed_dt = new Date();
        await detailsRepo.save(row);
      }
    });
  }
}
