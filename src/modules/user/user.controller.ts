import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiOperation({ summary: 'List semua User' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 'uuid',
            first_name: 'Budi',
            last_name: 'Santoso',
            username: 'budi',
            email: 'budi@example.com',
            role: 'ADMIN',
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
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Ambil satu User berdasarkan id' })
  @ApiParam({ name: 'id', example: 'uuid' })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: 'uuid',
          first_name: 'Budi',
          last_name: 'Santoso',
          username: 'budi',
          email: 'budi@example.com',
          role: 'ADMIN',
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
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiOperation({ summary: 'Buat User baru' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: 'uuid',
          first_name: 'Budi',
          last_name: 'Santoso',
          username: 'budi',
          email: 'budi@example.com',
          role: 'ADMIN',
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
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Update User' })
  @ApiParam({ name: 'id', example: 'uuid' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'Response dibungkus oleh TransformResponseInterceptor',
    schema: {
      example: {
        success: true,
        data: {
          id: 'uuid',
          first_name: 'Budi',
          last_name: 'Santoso',
          username: 'budi',
          email: 'budi@example.com',
          role: 'ADMIN',
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
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Hapus User' })
  @ApiParam({ name: 'id', example: 'uuid' })
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
  async remove(@Param('id') id: string) {
    await this.service.remove(id);
    return { success: true };
  }
}
