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
import { DeliveryNoteService } from './delivery-note.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';
import { ApprovalDeliveryNoteDto } from './dto/approval-delivery-note.dto';
import { FindAllDeliveryNoteByTypeDto } from './dto/find-all-delivery-note-by-type.dto';

@ApiTags('Delivery Note (Surat Jalan)')
@Controller('delivery-note')
export class DeliveryNoteController {
  constructor(private readonly service: DeliveryNoteService) {}

  @ApiOperation({ summary: 'List semua Tipe Surat Jalan' })
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
            id: 'e7513215-7969-41e9-8924-8f741528be1d',
            name: 'Surat Masuk'
          }
        ],
        message: null,
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Get('type')
  async findTypes(
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.findTypes(lang);
    return ok(data, tRetrieved('Surat Jalan', lang));
  }

  @ApiOperation({ summary: 'List semua Surat Jalan' })
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
            id: '894ac0f0-9fd4-43ae-bfec-ecff128acf10',
            delivery_note_no: '001/SJ/X/2025',
            delivery_note_date: '2025-10-21',
            delivery_note_type: 'OUTBOUND',
            vendor: {
              id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
              name: 'PT Supplier Utama',
              contact_person: 'John Doe',
              phone: '021-12345678',
              email: 'contact@supplier.com',
              address: 'Jl. Industri No. 123',
              city: 'Jakarta',
              province: 'DKI Jakarta',
              country: 'Indonesia',
              zip_code: '12345',
              tax_number: '01.234.567.8-901.000'
            },
            destination: 'Gudang Utama',
            status: 'PENDING',
            notes: 'Catatan pengiriman'
          }
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
      message: tRetrieved('Surat Jalan', lang),
      meta: { total, start, length, total_pages },
    };
  }

  @ApiOperation({ summary: 'List semua Surat Jalan Berdasarkan Tipe' })
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
            id: '894ac0f0-9fd4-43ae-bfec-ecff128acf10',
            delivery_note_no: '001/SJ/X/2025',
            delivery_note_date: '2025-10-21',
            delivery_note_type: 'OUTBOUND',
            vendor: {
              id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
              name: 'PT Supplier Utama',
              contact_person: 'John Doe',
              phone: '021-12345678',
              email: 'contact@supplier.com',
              address: 'Jl. Industri No. 123',
              city: 'Jakarta',
              province: 'DKI Jakarta',
              country: 'Indonesia',
              zip_code: '12345',
              tax_number: '01.234.567.8-901.000'
            },
            destination: 'Gudang Utama',
            status: 'PENDING',
            notes: 'Catatan pengiriman'
          }
        ],
        message: null,
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @ApiOperation({ summary: 'List Surat Jalan berdasarkan tipe' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'delivery_note_type', example: 'Surat Masuk' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: '894ac0f0-9fd4-43ae-bfec-ecff128acf10',
            delivery_note_no: '001/SJ/X/2025',
            delivery_note_date: '2025-10-21',
            delivery_note_type: 'OUTBOUND',
            vendor: {
              id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
              name: 'PT Supplier Utama',
            },
            destination: 'Gudang Utama',
            status: 'PENDING',
            notes: 'Catatan pengiriman'
          }
        ],
        message: 'Data berhasil diambil',
        meta: { total: 1, start: 0, length: 10, total_pages: 1 },
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Get('type/:delivery_note_type')
  async findAllByType(
    @Headers() headers: Record<string, string>,
    @Param('delivery_note_type') deliveryNoteType: string,
    @Query() query: FindBaseDto,
  ) {
    const lang = headers['accept-language'];
    const start = query.start ?? 0;
    const length = query.length ?? 10;
    const { items, total } = await this.service.findAllByTypePaginated(
      deliveryNoteType,
      start,
      length,
      lang,
    );
    const total_pages = Math.max(1, Math.ceil(total / length));
    return {
      success: true,
      data: items,
      message: tRetrieved(deliveryNoteType, lang),
      meta: { total, start, length, total_pages },
    };
  }

  @ApiOperation({ summary: 'Generate nomor Surat Jalan otomatis' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          delivery_note_no: '001/SJ/X/2024',
        },
        message: null,
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Get('generate-no')
  async generateNo() {
    const dnNo = await this.service.generateDeliveryNoteNo();
    return { delivery_note_no: dnNo };
  }

  @ApiOperation({ summary: 'Ambil satu Sruat Jalan berdasarkan id' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: '894ac0f0-9fd4-43ae-bfec-ecff128acf10' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: '894ac0f0-9fd4-43ae-bfec-ecff128acf10',
          delivery_note_no: '001/SJ/X/2025',
          delivery_note_date: '2025-10-21',
          delivery_note_type: 'OUTBOUND',
          vendor: {
            id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
            name: 'PT Supplier Utama',
            contact_person: 'John Doe',
            phone: '021-12345678',
            email: 'contact@supplier.com',
            address: 'Jl. Industri No. 123',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            country: 'Indonesia',
            zip_code: '12345',
            tax_number: '01.234.567.8-901.000'
          },
          destination: 'Gudang Utama',
          status: 'PENDING',
          notes: 'Catatan pengiriman'
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
    return ok(data, tRetrieved('Surat Jalan', lang));
  }

  @ApiOperation({ summary: 'Buat Surat Jalan baru' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateDeliveryNoteDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          delivery_note_no: '001/SJ/X/2024',
          delivery_note_date: '2024-10-01',
          delivery_note_type: 'OUTBOUND',
          vendor_id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
          destination: 'Gudang Utama',
          status: 'PENDING',
          notes: 'Catatan pengiriman',
          user_id: 'system',
          details: [
            {
              spk_detail_id: '813c0bc7-f7cc-4f65-81d8-b7bc2cb68cca',
              item_type: 'PRODUCT',
              product_variant_id: '7ed80dcd-1a7f-444f-b95f-8dcb6a831598',
              material_id: null,
              qty_out: 50,
              qty_in: 0,
              labor_cost: 0,
            }
          ]
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
          id: '894ac0f0-9fd4-43ae-bfec-ecff128acf10',
          delivery_note_no: '001/SJ/X/2025',
          delivery_note_date: '2025-10-21',
          delivery_note_type: 'OUTBOUND',
          vendor: {
            id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
            name: 'PT Supplier Utama',
            contact_person: 'John Doe',
            phone: '021-12345678',
            email: 'contact@supplier.com',
            address: 'Jl. Industri No. 123',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            country: 'Indonesia',
            zip_code: '12345',
            tax_number: '01.234.567.8-901.000'
          },
          destination: 'Gudang Utama',
          status: 'PENDING',
          notes: 'Catatan pengiriman'
        },
        message: 'Created',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateDeliveryNoteDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Surat Jalan', lang));
  }

  @ApiOperation({ summary: 'Update Surat Jalan' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: '894ac0f0-9fd4-43ae-bfec-ecff128acf10' })
  @ApiBody({
    type: UpdateDeliveryNoteDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          delivery_note_date: '2024-10-01',
          delivery_note_type: 'OUTBOUND',
          vendor_id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
          destination: 'Gudang Utama',
          status: 'PENDING',
          notes: 'Catatan pengiriman',
          user_id: 'system',
          details: [
            {
              spk_detail_id: '813c0bc7-f7cc-4f65-81d8-b7bc2cb68cca',
              item_type: 'PRODUCT',
              product_variant_id: '7ed80dcd-1a7f-444f-b95f-8dcb6a831598',
              material_id: null,
              qty_out: 50,
              qty_in: 0,
              labor_cost: 0,
            }
          ]
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
          id: '894ac0f0-9fd4-43ae-bfec-ecff128acf10',
          delivery_note_no: '001/SJ/X/2025',
          delivery_note_date: '2025-10-21',
          delivery_note_type: 'OUTBOUND',
          vendor: {
            id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
            name: 'PT Supplier Utama',
            contact_person: 'John Doe',
            phone: '021-12345678',
            email: 'contact@supplier.com',
            address: 'Jl. Industri No. 123',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            country: 'Indonesia',
            zip_code: '12345',
            tax_number: '01.234.567.8-901.000'
          },
          destination: 'Gudang Utama',
          status: 'PENDING',
          notes: 'Catatan pengiriman'
        },
        message: 'Updated',
        meta: null,
        timestamp: '2024-10-01T11:00:00.000Z',
      },
    },
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDeliveryNoteDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Surat Jalan', lang));
  }

  @ApiOperation({ summary: 'Approval Surat Jalan' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: ApprovalDeliveryNoteDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          id: '894ac0f0-9fd4-43ae-bfec-ecff128acf10',
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
          delivery_note_no: '001/SJ/X/2024',
          delivery_note_date: '2024-10-01',
          delivery_note_type: 'OUTBOUND',
          vendor_id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
          destination: 'Gudang Utama',
          status: 'APPROVED',
          notes: 'Catatan pengiriman',
          user_id: 'system',
          details: [
            {
              spk_detail_id: '813c0bc7-f7cc-4f65-81d8-b7bc2cb68cca',
              item_type: 'PRODUCT',
              product_variant_id: '7ed80dcd-1a7f-444f-b95f-8dcb6a831598',
              material_id: null,
              qty_out: 50,
              qty_in: 0,
              labor_cost: 0,
            }
          ]
        },
        message: 'Approved',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post('approval')
  async approval(@Body() dto: ApprovalDeliveryNoteDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.approval(dto, lang);
    return updated(data, tUpdated('Spk', lang));
  }
}
