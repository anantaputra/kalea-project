import { IsUUID, IsArray, ValidateNested, IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateBomMaterialItemDto {
  @IsUUID()
  @IsNotEmpty()
  material_id!: string;

  @IsNumber()
  @IsNotEmpty()
  qty_per_unit!: number;
}

export class UpdateBomItemBulkDto {
  @IsUUID()
  @IsNotEmpty()
  product_variant_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBomMaterialItemDto)
  materials!: UpdateBomMaterialItemDto[];

  @IsString()
  @IsNotEmpty()
  user_id!: string;
}