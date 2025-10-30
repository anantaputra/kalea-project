import { Controller, Get, Post, Body, Param, Put, Delete, Headers, Query } from '@nestjs/common';
import { CreateMaterialsDto } from './dto/create-material.dto';
import { UpdateMaterialsDto } from './dto/update-material.dto';
import { MaterialsService } from './material.service';
import { FindBaseDto } from '../../core/find-base.dto';
import { tCreated, tDeleted, tRetrieved, tUpdated } from '../../core/common/i18n/messages';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';
import { created, ok, updated } from 'src/infrastructure/http/response';

@ApiTags('Materials')
@Controller('materials')
export class MaterialsController {
  constructor(private readonly service: MaterialsService) {}

  @ApiOperation({ summary: 'Ambil semua Material' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
            material_code: 'MAT001',
            material_name: 'Kain Cotton',
            material_category: 'FABRIC',
            unit_of_measure: 'YARD',
            barcode: '1234567890123',
            created_by: 'system',
            created_dt: '2025-10-23T07:25:50.571Z',
            changed_by: 'system',
            changed_dt: '2025-10-23T07:25:50.571Z'
          },
        ],
        message: null,
        meta: {
          total: 100,
          start: 0,
          length: 10,
          total_pages: 10,
        },
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Get()
  async findAll(
    @Headers() headers: Record<string, string>,
    @Query() query: FindBaseDto,
  ) {
    const lang = headers['accept-language'];
    const start = query.start ?? 0;
    const length = query.length ?? 10;
    const { items, total } = await this.service.findAllPaginated(
      start,
      length,
      lang,
    );
    const total_pages = Math.max(1, Math.ceil(total / length));
    return {
      success: true,
      data: items,
      message: tRetrieved('Data', lang),
      meta: { total, start, length, total_pages },
    };
  }

  @ApiOperation({ summary: 'Backfill barcode untuk materi yang belum memiliki barcode' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiOkResponse({
    description: 'Jumlah material yang diperbarui dengan barcode baru',
    schema: {
      example: {
        success: true,
        data: { updated: 42 },
        message: 'Data berhasil diperbarui',
        meta: null,
      },
    },
  })
  @Post('backfill-barcodes')
  async backfillBarcodes(@Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const result = await this.service.backfillMissingBarcodes(lang);
    return {
      success: true,
      data: result,
      message: tRetrieved('Data', lang),
      meta: null,
    };
  }

  @ApiOperation({ summary: 'Ambil satu Material berdasarkan id' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'm1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
          material_code: 'MAT001',
          material_name: 'Kain Cotton',
          material_category: 'FABRIC',
          unit_of_measure: 'YARD',
          barcode: '1234567890123',
          created_by: 'system',
          created_dt: '2025-10-23T07:25:50.571Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T07:25:50.571Z'
        },
        message: null,
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.findOne(id, lang);
    return ok(data, tRetrieved('Material', lang));
  }

  @ApiOperation({ summary: 'Buat Material baru' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateMaterialsDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          material_code: '',
          material_name: 'Kain Cotton',
          material_category: '549c548b-a1e2-4618-95c0-95de1ab03eba',
          unit_of_measure: '8b7f71ee-c078-4dcd-91b1-2648e1b871bb',
          is_active: true,
          user_id: 'system',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
          material_code: 'MAT001',
          material_name: 'Kain Cotton',
          material_category: 'FABRIC',
          unit_of_measure: 'YARD',
          barcode: '1234567890123',
          created_by: 'system',
          created_dt: '2025-10-23T07:25:50.571Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T07:25:50.571Z'
        },
        message: 'Created',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateMaterialsDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Material', lang));
  }

  @ApiOperation({ summary: 'Update Material' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28' })
  @ApiBody({
    type: UpdateMaterialsDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          material_name: 'Kain Cotton Premium',
          material_category: '549c548b-a1e2-4618-95c0-95de1ab03eba',
          unit_of_measure: '8b7f71ee-c078-4dcd-91b1-2648e1b871bb',
          is_active: true,
          user_id: 'updater',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
          material_code: 'MAT001',
          material_name: 'Kain Cotton',
          material_category: 'FABRIC',
          unit_of_measure: 'YARD',
          barcode: '1234567890123',
          created_by: 'system',
          created_dt: '2025-10-23T07:25:50.571Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T07:25:50.571Z'
        },
        message: 'Updated',
        meta: null,
        timestamp: '2024-10-01T11:00:00.000Z',
      },
    },
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMaterialsDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Material', lang));
  }

  @ApiOperation({ summary: 'Hapus Material' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'm1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: null,
        message: 'Deleted',
        meta: null,
        timestamp: '2024-10-01T12:00:00.000Z',
      },
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: string, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.remove(id, lang);
    return ok(data, tDeleted('Material', lang));
  }
}
