import { DeliveryNote } from '../entities/delivery-note.entity';

export type CreateDeliveryNoteFullPayload = {
  delivery_note_no: string;
  delivery_note_date: string; // ISO string or YYYY-MM-DD
  delivery_note_type: string;
  vendor_id: string;
  destination: string;
  status: string;
  notes?: string | null;
  user_id: string; // used as created_by
  details: Array<{
    spk_detail_id?: string | null;
    item_type: string; // e.g., 'PRODUCT' | 'MATERIAL'
    product_variant_id?: string | null;
    material_id?: string | null;
    qty_out: number | string;
    qty_in: number | string;
    labor_cost?: number | string;
  }>;
};

export type UpdateDeliveryNoteFullPayload = {
  id: string;
  delivery_note_no?: string;
  delivery_note_date?: Date | string; // prefer Date internally
  delivery_note_type?: string;
  vendor_id?: string;
  destination?: string;
  status?: string;
  notes?: string | null;
  changed_by?: string;
  details: Array<{
    spk_detail_id?: string | null;
    item_type: string; // 'PRODUCT' | 'MATERIAL'
    product_variant_id?: string | null;
    material_id?: string | null;
    qty_out?: number | string;
    qty_in?: number | string;
    labor_cost?: number | string;
  }>;
};

export type DeliveryNoteFullByIdResult = {
  id: string;
  delivery_note_no: string;
  delivery_note_date: string;
  delivery_note_type: string;
  vendor_id: string;
  vendor?: {
    id: string;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip_code: string | null;
    tax_number: string | null;
  } | null;
  destination: string;
  status: string;
  notes: string | null;
  details: Array<{
    id: string;
    spk_id: string;
    spk_detail_id: string;
    item_type: string;
    item_id: string;
    barcode: string | null;
    qty_out: number;
    qty_in: number;
    labor_cost: number;
    status: string;
  }>;
  spk?: Array<{
    id: string;
    spk_no: string;
    buyer: string | null;
    spk_date: string | null; // ISO timestamp
    deadline: string | null; // ISO timestamp
    status: string | null;
    notes: string | null;
  }>;
  spk_details?: Array<{
    id: string;
    product_variants: {
      id: string;
      product_name: string;
      size: string;
      color: string | null;
      barcode: string | null;
      sku: string | null;
      price: number;
      cost_price: number;
    } | null;
    qty_order: number;
    qty_done: number;
    qty_reject: number;
    progress: string; // percentage like '0%'
    status: string;
    cost_price: number;
  }>;
};

export type DeliveryNoteHeader = {
  id: string;
  delivery_note_no: string;
  delivery_note_date: string; // YYYY-MM-DD
  delivery_note_type: string;
  vendor: {
    id: string;
    name: string;
    contact_person: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip_code: string | null;
    tax_number: string | null;
  } | null;
  destination: string;
  status: string;
  notes: string | null;
};

export interface DeliveryNoteRepository {
  findById(id: string): Promise<DeliveryNote | null>;
  findAll(): Promise<DeliveryNote[]>;
  create(entity: DeliveryNote): Promise<DeliveryNote>;
  update(entity: DeliveryNote): Promise<DeliveryNote>;
  createFull(payload: CreateDeliveryNoteFullPayload): Promise<DeliveryNote>;
  updateFull(payload: UpdateDeliveryNoteFullPayload): Promise<DeliveryNote>;
  findFullById(id: string): Promise<DeliveryNoteFullByIdResult | null>;
  findAllHeaders(): Promise<DeliveryNoteHeader[]>;
  findAllByType(deliveryNoteType: string): Promise<DeliveryNoteHeader[]>;
  updateStatus(payload: { id: string; status: string; changed_by?: string }): Promise<DeliveryNote>;
  updateDetailsLaborCost(payload: { delivery_note_id: string; details: Array<{ spk_detail_id: string; labor_cost: number }>; user_id?: string }): Promise<void>;
}

export const DELIVERY_NOTE_REPOSITORY = Symbol('DeliveryNoteRepository');
