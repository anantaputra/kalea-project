import { Controller, Get, Post, Body, Param, Put, Headers, Query, Delete } from '@nestjs/common';
import { CreateMaterialStockDto } from './dto/create-material-stock.dto';
import { UpdateMaterialStockDto } from './dto/update-material-stock.dto';
import { ApprovalMaterialStockDto } from './dto/approval-material-stock.dto';
import { MaterialStockService } from './material-stock.service';
import { FindBaseDto } from '../../core/find-base.dto';
import { tCreated, tRetrieved, tUpdated, tDeleted } from '../../core/common/i18n/messages';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';
import { created, ok, updated } from 'src/infrastructure/http/response';

@ApiTags('Material Stock')
@Controller('material-stock')
export class MaterialStockController {
  constructor(private readonly service: MaterialStockService) {}

  @ApiOperation({ summary: 'Ambil semua Material Stock' })
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
            id: '',
            material: {
              id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
              material_name: 'Kain Cotton',
              material_category: 'FABRIC',
              unit_of_measure: 'YARD',
              barcode: '1234567890123',
            },
            qty: 10,
            price: 10000,
            status: 'Not Approved',
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

  @ApiOperation({ summary: 'Ambil satu Material Stock berdasarkan id' })
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
          id: '',
          material: {
            id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
            material_name: 'Kain Cotton',
            material_category: 'FABRIC',
            unit_of_measure: 'YARD',
            barcode: '1234567890123',
          },
          qty: 10,
          price: 10000,
          status: 'Not Approved',
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
    return ok(data, tRetrieved('Material Stock', lang));
  }

  @ApiOperation({ summary: 'Buat Material Stock baru' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateMaterialStockDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          material_id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
          qty: 12,
          price: 120000,
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
          id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef0',
          material: {
            id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
            material_name: 'Kain Cotton',
            material_category: 'FABRIC',
            unit_of_measure: 'YARD',
            barcode: '1234567890123',
          },
          qty: 10,
          price: 120000,
          created_by: 'system',
          created_dt: '2025-10-23T07:25:50.571Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T07:25:50.571Z',
        },
        message: 'Created',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateMaterialStockDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Material Stock', lang));
  }

  @ApiOperation({ summary: 'Update Material Stock' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28' })
  @ApiBody({
    type: UpdateMaterialStockDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          material_id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
          qty: 12,
          price: 120000,
          user_id: 'system',
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
          id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef0',
          material: {
            id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
            material_name: 'Kain Cotton',
            material_category: 'FABRIC',
            unit_of_measure: 'YARD',
            barcode: '1234567890123',
          },
          qty: 12,
          price: 120000,
          created_by: 'system',
          created_dt: '2025-10-23T07:25:50.571Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T07:25:50.571Z',
        },
        message: 'Updated',
        meta: null,
        timestamp: '2024-10-01T11:00:00.000Z',
      },
    },
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMaterialStockDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Material Stock', lang));
  }

  @ApiOperation({ summary: 'Approval Material Stock' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: ApprovalMaterialStockDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          id: 'f1a2b3c4-d5e6-7890-1234-56789abcdef0',
          status: 'APPROVED',
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
          material_name: 'Kain Cotton',
          material_category: 'FABRIC',
          unit_of_measure: 'YARD',
          barcode: '1234567890123',
          stock_qty: 22,
          created_by: 'system',
          created_dt: '2025-10-23T07:25:50.571Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T07:25:50.571Z',
        },
        message: 'Approved',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post('approval')
  async approval(@Body() dto: ApprovalMaterialStockDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.approval({
      id: dto.id,
      status: dto.status as any,
      notes: dto.notes ?? null,
      user_id: dto.user_id ?? 'system',
    }, lang);
    return updated(data, tUpdated('Material Stock', lang));
  }

  @ApiOperation({ summary: 'Hapus Material Stock' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'f1a2b3c4-d5e6-7890-1234-56789abcdef0' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: { deleted: true },
        message: 'Deleted',
        meta: null,
        timestamp: '2024-10-01T12:00:00.000Z',
      },
    },
  })
  @Delete(':id')
  async delete(@Param('id') id: string, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    await this.service.remove(id, lang);
    return ok({ deleted: true }, tDeleted('Material Stock', lang));
  }

}
