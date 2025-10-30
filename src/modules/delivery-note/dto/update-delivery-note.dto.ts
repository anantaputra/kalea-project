export class UpdateDeliveryNoteDto {
  delivery_note_date?: string; // YYYY-MM-DD
  delivery_note_type?: string;
  vendor_id?: string;
  destination?: string;
  status?: string;
  notes?: string | null;
  user_id?: string;
  details?: Array<{
    spk_detail_id: string;
    item_type: string; // 'PRODUCT' | 'MATERIAL'
    product_variant_id?: string | null;
    material_id?: string | null;
    qty_out: number | string;
    qty_in: number | string;
    labor_cost?: number | string;
  }>;
}
