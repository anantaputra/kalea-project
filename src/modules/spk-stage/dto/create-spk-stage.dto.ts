import { IsUUID, IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSpkStageDto {
  @IsUUID()
  @IsNotEmpty()
  spk_detail_id!: string;

  @IsString()
  @IsNotEmpty()
  stage_name!: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  seq!: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  qty_in?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  qty_reject?: number;

  @IsString()
  @IsNotEmpty()
  pic_id!: string;

  @IsDateString()
  @IsOptional()
  start_at?: string; // ISO datetime string

  @IsDateString()
  @IsOptional()
  end_at?: string; // ISO datetime string

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsString()
  @IsOptional()
  user_id?: string;
}