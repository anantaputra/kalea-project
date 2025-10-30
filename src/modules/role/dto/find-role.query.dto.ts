import { IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindRoleQueryDto {
  @ApiPropertyOptional({
    description: 'Offset mulai dari data ke berapa',
    example: 0,
  })
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  @IsInt()
  @Min(0)
  start?: number;

  @ApiPropertyOptional({ description: 'Jumlah data yang diambil', example: 10 })
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined ? parseInt(value, 10) : undefined,
  )
  @IsInt()
  @Min(1)
  length?: number;
}
