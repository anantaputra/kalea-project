import { PartialType } from '@nestjs/mapped-types';
import { CreateSpkDto } from './create-spk.dto';

export class UpdateSpkDto extends PartialType(CreateSpkDto) {}
