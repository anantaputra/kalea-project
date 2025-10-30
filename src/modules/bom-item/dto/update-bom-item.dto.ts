import { PartialType } from '@nestjs/mapped-types';
import { CreateBomItemDto } from './create-bom-item.dto';
import { IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateBomItemDto extends PartialType(CreateBomItemDto) {
  @IsUUID()
  @IsOptional()
  product_variant_id?: string;

  @IsUUID()
  @IsOptional()
  material_id?: string;

  @IsNumber()
  @IsOptional()
  qty_per_unit?: number;

  @IsString()
  @IsOptional()
  condition_color?: string;

  @IsNumber()
  @IsOptional()
  waste_pct?: number;

  @IsString()
  @IsOptional()
  user_id?: string;
}
