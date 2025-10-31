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
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleService } from './article.service';
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
import { ok, created, updated } from 'src/infrastructure/http/response';@ApiTags('Articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @ApiOperation({ summary: 'List semua Article' })
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
            id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
            article_name: 'Kaos Lengan Pendek',
            description: 'Artikel pakaian',
            is_active: true,
            created_by: 'system',
            created_dt: '2024-10-01T10:00:00.000Z',
            changed_by: null,
            changed_dt: null,
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
      message: tRetrieved('Article', lang),
      meta: { total, start, length, total_pages },
    };
  }

  @ApiOperation({ summary: 'Ambil satu Article berdasarkan id' })
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
          id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
          article_name: 'Kaos Lengan Pendek',
          description: 'Artikel pakaian',
          product_variants: [
            {
              id: '0bce1487-0246-4727-bccd-ce2bdd1eabdb',
              product_name: 'Kaos Oversize Summer - Hitam - M',
              size: 'M',
              color: 'Hitam Metalic',
              barcode: '8997001234567',
              sku: 'KAOS-HITAM-M',
              price: '95000.00',
              cost_price: '75000.00',
            },
          ],
          is_active: true,
          created_by: 'system',
          created_dt: '2024-10-01T10:00:00.000Z',
          changed_by: null,
          changed_dt: null,
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
    return ok(data, tRetrieved('Article', lang));
  }

  @ApiOperation({ summary: 'Buat Article baru' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiBody({
    type: CreateArticleDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          article_name: 'Kaos Lengan Pendek',
          description: 'Artikel pakaian',
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
          id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
          article_name: 'Kaos Lengan Pendek',
          description: 'Artikel pakaian',
          is_active: true,
          created_by: 'system',
          created_dt: '2024-10-01T10:00:00.000Z',
          changed_by: 'system',
          changed_dt: '2024-10-01T10:00:00.000Z',
        },
        message: 'Created',
        meta: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @Post()
  async create(@Body() dto: CreateArticleDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Article', lang));
  }

  @ApiOperation({ summary: 'Update Article' })
  @ApiHeader({
    name: 'accept-language',
    description: 'Locale untuk pesan respons (default id)',
    required: false,
    schema: { type: 'string', default: 'id' },
  })
  @ApiParam({ name: 'id', example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  @ApiBody({
    type: UpdateArticleDto,
    examples: {
      default: {
        summary: 'Contoh body',
        value: {
          article_name: 'Kaos Lengan Pendek - Update',
          description: 'Artikel pakaian updated',
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
          id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
          article_name: 'Kaos Lengan Pendek - Update',
          description: 'Artikel pakaian updated',
          is_active: true,
          created_by: 'system',
          created_dt: '2024-10-01T10:00:00.000Z',
          changed_by: 'updater',
          changed_dt: '2024-10-01T11:00:00.000Z',
        },
        message: 'Updated',
        meta: null,
        timestamp: '2024-10-01T11:00:00.000Z',
      },
    },
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateArticleDto, @Headers() headers: Record<string, string>) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Article', lang));
  }

  @ApiOperation({ summary: 'Hapus Article' })
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
    return ok(data, tDeleted('Article', lang));
  }
}
