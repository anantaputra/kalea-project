import { IsString } from "class-validator";

export class UpdateUnitOfMeasureDto {
  @IsString()
  name!: string; // maps to system_value

  @IsString()
  user_id?: string; // for audit trail
}