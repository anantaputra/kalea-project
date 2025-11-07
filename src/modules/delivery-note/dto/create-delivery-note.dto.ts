import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsNumberString,
  IsDateString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryNoteDetailDto {
  @IsUUID()
  @IsOptional()
  // Jika diisi, harus UUID; jika null/undefined, dilewati
  spk_detail_id?: string | null;

  @IsString()
  @IsIn(['PRODUCT', 'MATERIAL'])
  item_type!: string; // hanya 'PRODUCT' atau 'MATERIAL'

  @IsUUID()
  @IsOptional()
  product_variant_id?: string | null;

  @IsUUID()
  @IsOptional()
  material_id?: string | null;

  // @IsNumberString()
  @IsNotEmpty()
  qty_out!: number | string;

  // @IsNumberString()
  @IsNotEmpty()
  qty_in!: number | string;

  // @IsNumberString()
  @IsOptional()
  labor_cost?: number | string;

  @IsOptional()
  hpp?: number | string;
}

export class CreateDeliveryNoteDto {
  @IsString()
  @IsNotEmpty()
  delivery_note_no!: string;

  @IsDateString()
  @IsNotEmpty()
  delivery_note_date!: string; // YYYY-MM-DD

  @IsString()
  delivery_note_type!: string;

  @IsUUID()
  @IsNotEmpty()
  vendor_id!: string;

  @IsString()
  @IsNotEmpty()
  destination!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsOptional()
  notes?: string | null;

  @IsString()
  @IsNotEmpty()
  user_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DeliveryNoteDetailDto)
  details!: DeliveryNoteDetailDto[];
}
