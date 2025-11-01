import { IsArray, ValidateNested, IsIn, ValidateIf, IsUUID, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateDeliveryNoteDetailDto {
  @ValidateIf((o) => o.spk_detail_id !== null && o.spk_detail_id !== undefined)
  @IsUUID()
  @IsOptional()
  spk_detail_id?: string | null;
  @IsIn(['PRODUCT', 'MATERIAL'])
  item_type!: string; // hanya 'PRODUCT' atau 'MATERIAL'
  product_variant_id?: string | null;
  material_id?: string | null;
  qty_out!: number | string;
  qty_in!: number | string;
  labor_cost?: number | string;
}

export class UpdateDeliveryNoteDto {
  delivery_note_date?: string; // YYYY-MM-DD
  delivery_note_type?: string;
  vendor_id?: string;
  destination?: string;
  status?: string;
  notes?: string | null;
  user_id?: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDeliveryNoteDetailDto)
  details?: UpdateDeliveryNoteDetailDto[];
}
