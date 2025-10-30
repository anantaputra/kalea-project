import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindRoleQueryDto } from './dto/find-role.query.dto';
import {
  tCreated,
  tDeleted,
  tRetrieved,
  tUpdated,
} from '../../core/common/i18n/messages';
import {
  ok,
  created,
  updated,
  deleted,
} from '../../infrastructure/http/response';

@ApiTags('Role')
@ApiHeader({
  name: 'accept-language',
  description: 'Locale untuk pesan respons (default id)',
  required: false,
  schema: { type: 'string', default: 'id' },
})
@Controller('role')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiOkResponse({
    description: 'List of roles retrieved successfully',
    example: {
      success: true,
      message: 'Data retrieved successfully',
      data: [
        {
          id: 'def0fa68-d5a2-4b52-9d1b-83a64d84cc33',
          name: 'Owner',
          created_by: '2b66d730-3562-4d9f-8f67-b7d6c60f92e9',
          created_dt: '2025-10-23T08:11:51.318Z',
          changed_by: '2b66d730-3562-4d9f-8f67-b7d6c60f92e9',
          changed_dt: '2025-10-23T08:14:47.111Z',
        },
      ],
    },
  })
  async findAll(
    @Headers() headers: Record<string, string>,
    @Query() query: FindRoleQueryDto,
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
  @ApiOperation({ summary: 'Get role by code' })
  @ApiParam({
    name: 'id',
    description: 'id Role',
    example: 'def0fa68-d5a2-4b52-9d1b-83a64d84cc33',
  })
  @ApiOkResponse({
    description: 'Role retrieved successfully',
    example: {
      success: true,
      message: 'Data retrieved successfully',
      data: {
        id: 'def0fa68-d5a2-4b52-9d1b-83a64d84cc33',
        name: 'Owner',
        created_by: '2b66d730-3562-4d9f-8f67-b7d6c60f92e9',
        created_dt: '2025-10-23T08:11:51.318Z',
        changed_by: '2b66d730-3562-4d9f-8f67-b7d6c60f92e9',
        changed_dt: '2025-10-23T08:14:47.111Z',
      },
    },
  })
  async findOne(
    @Param('id') role_code: string,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.findOne(role_code, lang);
    return ok(data, tRetrieved('Data', lang));
  }

  @Post()
  @ApiOperation({ summary: 'Create new role' })
  @ApiBody({
    description: 'Role data input',
    examples: {
      example1: {
        summary: 'Create Owner role',
        value: {
          name: 'Owner',
          user_id: '',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Role created successfully',
    example: {
      success: true,
      message: 'Data created successfully',
      data: {
        id: 'def0fa68-d5a2-4b52-9d1b-83a64d84cc33',
        name: 'Owner',
        created_by: '2b66d730-3562-4d9f-8f67-b7d6c60f92e9',
        created_dt: '2025-10-23T08:11:51.318Z',
        changed_by: '2b66d730-3562-4d9f-8f67-b7d6c60f92e9',
        changed_dt: '2025-10-23T08:14:47.111Z',
      },
    },
  })
  async create(
    @Body() dto: CreateRoleDto,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.create(dto, lang);
    return created(data, tCreated('Role', lang));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update role by id' })
  @ApiBody({
    description: 'Role update data',
    examples: {
      example1: {
        summary: 'Update Owner role',
        value: {
          name: 'Owner',
          user_id: 'system',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Role updated successfully',
    example: {
      success: true,
      message: 'Data updated successfully',
      data: {
        id: 'def0fa68-d5a2-4b52-9d1b-83a64d84cc33',
        name: 'Owner',
        created_by: '2b66d730-3562-4d9f-8f67-b7d6c60f92e9',
        created_dt: '2025-10-23T08:11:51.318Z',
        changed_by: 'system',
        changed_dt: '2025-10-23T08:14:47.111Z',
      },
    },
  })
  async update(
    @Param('id') role_code: string,
    @Body() dto: UpdateRoleDto,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.update(role_code, dto, lang);
    return updated(data, tUpdated('Role', lang));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete role by id' })
  @ApiParam({
    name: 'id',
    description: 'id Role',
    example: 'def0fa68-d5a2-4b52-9d1b-83a64d84cc33',
  })
  @ApiOkResponse({
    description: 'Role deleted successfully',
    example: {
      success: true,
      message: 'Data deleted successfully',
      data: { deleted: true },
    },
  })
  async delete(
    @Param('id') role_code: string,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.service.remove(role_code, lang);
    return ok(data, tDeleted('Role', lang));
  }
}
