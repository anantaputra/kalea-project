import { Controller, Get, Post, Body, Param, Delete, Put, Query, Headers } from '@nestjs/common';
import { CreateMaterialCategoryDto } from './dto/create-material-category.dto';
import { UpdateMaterialCategoryDto } from './dto/update-material-category.dto';
import { MaterialCategoryService } from './material-category.service';
import { ApiTags, ApiHeader, ApiOperation, ApiOkResponse, ApiParam, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { tRetrieved, tCreated, tUpdated, tDeleted } from 'src/core/common/i18n/messages';
import { FindBaseDto } from 'src/core/find-base.dto';
import { ok, created, updated } from 'src/infrastructure/http/response';

@ApiTags('Material Category')
@ApiHeader({
  name: 'accept-language',
  description: 'Locale untuk pesan respons (default id)',
  required: false,
  schema: { type: 'string', default: 'id' },
})
@Controller('material-category')
export class MaterialCategoryController {
  constructor(private readonly service: MaterialCategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Material Category' })
  @ApiOkResponse({
    description: 'List of material categories retrieved successfully',
    example: {
      success: true,
      message: 'Data retrieved successfully',
      data: [
        {
          id: '549c548b-a1e2-4618-95c0-95de1ab03eba',
          name: 'FABRIC',
          created_by: 'system',
          created_dt: '2025-10-23T04:22:16.193Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T04:22:16.193Z'
        },
      ],
    },
  })
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

  @Get(':id')
  @ApiOperation({ summary: 'Get Material Category by ID' })
  @ApiParam({
    name: 'id',
    description: 'Material Category id',
    example: '4570f6b8-471b-4669-a4c9-86d8b20ab94d',
  })
  @ApiOkResponse({
    description: 'Material Category retrieved successfully',
    example: {
      success: true,
      message: 'Data retrieved successfully',
      data: {
        id: '549c548b-a1e2-4618-95c0-95de1ab03eba',
        name: 'FABRIC',
        created_by: 'system',
        created_dt: '2025-10-23T04:22:16.193Z',
        changed_by: 'system',
        changed_dt: '2025-10-23T04:22:16.193Z'
      },
    },
  })
  async findOne(
    @Param('id') id: string,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.findOne(id, lang);
    return ok(data, tRetrieved('Data', lang));
  }

  @Post()
  @ApiOperation({ summary: 'Create new Material Category' })
  @ApiBody({
    description: 'Material Category data',
    examples: {
      example1: {
        summary: 'Create FABRIC unit',
        value: {
          name: 'FABRIC',
          user_id: '',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Material Category created successfully',
    example: {
      success: true,
      message: 'Data created successfully',
      data: {
        id: '549c548b-a1e2-4618-95c0-95de1ab03eba',
        name: 'FABRIC',
        created_by: 'system',
        created_dt: '2025-10-23T04:22:16.193Z',
        changed_by: 'system',
        changed_dt: '2025-10-23T04:22:16.193Z'
      },
    },
  })
  async create(
    @Body() dto: CreateMaterialCategoryDto,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Data', lang));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Material Category' })
  @ApiParam({
    name: 'id',
    description: 'Material Category id',
    example: '4570f6b8-471b-4669-a4c9-86d8b20ab94d',
  })
  @ApiBody({
    description: 'Updated Material Category data',
    examples: {
      example1: {
        summary: 'Rename FABRIC to FABRICS',
        value: {
          name: 'FABRICS',
          user_id: '',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Material Category updated successfully',
    example: {
      success: true,
      message: 'Data updated successfully',
      data: {
        id: '549c548b-a1e2-4618-95c0-95de1ab03eba',
        name: 'FABRICS',
        created_by: 'system',
        created_dt: '2025-10-23T04:22:16.193Z',
        changed_by: 'system',
        changed_dt: '2025-10-23T04:22:16.193Z'
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMaterialCategoryDto,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Data', lang));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Material Category' })
  @ApiParam({
    name: 'id',
    description: 'Material Category id',
    example: '549c548b-a1e2-4618-95c0-95de1ab03eba',
  })
  @ApiOkResponse({
    description: 'Material Category deleted successfully',
    example: {
      success: true,
      message: 'Data deleted successfully',
      data: { deleted: true },
    },
  })
  async delete(
    @Param('id') id: string,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.remove(id, lang);
    return ok(data, tDeleted('Data', lang));
  }
}