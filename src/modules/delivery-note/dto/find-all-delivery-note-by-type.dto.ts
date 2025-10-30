import { FindBaseDto } from "src/core/find-base.dto";
import { IsNotEmpty, IsString, IsIn } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindAllDeliveryNoteByTypeDto extends FindBaseDto {
  @IsString()
  @IsNotEmpty()
  delivery_note_type!: string;
}