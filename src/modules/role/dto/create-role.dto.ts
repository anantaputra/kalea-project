import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name!: string; // maps to system_value

  @IsString()
  user_id?: string; // for audit trail
}
