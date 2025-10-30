import { IsString } from "class-validator";

export class UpdateMaterialCategoryDto {
  @IsString()
  name!: string; // maps to system_value

  @IsString()
  user_id?: string; // for audit trail
}