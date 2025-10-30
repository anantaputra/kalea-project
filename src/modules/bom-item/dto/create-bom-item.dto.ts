import { IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBomItemDto {
  @IsUUID()
  product_variant_id: string;

  @IsUUID()
  material_id: string;

  @IsNumber()
  qty_per_unit: number;

  @IsString()
  @IsOptional()
  condition_color?: string;

  @IsNumber()
  waste_pct: number;

  @IsString()
  user_id?: string;
}
