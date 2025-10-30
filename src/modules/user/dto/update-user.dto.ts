import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Budi', required: false })
  first_name?: string;

  @ApiProperty({ example: 'Santoso', required: false, nullable: true })
  last_name?: string | null;

  @ApiProperty({ example: 'budi@example.com', required: false })
  email?: string;

  @ApiProperty({ example: 'secret123', required: false })
  password?: string;

  @ApiProperty({ example: 'ADMIN', required: false })
  role?: string;

  @ApiProperty({ example: true, required: false })
  is_active?: boolean;

  @ApiProperty({ example: 'updater', required: false })
  user_id?: string;
}
