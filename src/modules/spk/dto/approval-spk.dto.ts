import { IsUUID, IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class ApprovalSpkDto {
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsIn(['APPROVED', 'REJECTED'])
  status!: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  user_id?: string;
}