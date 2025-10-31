import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class UpdateMaterialStockDto {
  @IsNotEmpty()
  material_id!: string;

  @IsNotEmpty()
  @IsNumber()
  qty!: number;
  
  @IsOptional()
  @IsString()
  user_id?: string;
}