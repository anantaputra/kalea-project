import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBody, ApiParam, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { SpkStageService } from './spk-stage.service';
import { CreateSpkStageDto } from './dto/create-spk-stage.dto';
import { UpdateSpkStageDto } from './dto/update-spk-stage.dto';
import { created, updated } from 'src/infrastructure/http/response';
import { tCreated, tUpdated } from 'src/core/common/i18n/messages';

@ApiTags('SPK Stage')
@Controller('spk-stage')
export class SpkStageController {
  constructor(private readonly service: SpkStageService) {}

  // @ApiOperation({ summary: 'List SPK Stages (opsional filter spk_detail_id)' })
  // @ApiQuery({ name: 'spk_detail_id', required: false })
  // @ApiOkResponse({ description: 'Daftar stage' })
  // @Get()
  // findAll(@Query('spk_detail_id') spk_detail_id?: string) {
  //   return this.service.findAll(spk_detail_id ? { spk_detail_id } : undefined);
  // }

  // @ApiOperation({ summary: 'Ambil SPK Stage by ID' })
  // @ApiParam({ name: 'id', example: 'stage1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  // @ApiOkResponse({ description: 'Detail stage' })
  // @Get(':id')
  // findById(@Param('id') id: string) {
  //   return this.service.findById(id);
  // }

  @ApiOperation({ summary: 'Buat SPK Stage' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateSpkStageDto,
    examples: {
      default: {
        summary: 'Contoh body create stage',
        value: {
          spk_detail_id: 'spkd1b2c3d4-e5f6-7890-1234-56789abcdef0',
          stage_name: 'Cutting',
          seq: 1,
          qty_in: 100,
          qty_reject: 2,
          pic_id: 'user-123',
          start_at: '2025-10-26T09:00:00Z',
          end_at: '2025-10-26T17:00:00Z',
          status: 'IN_PROGRESS',
          user_id: 'system',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'ID stage yang dibuat' })
  @Post()
  async create(
    @Headers() headers: Record<string, string>,
    @Body() dto: CreateSpkStageDto
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Spk Stage', lang));
  }

  @ApiOperation({ summary: 'Update SPK Stage' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'stage1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  @ApiBody({
    type: UpdateSpkStageDto,
    examples: {
      default: {
        summary: 'Contoh body update stage',
        value: {
          stage_name: 'Cutting - Updated',
          seq: 2,
          qty_in: 120,
          qty_reject: 1,
          pic_id: 'user-456',
          start_at: '2025-10-27T09:00:00Z',
          end_at: '2025-10-27T17:00:00Z',
          status: 'DONE',
          user_id: 'system',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'ID stage yang diupdate' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSpkStageDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Spk Stage', lang));
  }

  // @ApiOperation({ summary: 'Hapus SPK Stage' })
  // @ApiParam({ name: 'id', example: 'stage1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  // @ApiOkResponse({ description: 'Berhasil dihapus' })
  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.service.delete(id);
  // }
}