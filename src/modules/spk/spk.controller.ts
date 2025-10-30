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
import { CreateSpkDto } from './dto/create-spk.dto';
import { UpdateSpkDto } from './dto/update-spk.dto';
import { ApprovalSpkDto } from './dto/approval-spk.dto';
import { SpkService } from './spk.service';
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
import { ok, created, updated } from 'src/infrastructure/http/response';

@ApiTags('SPK (Surat Perintah Kerja)')
@Controller('spk')
export class SpkController {
  constructor(private readonly service: SpkService) {}

  @ApiOperation({ summary: 'List semua SPK' })
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
            id: '12ac8fcd-6e53-436a-be72-c29752a44310',
            spk_no: '001/SPK/X/2025',
            buyer: 'PT Supplier Utama',
            spk_date: '2025-10-23',
            deadline: '2025-11-15',
            status: 'PENDING',
            notes: 'Catatan SPK',
            created_by: 'system',
            created_dt: '2025-10-23T13:15:19.736Z',
            changed_by: 'system',
            changed_dt: '2025-10-23T13:15:19.736Z'
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
      message: tRetrieved('Spk', lang),
      meta: { total, start, length, total_pages },
    };
  }

  @ApiOperation({ summary: 'Generate nomor SPK otomatis' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          spk_no: '002/SPK/X/2024',
        },
        message: null,
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Get('generate-no')
  async generateNo() {
    const spkNo = await this.service.generateSpkNo();
    return { spk_no: spkNo };
  }

  @ApiOperation({ summary: 'Ambil satu SPK berdasarkan id' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: '12ac8fcd-6e53-436a-be72-c29752a44310' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: '12ac8fcd-6e53-436a-be72-c29752a44310',
          spk_no: '001/SPK/X/2025',
          buyer: 'PT Supplier Utama',
          spk_date: '2025-10-23',
          deadline: '2025-11-15',
          status: 'PENDING',
          notes: 'Catatan SPK',
          created_by: 'system',
          created_dt: '2025-10-23T13:15:19.736Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T13:15:19.736Z',
          details: [
            {
              id: '813c0bc7-f7cc-4f65-81d8-b7bc2cb68cca',
              product_variants: {
                id: '7ed80dcd-1a7f-444f-b95f-8dcb6a831598',
                product_name: 'Kalea Oversized Hoodie - Hitam - L',
                size: 'L',
                color: 'Hitam',
                barcode: '1001001001001',
                sku: 'KOH-BLK-L',
                price: 325000.00,
                cost_price: 0.00
              },
              qty_order: 100,
              qty_done: 0,
              qty_reject: 0,
              progress: '0%',
              status: 'PENDING',
              bom: [
                {
                  id: '10b0fdb5-9173-4dbc-9b43-f709fdda3324',
                  material_id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
                  qty_per_unit: 1.8,
                  qty_required: 180,
                  waste_pct: 3
                },
              ]
            },
          ]
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
    return ok(data, tRetrieved('Spk', lang));
  }

  @ApiOperation({ summary: 'Buat Article baru' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateSpkDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          no_spk: '001/SPK/X/2024',
          buyer: 'PT. Contoh Buyer',
          tanggal: '2024-10-01',
          deadline: '2024-10-15',
          status: 'PENDING',
          notes: 'Catatan SPK',
          user_id: 'system',
          details: [
            {
              product_variant_id: '7ed80dcd-1a7f-444f-b95f-8dcb6a831598',
              qty_order: '100',
              cost_price: '100000'
            }
          ]
        }
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: '12ac8fcd-6e53-436a-be72-c29752a44310',
          spk_no: '001/SPK/X/2025',
          buyer: 'PT Supplier Utama',
          spk_date: '2025-10-23',
          deadline: '2025-11-15',
          status: 'PENDING',
          notes: 'Catatan SPK',
          created_by: 'system',
          created_dt: '2025-10-23T13:15:19.736Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T13:15:19.736Z',
          details: [
            {
              id: '813c0bc7-f7cc-4f65-81d8-b7bc2cb68cca',
              product_variants: {
                id: '7ed80dcd-1a7f-444f-b95f-8dcb6a831598',
                product_name: 'Kalea Oversized Hoodie - Hitam - L',
                size: 'L',
                color: 'Hitam',
                barcode: '1001001001001',
                sku: 'KOH-BLK-L',
                price: 325000.00,
                cost_price: 0.00
              },
              qty_order: 100,
              qty_done: 0,
              qty_reject: 0,
              status: 'PENDING',
              bom: [
                {
                  id: '10b0fdb5-9173-4dbc-9b43-f709fdda3324',
                  material_id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
                  qty_per_unit: 1.8,
                  qty_required: 180,
                  waste_pct: 3
                },
              ]
            },
          ]
        },
        message: 'Created',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateSpkDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Spk', lang));
  }

  @ApiOperation({ summary: 'Update SPK' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: '12ac8fcd-6e53-436a-be72-c29752a44310' })
  @ApiBody({
    type: UpdateSpkDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          no_spk: '001/SPK/X/2024',
          buyer: 'PT. Contoh Buyer',
          tanggal: '2024-10-01',
          deadline: '2024-10-15',
          status: 'PENDING',
          notes: 'Catatan SPK',
          user_id: 'system',
          details: [
            {
              product_variant_id: '7ed80dcd-1a7f-444f-b95f-8dcb6a831598',
              qty_order: '100',
              cost_price: '100000'
            }
          ]
        }
      },
    },
  })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: '12ac8fcd-6e53-436a-be72-c29752a44310',
          spk_no: '001/SPK/X/2025',
          buyer: 'PT Supplier Utama',
          spk_date: '2025-10-23',
          deadline: '2025-11-15',
          status: 'PENDING',
          notes: 'Catatan SPK',
          created_by: 'system',
          created_dt: '2025-10-23T13:15:19.736Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T13:15:19.736Z',
          details: [
            {
              id: '813c0bc7-f7cc-4f65-81d8-b7bc2cb68cca',
              product_variants: {
                id: '7ed80dcd-1a7f-444f-b95f-8dcb6a831598',
                product_name: 'Kalea Oversized Hoodie - Hitam - L',
                size: 'L',
                color: 'Hitam',
                barcode: '1001001001001',
                sku: 'KOH-BLK-L',
                price: 325000.00,
                cost_price: 0.00
              },
              qty_order: 100,
              qty_done: 0,
              qty_reject: 0,
              status: 'PENDING',
              bom: [
                {
                  id: '10b0fdb5-9173-4dbc-9b43-f709fdda3324',
                  material_id: '3b97b2b0-3c1a-45a9-b536-28b9d6bd1a28',
                  qty_per_unit: 1.8,
                  qty_required: 180,
                  waste_pct: 3
                },
              ]
            },
          ]
        },
        message: 'Updated',
        meta: null,
        timestamp: '2024-10-01T11:00:00.000Z',
      },
    },
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSpkDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Spk', lang));
  }

  @ApiOperation({ summary: 'Approval SPK' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: ApprovalSpkDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          id: '12ac8fcd-6e53-436a-be72-c29752a44310',
          status: 'APPROVED',
          user_id: 'system',
        }
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: '12ac8fcd-6e53-436a-be72-c29752a44310',
          spk_no: '001/SPK/X/2025',
          buyer: 'PT Supplier Utama',
          spk_date: '2025-10-23',
          deadline: '2025-11-15',
          status: 'APPROVED',
          notes: 'Catatan SPK',
          created_by: 'system',
          created_dt: '2025-10-23T13:15:19.736Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T13:15:19.736Z',
        },
        message: 'Approved',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post('approval')
  async approval(@Body() dto: ApprovalSpkDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.approval(dto, lang);
    return updated(data, tUpdated('Spk', lang));
  }
}
