import { PartialType } from '@nestjs/mapped-types';
import { CreateVendorDto } from './create-vendor.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  contact_person?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  zip_code?: string;

  @IsString()
  @IsOptional()
  tax_number?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  // audit helper, siapa yang update
  @IsString()
  @IsOptional()
  user_id?: string;
}
