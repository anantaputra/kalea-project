import { IsOptional, IsString } from 'class-validator';

export class CreateSystemMasterDto {
  @IsString()
  system_type!: string;

  @IsOptional()
  @IsString()
  system_cd?: string;

  @IsString()
  system_value!: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}
