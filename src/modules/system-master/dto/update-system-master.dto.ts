import { IsOptional, IsString } from 'class-validator';

export class UpdateSystemMasterDto {
  @IsString()
  system_value!: string;

  @IsOptional()
  @IsString()
  user_id?: string;
}
