import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateProductVariantDto {
  @IsUUID()
  @IsNotEmpty()
  article_id: string;

  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  cost_price: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
