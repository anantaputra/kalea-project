import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleType } from '../../core/domain/value-objects/role-type.vo';
import type { CreateRoleDto } from './dto/create-role.dto';
import type { UpdateRoleDto } from './dto/update-role.dto';
import { SystemMasterService } from '../system-master/system-master.service';
import { tNotFound } from 'src/core/common/i18n/messages';
import { CreateSystemMasterDto } from '../system-master/dto/create-system-master.dto';
import { UpdateSystemMasterDto } from '../system-master/dto/update-system-master.dto';

@Injectable()
export class RoleService {
  constructor(
    private readonly systemMasterService: SystemMasterService,
  ) {}

  async findAll(lang?: string) {
    const list = await this.systemMasterService.findOptionsBySystemType(
      RoleType.ROLE,
      lang,
    );

    if (!list) {
      throw new NotFoundException(tNotFound('Role', lang));
    }

    return list;
  }

  async findAllPaginated(start: number, length: number, lang?: string) {
    const { items, total } =
      await this.systemMasterService.findOptionsBySystemTypePaginated(
        RoleType.ROLE,
        start,
        length,
        lang,
      );
    return { items, total };
  }

  async findOne(role_code: string, lang?: string) {
    const entity =
      await this.systemMasterService.findOptionBySystemTypeSystemCd(
        RoleType.ROLE,
        role_code,
        lang,
      );

    if (!entity) {
      throw new NotFoundException(tNotFound('Role', lang));
    }

    return entity;
  }

  async create(dto: CreateRoleDto, lang) {
    const systemMasterDto: CreateSystemMasterDto = {
      system_type: RoleType.ROLE,
      system_value: dto.name,
      user_id: dto.user_id ?? 'system',
    };
    console.log(dto.name);
    const created = await this.systemMasterService.createMasterOption(
      systemMasterDto,
      lang,
    );
    return created;
  }

  async update(role_code: string, dto: UpdateRoleDto, lang) {
    const existing =
      await this.systemMasterService.findOptionBySystemTypeSystemCd(
        RoleType.ROLE,
        role_code,
        lang,
      );
    if (!existing) {
      throw new NotFoundException(tNotFound('Role', lang));
    }
    const systemMasterDto: UpdateSystemMasterDto = {
      system_value: dto.name,
      user_id: dto.user_id ?? 'system',
    };
    const updated = await this.systemMasterService.updateMasterOption(
      RoleType.ROLE,
      role_code,
      systemMasterDto,
      lang,
    );
    return updated;
  }

  async remove(role_code: string, lang?: string): Promise<void> {
    const existing =
      await this.systemMasterService.findOptionBySystemTypeSystemCd(
        RoleType.ROLE,
        role_code,
        lang,
      );
    if (!existing) {
      throw new NotFoundException(tNotFound('Role', lang));
    }
    await this.systemMasterService.remove(RoleType.ROLE, role_code, lang);
  }
}
