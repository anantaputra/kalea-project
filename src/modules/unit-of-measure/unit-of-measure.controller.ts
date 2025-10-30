import { Controller, Get, Post, Body, Param, Headers, Query, Put, Delete } from '@nestjs/common';
import { CreateUnitOfMeasureDto } from './dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit-of-measure.dto';
import { UnitOfMeasureService } from './unit-of-measure.service';
import { ApiBody, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FindBaseDto } from 'src/core/find-base.dto';
import { tCreated, tDeleted, tRetrieved, tUpdated } from 'src/core/common/i18n/messages';
import { ok, created, updated } from 'src/infrastructure/http/response';

@ApiTags('Unit Of Measure')
@ApiHeader({
  name: 'accept-language',
  description: 'Locale untuk pesan respons (default id)',
  required: false,
  schema: { type: 'string', default: 'id' },
})
@Controller('unit-of-measure')
export class UnitOfMeasureController {
  constructor(private readonly service: UnitOfMeasureService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Unit Of Measure' })
  @ApiOkResponse({
    description: 'List of units of measure retrieved successfully',
    example: {
      success: true,
      message: 'Data retrieved successfully',
      data: [
        {
          id: '4570f6b8-471b-4669-a4c9-86d8b20ab94d',
          name: 'PCS',
          created_by: 'system',
          created_dt: '2025-10-23T04:17:29.713Z',
          changed_by: 'system',
          changed_dt: '2025-10-23T04:17:29.713Z'
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
  @ApiOperation({ summary: 'Get unit of measure by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unit of measure id',
    example: '4570f6b8-471b-4669-a4c9-86d8b20ab94d',
  })
  @ApiOkResponse({
    description: 'Unit of measure retrieved successfully',
    example: {
      success: true,
      message: 'Data retrieved successfully',
      data: {
        id: '4570f6b8-471b-4669-a4c9-86d8b20ab94d',
        name: 'PCS',
        created_by: 'system',
        created_dt: '2025-10-23T04:17:29.713Z',
        changed_by: 'system',
        changed_dt: '2025-10-23T04:17:29.713Z'
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
  @ApiOperation({ summary: 'Create new unit of measure' })
  @ApiBody({
    description: 'Unit of measure data',
    examples: {
      example1: {
        summary: 'Create PCS unit',
        value: {
          name: 'PCS',
          user_id: '',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Unit of measure created successfully',
    example: {
      success: true,
      message: 'Data created successfully',
      data: {
        id: '4570f6b8-471b-4669-a4c9-86d8b20ab94d',
        name: 'PCS',
        created_by: 'system',
        created_dt: '2025-10-23T04:17:29.713Z',
        changed_by: 'system',
        changed_dt: '2025-10-23T04:17:29.713Z'
      },
    },
  })
  async create(
    @Body() dto: CreateUnitOfMeasureDto,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Data', lang));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update unit of measure' })
  @ApiParam({
    name: 'id',
    description: 'Unit of measure id',
    example: '4570f6b8-471b-4669-a4c9-86d8b20ab94d',
  })
  @ApiBody({
    description: 'Updated unit of measure data',
    examples: {
      example1: {
        summary: 'Rename PCS to PACK',
        value: {
          name: 'PACK',
          user_id: '',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Unit of measure updated successfully',
    example: {
      success: true,
      message: 'Data updated successfully',
      data: {
        id: '4570f6b8-471b-4669-a4c9-86d8b20ab94d',
        name: 'PCS',
        created_by: 'system',
        created_dt: '2025-10-23T04:17:29.713Z',
        changed_by: 'system',
        changed_dt: '2025-10-23T04:17:29.713Z'
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUnitOfMeasureDto,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.update(id, dto, lang);
    return updated(data, tUpdated('Data', lang));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete unit of measure' })
  @ApiParam({
    name: 'id',
    description: 'Unit of measure id',
    example: '4570f6b8-471b-4669-a4c9-86d8b20ab94d',
  })
  @ApiOkResponse({
    description: 'Unit of measure deleted successfully',
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