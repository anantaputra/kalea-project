import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateMaterialsDto {
  @IsString()
  material_name: string;

  @IsString()
  material_category: string;

  @IsString()
  unit_of_measure: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  user_id?: string;
}