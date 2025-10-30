import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Headers,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiParam,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { SystemMasterService } from './system-master.service';
import { CreateSystemMasterDto } from './dto/create-system-master.dto';
import { UpdateSystemMasterDto } from './dto/update-system-master.dto';
import {
  tCreated,
  tUpdated,
  tDeleted,
  tRetrieved,
} from '../../core/common/i18n/messages';
import {
  ok,
  created,
  updated,
  deleted,
} from '../../infrastructure/http/response';

@ApiTags('System Master (Cuekin aja punya nanta)')
@ApiHeader({
  name: 'accept-language',
  description: 'Locale untuk pesan respons (default id)',
  required: false,
  schema: { type: 'string', default: 'id' },
})
@Controller('system-master')
export class SystemMasterController {
  constructor(private readonly systemMasterService: SystemMasterService) {}

  @Get(':system_type')
  @ApiOperation({
    summary: 'List System Master by type',
    description: 'Mengambil daftar System Master berdasarkan system_type.',
  })
  @ApiParam({
    name: 'system_type',
    description: 'Jenis sistem, misal ROLE, UOM, MATERIAL_CATEGORY',
    example: 'ROLE',
  })
  @ApiOkResponse({
    description: 'Berhasil mengambil daftar System Master',
    schema: {
      example: {
        success: true,
        data: [
          {
            system_type: 'ROLE',
            system_cd: 'admin',
            system_value: 'Administrator',
            created_by: 1,
            created_dt: '2024-10-01T10:00:00.000Z',
            changed_by: null,
            changed_dt: null,
          },
        ],
        message: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  async findBySystemType(
    @Param('system_type') system_type: string,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.systemMasterService.findBySystemType(
      system_type,
      lang,
    );
    return ok(data, tRetrieved('Data', lang));
  }

  @Get(':system_type/:system_cd')
  @ApiOperation({
    summary: 'Get System Master detail',
    description:
      'Mengambil detail System Master berdasarkan system_type dan system_cd.',
  })
  @ApiParam({
    name: 'system_type',
    description: 'Jenis sistem',
    example: 'ROLE',
  })
  @ApiParam({
    name: 'system_cd',
    description: 'Kode sistem unik dalam system_type',
    example: 'admin',
  })
  @ApiOkResponse({
    description: 'Berhasil mengambil detail System Master',
    schema: {
      example: {
        success: true,
        data: {
          system_type: 'ROLE',
          system_cd: 'admin',
          system_value: 'Administrator',
          created_by: 1,
          created_dt: '2024-10-01T10:00:00.000Z',
          changed_by: 2,
          changed_dt: '2024-10-10T12:00:00.000Z',
        },
        message: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'System Master tidak ditemukan',
    schema: {
      example: {
        success: false,
        message: 'System Master not found',
        errors: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  async findOne(
    @Param('system_type') system_type: string,
    @Param('system_cd') system_cd: string,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.systemMasterService.findBySystemTypeSystemCd(
      system_type,
      system_cd,
      lang,
    );
    return ok(data, tRetrieved('System Master', lang));
  }

  @Post()
  @ApiOperation({ summary: 'Create System Master' })
  @ApiBody({
    description: 'Payload untuk membuat System Master baru.',
    examples: {
      example1: {
        summary: 'Membuat System Master admin role',
        value: {
          system_type: 'ROLE',
          system_cd: 'admin',
          system_value: 'Administrator',
          user_id: '1',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Berhasil membuat System Master',
    schema: {
      example: {
        success: true,
        data: {
          system_type: 'ROLE',
          system_cd: 'admin',
          system_value: 'Administrator',
          created_by: 1,
          created_dt: '2024-10-01T10:00:00.000Z',
          changed_by: null,
          changed_dt: null,
        },
        message: 'System Master created successfully',
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  async create(
    @Body() createSystemMasterDto: CreateSystemMasterDto,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.systemMasterService.create(
      createSystemMasterDto,
      lang,
    );
    return created(data, tCreated('System Master', lang));
  }

  @Put(':system_type/:system_cd')
  @ApiOperation({
    summary: 'Update System Master',
    description: 'Memperbarui System Master yang ada.',
  })
  @ApiParam({
    name: 'system_type',
    description: 'Jenis sistem',
    example: 'ROLE',
  })
  @ApiParam({
    name: 'system_cd',
    description: 'Kode sistem unik dalam system_type',
    example: 'admin',
  })
  @ApiOkResponse({
    description: 'Berhasil memperbarui System Master',
    schema: {
      example: {
        success: true,
        data: {
          system_type: 'ROLE',
          system_cd: 'admin',
          system_value: 'Admin',
          created_by: 1,
          created_dt: '2024-10-01T10:00:00.000Z',
          changed_by: 2,
          changed_dt: '2024-10-10T12:00:00.000Z',
        },
        message: 'System Master updated successfully',
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Payload tidak valid',
    schema: {
      example: {
        success: false,
        message: 'system_value is required',
        errors: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'System Master tidak ditemukan',
    schema: {
      example: {
        success: false,
        message: 'System Master not found',
        errors: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  async update(
    @Param('system_type') system_type: string,
    @Param('system_cd') system_cd: string,
    @Body() updateSystemMasterDto: UpdateSystemMasterDto,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    const data = await this.systemMasterService.update(
      system_type,
      system_cd,
      updateSystemMasterDto,
      lang,
    );
    return updated(data, tUpdated('System Master', lang));
  }

  @Delete(':system_type/:system_cd')
  @ApiOperation({
    summary: 'Delete System Master',
    description:
      'Menghapus System Master berdasarkan system_type dan system_cd.',
  })
  @ApiParam({
    name: 'system_type',
    description: 'Jenis sistem',
    example: 'ROLE',
  })
  @ApiParam({
    name: 'system_cd',
    description: 'Kode sistem unik dalam system_type',
    example: 'admin',
  })
  @ApiOkResponse({
    description: 'Berhasil menghapus System Master',
    schema: {
      example: {
        success: true,
        data: { deleted: true },
        message: 'System Master deleted successfully',
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'System Master tidak ditemukan',
    schema: {
      example: {
        success: false,
        message: 'System Master not found',
        errors: null,
        timestamp: '2024-10-01T10:00:00.000Z',
      },
    },
  })
  async remove(
    @Param('system_type') system_type: string,
    @Param('system_cd') system_cd: string,
    @Headers() headers: Record<string, string>,
  ) {
    const lang = headers['accept-language'];
    await this.systemMasterService.remove(system_type, system_cd, lang);
    return deleted(tDeleted('System Master', lang));
  }
}
