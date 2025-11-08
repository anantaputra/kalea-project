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
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariantService } from './product-variant.service';
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
import { BomItemService } from '../bom-item/bom-item.service';
import { FindSystemMasterByTypeCdUseCase } from '../../core/use-cases/system-master';
import { MaterialCategoryType } from 'src/core/domain/value-objects/material-category-id.vo';
import { UnitOfMeasureType } from 'src/core/domain/value-objects/unit-of-measure-id.vo';

@ApiTags('Product Variants')
@Controller('product-variants')
export class ProductVariantController {
  constructor(
    private readonly service: ProductVariantService,
    private readonly bomItemService: BomItemService,
    private readonly findSystemMasterByTypeCdUseCase: FindSystemMasterByTypeCdUseCase,
  ) {}

  @ApiOperation({ summary: 'List semua Product Variant' })
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
            id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
            article: {
              id: 'f0e92c26-db2d-41a5-9324-723940003639',
              article_name: 'Kalea Dress',
              description: 'Artikel pakaian'
            },
            product_name: 'Dress Lengan Pendek - Merah - L',
            size: 'L',
            color: 'Merah',
            barcode: '1234567890123',
            sku: 'KLP-RED-L',
            price: '150000.00',
            cost_price: '100000.00',
            is_active: true,
            created_by: 'system',
            created_dt: '2025-10-23T07:16:51.221Z',
            changed_by: 'system',
            changed_dt: '2025-10-23T07:16:51.221Z'
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
      message: tRetrieved('Product Variant', lang),
      meta: { total, start, length, total_pages },
    };
  }

  @ApiOperation({ summary: 'Ambil satu Product Variant berdasarkan id' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
          article: {
            id: 'f0e92c26-db2d-41a5-9324-723940003639',
            article_name: 'Kalea Dress',
            description: 'Artikel pakaian'
          },
          product_name: 'Dress Lengan Pendek - Merah - L',
          size: 'L',
          color: 'Merah',
          barcode: '1234567890123',
          sku: 'KLP-RED-L',
          price: '150000.00',
          cost_price: '100000.00',
          materials: [
            {
              bom_id: '8f3c3a7e-1b2c-4d5e-9f0a-123456789abc',
              material_id: 'f0e92c26-db2d-41a5-9324-723940003639',
              material_name: 'Benang Polyester 40/2',
              material_category: 'kain',
              unit_of_measure: 'meter',
              qty_per_unit: 0.14,
            }
          ],
          is_active: true,
          created_by: 'system',
          created_dt: '2025-10-23T07:16:51.221Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T07:16:51.221Z'
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
    const base = await this.service.findOne(id, lang);
    const bomItems = await this.bomItemService.findByProductVariantId(id);
    const materials = await Promise.all(
      bomItems.map(async (i: any) => {
        const catCd = i.material?.material_category ?? null;
        const uomCd = i.material?.unit_of_measure ?? null;
        let catVal: string | null = null;
        let uomVal: string | null = null;
        try {
          if (catCd) {
            const cat = await this.findSystemMasterByTypeCdUseCase.execute(
              MaterialCategoryType.MATERIAL_CATEGORY,
              catCd,
              lang,
            );
            catVal = cat?.system_value ?? catCd;
          }
        } catch {
          catVal = catCd;
        }
        try {
          if (uomCd) {
            const uom = await this.findSystemMasterByTypeCdUseCase.execute(
              UnitOfMeasureType.UNIT_OF_MEASURE,
              uomCd,
              lang,
            );
            uomVal = uom?.system_value ?? uomCd;
        }
      } catch {
          uomVal = uomCd;
        }

        return {
          bom_id: i.id ?? null,
          material_id: i.material?.id ?? null,
          material_name: i.material?.material_name ?? null,
          material_category: catVal,
          unit_of_measure: uomVal,
          qty_per_unit: i.qty_per_unit ?? null,
        };
      }),
    );
    const merged = { ...base, materials };
    return ok(merged, tRetrieved('Product Variant', lang));
  }

  @ApiOperation({ summary: 'Buat Product Variant baru' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateProductVariantDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          article_id: 'f0e92c26-db2d-41a5-9324-723940003639',
          product_name: 'Kaos Lengan Pendek - Merah - L',
          size: 'L',
          color: 'Merah',
          sku: 'KLP-RED-L',
          price: 150000,
          cost_price: 100000,
          is_active: true,
          user_id: 'system'
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
          id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
          article: {
            id: 'f0e92c26-db2d-41a5-9324-723940003639',
            article_name: 'Kalea Dress',
            description: 'Artikel pakaian'
          },
          product_name: 'Dress Lengan Pendek - Merah - L',
          size: 'L',
          color: 'Merah',
          barcode: '1234567890123',
          sku: 'KLP-RED-L',
          price: '150000.00',
          cost_price: '100000.00',
          is_active: true,
          created_by: 'system',
          created_dt: '2025-10-23T07:16:51.221Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T07:16:51.221Z'
        },
        message: 'Created',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateProductVariantDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Product Variant', lang));
  }

  @ApiOperation({ summary: 'Update Product Variant' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  @ApiBody({
    type: UpdateProductVariantDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          article_id: 'f0e92c26-db2d-41a5-9324-723940003639',
          product_name: 'Kaos Lengan Pendek - Merah - L',
          size: 'L',
          color: 'Merah',
          sku: 'KLP-RED-L',
          price: 150000,
          cost_price: 100000,
          is_active: true,
          user_id: 'system'
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
          id: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3',
          article: {
            id: 'f0e92c26-db2d-41a5-9324-723940003639',
            article_name: 'Kalea Dress',
            description: 'Artikel pakaian'
          },
          product_name: 'Dress Lengan Pendek - Merah - L',
          size: 'L',
          color: 'Merah',
          barcode: '1234567890123',
          sku: 'KLP-RED-L',
          price: '150000.00',
          cost_price: '100000.00',
          is_active: true,
          created_by: 'system',
          created_dt: '2025-10-23T07:16:51.221Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T07:16:51.221Z'
        },
        message: 'Updated',
        meta: null,
        timestamp: '2024-10-01T11:00:00.000Z',
      },
    },
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProductVariantDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Product Variant', lang));
  }

  @ApiOperation({ summary: 'Hapus Product Variant' }) 
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'e9bcdfad-2e12-49e8-8857-9b04170ffda3' })
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
    return ok(data, tDeleted('Product Variant', lang));
  }
}
