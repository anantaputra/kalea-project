import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { CreateBomItemDto } from './dto/create-bom-item.dto';
import { UpdateBomItemDto } from './dto/update-bom-item.dto';
import { CreateBomItemBulkDto } from './dto/create-bom-item-bulk.dto';
import { UpdateBomItemBulkDto } from './dto/update-bom-item-bulk.dto';
import { BomItemService } from './bom-item.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { FindBaseDto } from 'src/core/find-base.dto';
import { tCreated, tDeleted, tRetrieved, tUpdated } from 'src/core/common/i18n/messages';
import { ok } from 'src/infrastructure/http/response';
import { created, updated } from 'src/infrastructure/http/response';

@ApiTags('BOM Items')
@Controller('bom-items')
export class BomItemController {
  constructor(private readonly service: BomItemService) {}

  @ApiOperation({ summary: 'List semua Bom Item' })
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
            id: '525a58dc-55ea-495d-9c78-489bdcaa8f01',
            product_variant: {
              id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
              product_name: 'Dress Lengan Pendek - Merah - L',
              size: 'L',
              color: 'Merah',
              sku: 'KLP-RED-L'
            },
            material: {
              id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
              material_code: 'MAT001',
              material_name: 'Kain Cotton',
              material_category: '549c548b-a1e2-4618-95c0-95de1ab03eba',
              unit_of_measure: 'YARD'
            }
          },
        ],
        message: null,
        meta: null,
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
      message: tRetrieved('Bom Item', lang),
      meta: { total, start, length, total_pages },
    };
  }

  @ApiOperation({ summary: 'Ambil satu Bom Item berdasarkan id' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: '525a58dc-55ea-495d-9c78-489bdcaa8f01',
          product_variant: {
            id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
            product_name: 'Dress Lengan Pendek - Merah - L',
            size: 'L',
            color: 'Merah',
            sku: 'KLP-RED-L'
          },
          material: {
            id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
            material_code: 'MAT001',
            material_name: 'Kain Cotton',
            material_category: '549c548b-a1e2-4618-95c0-95de1ab03eba',
            unit_of_measure: 'YARD'
          }
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
    return ok(data, tRetrieved('Bom Item', lang));
  }

  @ApiOperation({ summary: 'Buat Article baru' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateBomItemDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          product_variant_id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
          material_id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
          qty_per_unit: 2.5,
          condition_color: 'Merah',
          waste_pct: 5.0,
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
          id: '525a58dc-55ea-495d-9c78-489bdcaa8f01',
          product_variant: {
            id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
            product_name: 'Dress Lengan Pendek - Merah - L',
            size: 'L',
            color: 'Merah',
            sku: 'KLP-RED-L'
          },
          material: {
            id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
            material_code: 'MAT001',
            material_name: 'Kain Cotton',
            material_category: '549c548b-a1e2-4618-95c0-95de1ab03eba',
            unit_of_measure: 'YARD'
          }
        },
        message: 'Created',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateBomItemDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Bom Item', lang));
  }

  @ApiOperation({ summary: 'Buat Bom Item baru Bulk' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateBomItemBulkDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          product_variant_id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
          materials: [
            {
              material_id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
              qty_per_unit: 2.5,
            },
          ],
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
          id: '525a58dc-55ea-495d-9c78-489bdcaa8f01',
          product_variant: {
            id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
            product_name: 'Dress Lengan Pendek - Merah - L',
            size: 'L',
            color: 'Merah',
            sku: 'KLP-RED-L'
          },
          materials: [
            {
              id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
              material_code: 'MAT001',
              material_name: 'Kain Cotton',
              material_category: '549c548b-a1e2-4618-95c0-95de1ab03eba',
              unit_of_measure: 'YARD'
            },
          ],
        },
        message: 'Created',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post('bulk')
  async createBulk(@Body() dto: CreateBomItemBulkDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.createBulk(dto, lang);
    return created(data, tCreated('Bom Item', lang));
  }

  @ApiOperation({ summary: 'Update Bom Item' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: '525a58dc-55ea-495d-9c78-489bdcaa8f0' })
  @ApiBody({
    type: UpdateBomItemDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          product_variant_id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
          material_id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
          qty_per_unit: 2.5,
          condition_color: 'Merah',
          waste_pct: 5.0,
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
          id: '525a58dc-55ea-495d-9c78-489bdcaa8f01',
          product_variant: {
            id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
            product_name: 'Dress Lengan Pendek - Merah - L',
            size: 'L',
            color: 'Merah',
            sku: 'KLP-RED-L'
          },
          material: {
            id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
            material_code: 'MAT001',
            material_name: 'Kain Cotton',
            material_category: '549c548b-a1e2-4618-95c0-95de1ab03eba',
            unit_of_measure: 'YARD'
          }
        },
        message: 'Updated',
        meta: null,
        timestamp: '2024-10-01T11:00:00.000Z',
      },
    },
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBomItemDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Bom Item', lang));
  }

  @ApiOperation({ summary: 'Update Bom Item Bulk' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: '525a58dc-55ea-495d-9c78-489bdcaa8f0' })
  @ApiBody({
    type: UpdateBomItemBulkDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          product_variant_id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
          materials: [
            {
              material_id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
              qty_per_unit: 2.5,
            },
          ],
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
          id: '525a58dc-55ea-495d-9c78-489bdcaa8f01',
          product_variant: {
            id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
            product_name: 'Dress Lengan Pendek - Merah - L',
            size: 'L',
            color: 'Merah',
            sku: 'KLP-RED-L'
          },
          materials: [
            {
              id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
              material_code: 'MAT001',
              material_name: 'Kain Cotton',
              material_category: '549c548b-a1e2-4618-95c0-95de1ab03eba',
              unit_of_measure: 'YARD'
            },
          ],
        },
        message: 'Updated',
        meta: null,
        timestamp: '2024-10-01T11:00:00.000Z',
      },
    },
  })
  @Put('bulk/:id')
  async updateBulk(@Param('id') id: string, @Body() dto: UpdateBomItemBulkDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.updateBulk(id, dto, lang);
    return updated(data, tUpdated('Bom Item', lang));
  }

  @ApiOperation({ summary: 'Hapus Bom Item' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' })
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
    return ok(data, tDeleted('Bom Item', lang));
  }
}
