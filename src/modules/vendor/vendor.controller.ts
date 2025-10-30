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
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorService } from './vendor.service';
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

@ApiTags('Vendors')
@Controller('vendors')
export class VendorController {
  constructor(private readonly service: VendorService) {}

  @ApiOperation({ summary: 'List semua Vendor' })
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
            id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
            name: 'PT Supplier Utama - Updated',
            contact_person: 'Jane Doe',
            phone: '021-87654321',
            email: 'updated@supplier.com',
            address: 'Jl. Industri Baru No. 456',
            city: 'Jakarta',
            province: 'DKI Jakarta',
            country: 'Indonesia',
            zip_code: '54321',
            tax_number: '01.234.567.8-901.000',
            created_by: 'system',
            created_dt: '2025-10-23T08:42:48.667Z',
            changed_by: 'system',
            changed_dt: '2025-10-23T08:42:48.667Z'
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
      message: tRetrieved('Vendor', lang),
      meta: { total, start, length, total_pages },
    };
  }

  @ApiOperation({ summary: 'Ambil satu Vendor berdasarkan id' })
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
          id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
          name: 'PT Supplier Utama - Updated',
          contact_person: 'Jane Doe',
          phone: '021-87654321',
          email: 'updated@supplier.com',
          address: 'Jl. Industri Baru No. 456',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          zip_code: '54321',
          tax_number: '01.234.567.8-901.000',
          created_by: 'system',
          created_dt: '2025-10-23T08:42:48.667Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T08:42:48.667Z'
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
    return ok(data, tRetrieved('Vendor', lang));
  }

  @ApiOperation({ summary: 'Buat Vendor baru' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateVendorDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          name: 'PT Supplier Utama',
          contact_person: 'John Doe',
          phone: '021-12345678',
          email: 'contact@supplier.com',
          address: 'Jl. Industri No. 123',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          zip_code: '12345',
          tax_number: '01.234.567.8-901.000',
          is_active: true,
          user_id: 'system'
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
          id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
          name: 'PT Supplier Utama - Updated',
          contact_person: 'Jane Doe',
          phone: '021-87654321',
          email: 'updated@supplier.com',
          address: 'Jl. Industri Baru No. 456',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          zip_code: '54321',
          tax_number: '01.234.567.8-901.000',
          created_by: 'system',
          created_dt: '2025-10-23T08:42:48.667Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T08:42:48.667Z'
        },
        message: 'Created',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateVendorDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Vendor', lang));
  }

  @ApiOperation({ summary: 'Update Vendor' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'e3778e83-8343-4c81-833b-5ea06ae1c277' })
  @ApiBody({
    type: UpdateVendorDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          name: 'PT Supplier Utama - Updated',
          contact_person: 'Jane Doe',
          phone: '021-87654321',
          email: 'updated@supplier.com',
          address: 'Jl. Industri Baru No. 456',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          zip_code: '54321',
          tax_number: '01.234.567.8-901.000',
          is_active: true,
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
          id: 'e3778e83-8343-4c81-833b-5ea06ae1c277',
          name: 'PT Supplier Utama - Updated',
          contact_person: 'Jane Doe',
          phone: '021-87654321',
          email: 'updated@supplier.com',
          address: 'Jl. Industri Baru No. 456',
          city: 'Jakarta',
          province: 'DKI Jakarta',
          country: 'Indonesia',
          zip_code: '54321',
          tax_number: '01.234.567.8-901.000',
          created_by: 'system',
          created_dt: '2025-10-23T08:42:48.667Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T08:42:48.667Z'
        },
        message: 'Updated',
        meta: null,
        timestamp: '2024-10-01T11:00:00.000Z',
      },
    },
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVendorDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Vendor', lang));
  }

  @ApiOperation({ summary: 'Hapus Vendor' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'e3778e83-8343-4c81-833b-5ea06ae1c277' })
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
    return ok(data, tDeleted('Vendor', lang));
  }
}
