import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Budi' })
  first_name: string;

  @ApiProperty({ example: 'Santoso', required: false, nullable: true })
  last_name?: string | null;

  @ApiProperty({ example: 'budi' })
  username: string;

  @ApiProperty({ example: 'budi@example.com' })
  email: string;

  @ApiProperty({ example: 'secret123' })
  password: string;

  @ApiProperty({ example: 'ADMIN' })
  role: string;

  @ApiProperty({ example: true, required: false })
  is_active?: boolean;

  @ApiProperty({ example: 'system', required: false })
  user_id?: string;
}
