import { PartialType } from '@nestjs/mapped-types';
import { CreateSpkStageDto } from './create-spk-stage.dto';

export class UpdateSpkStageDto extends PartialType(CreateSpkStageDto) {}