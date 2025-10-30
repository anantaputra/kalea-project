import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateMaterialsDto {
  @IsOptional()
  @IsString()
  material_name?: string;

  @IsOptional()
  @IsString()
  material_category?: string;

  @IsOptional()
  @IsString()
  unit_of_measure?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  user_id?: string;
}