import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsUUID,
  IsNumberString,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

class SpkDetailDto {
  @IsUUID()
  @IsNotEmpty()
  product_variant_id!: string;

  @IsNumberString()
  @IsNotEmpty()
  qty_order!: string; // numeric string; will be coerced to number

  @IsNumberString()
  @IsNotEmpty()
  cost_price!: string; // numeric string; will be coerced to number
}

export class CreateSpkDto {
  @IsString()
  @IsNotEmpty()
  no_spk!: string;

  @IsString()
  @IsNotEmpty()
  buyer!: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal!: string; // ISO date string (YYYY-MM-DD)

  @IsDateString()
  @IsNotEmpty()
  deadline!: string; // ISO date string (YYYY-MM-DD)

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  user_id?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SpkDetailDto)
  details!: SpkDetailDto[];
}
