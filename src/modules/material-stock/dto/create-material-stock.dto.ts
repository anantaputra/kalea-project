import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMaterialStockDto {
  @IsNotEmpty()
  material_id!: string;

  @IsNotEmpty()
  @IsNumber()
  qty!: number;

  @IsOptional()
  @IsString()
  user_id?: string;
}