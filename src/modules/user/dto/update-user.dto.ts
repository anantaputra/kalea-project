import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Budi', required: false })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ example: 'Santoso', required: false, nullable: true })
  @IsOptional()
  @IsString()
  last_name?: string | null;

  @ApiProperty({ example: 'budi@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'secret123', required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: 'ADMIN', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ example: 'updater', required: false })
  @IsOptional()
  @IsString()
  user_id?: string;
}
