import { IsUUID, IsArray, ValidateNested, IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class CreateBomMaterialItemDto {
  @IsUUID()
  @IsNotEmpty()
  material_id!: string;

  @IsNumber()
  @IsNotEmpty()
  qty_per_unit!: number;
}

export class CreateBomItemBulkDto {
  @IsUUID()
  @IsNotEmpty()
  product_variant_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateBomMaterialItemDto)
  materials!: CreateBomMaterialItemDto[];

  @IsString()
  @IsNotEmpty()
  user_id!: string;
}