import { Spk } from '../entities/spk.entity';

export type CreateSpkFullPayload = {
  spk_no: string;
  buyer: string;
  spk_date: Date;
  deadline: Date;
  status: string;
  notes?: string | null;
  created_by?: string;
  details: Array<{
    product_variant_id: string;
    qty_order: number;
    cost_price: number;
  }>;
};

export type UpdateSpkFullPayload = {
  id: string;
  spk_no: string;
  buyer: string;
  spk_date: Date;
  deadline: Date;
  status: string;
  notes?: string | null;
  changed_by?: string;
  details: Array<{
    product_variant_id: string;
    qty_order: number;
    cost_price: number;
  }>;
};

export type SpkFullByIdResult = {
  header: Spk;
  details: Array<{
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
    };
    qty_order: number;
    qty_done: number;
    qty_reject: number;
    progress: string;
    status: string;
    cost_price: number;
    bom: Array<{
      id: string;
      material_id: string;
      qty_per_unit: number;
      qty_required: number;
      waste_pct: number;
    }>;
    // stages: Array<{
    //   id: string;
    //   spk_detail_id: string;
    //   stage_name: string;
    //   seq: number;
    //   qty_in: number;
    //   qty_reject: number;
    //   pic_id: string;
    //   start_at: Date;
    //   end_at: Date;
    //   status: string;
    //   created_by: string;
    //   created_dt: Date;
    //   changed_by: string | null;
    //   changed_dt: Date | null;
    // }>;
  }>;
};

export type CreateSpkStagePayload = {
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
};

export type UpdateSpkStagePayload = {
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
};

export interface SpkRepository {
  findById(id: string): Promise<Spk | null>;
  findAll(): Promise<Spk[]>;
  create(entity: Spk): Promise<Spk>;
  update(entity: Spk): Promise<Spk>;
  createFull(payload: CreateSpkFullPayload): Promise<Spk>;
  updateFull(payload: UpdateSpkFullPayload): Promise<Spk>;
  findFullById(id: string): Promise<SpkFullByIdResult | null>;
  createStage(payload: CreateSpkStagePayload): Promise<{ id: string }>;
  updateStage(payload: UpdateSpkStagePayload): Promise<{ id: string }>;
}

export const SPK_REPOSITORY = Symbol('SpkRepository');