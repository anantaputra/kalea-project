import { Injectable, NotFoundException  } from '@nestjs/common';
import { tNotFound } from 'src/core/common/i18n/messages';
import { CreateRoleDto } from '../role/dto/create-role.dto';
import { UpdateRoleDto } from '../role/dto/update-role.dto';
import { CreateSystemMasterDto } from '../system-master/dto/create-system-master.dto';
import { UpdateSystemMasterDto } from '../system-master/dto/update-system-master.dto';
import { SystemMasterService } from '../system-master/system-master.service';
import { MaterialCategoryType } from 'src/core/domain/value-objects/material-category-id.vo';

@Injectable()
export class MaterialCategoryService {
constructor(
    private readonly systemMasterService: SystemMasterService,
  ) {}

  async findAll(lang?: string) {
    const list = await this.systemMasterService.findOptionsBySystemType(
      MaterialCategoryType.MATERIAL_CATEGORY,
      lang,
    );

    if (!list) {
      throw new NotFoundException(tNotFound('Material Category', lang));
    }

    return list;
  }

  async findAllPaginated(start: number, length: number, lang?: string) {
    const { items, total } =
      await this.systemMasterService.findOptionsBySystemTypePaginated(
        MaterialCategoryType.MATERIAL_CATEGORY,
        start,
        length,
        lang,
      );
    return { items, total };
  }

  async findOne(id: string, lang?: string) {
    const entity =
      await this.systemMasterService.findOptionBySystemTypeSystemCd(
        MaterialCategoryType.MATERIAL_CATEGORY,
        id,
        lang,
      );

    if (!entity) {
      throw new NotFoundException(tNotFound('Master Category', lang));
    }

    return entity;
  }

  async create(dto: CreateRoleDto, lang) {
    const systemMasterDto: CreateSystemMasterDto = {
      system_type: MaterialCategoryType.MATERIAL_CATEGORY,
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

  async update(id: string, dto: UpdateRoleDto, lang) {
    const existing =
      await this.systemMasterService.findOptionBySystemTypeSystemCd(
        MaterialCategoryType.MATERIAL_CATEGORY,
        id,
        lang,
      );
    if (!existing) {
      throw new NotFoundException(tNotFound('Master Category', lang));
    }
    const systemMasterDto: UpdateSystemMasterDto = {
      system_value: dto.name,
      user_id: dto.user_id ?? 'system',
    };
    const updated = await this.systemMasterService.updateMasterOption(
      MaterialCategoryType.MATERIAL_CATEGORY,
      id,
      systemMasterDto,
      lang,
    );
    return updated;
  }

  async remove(id: string, lang?: string): Promise<void> {
    const existing =
      await this.systemMasterService.findOptionBySystemTypeSystemCd(
        MaterialCategoryType.MATERIAL_CATEGORY,
        id,
        lang,
      );
    if (!existing) {
      throw new NotFoundException(tNotFound('Master Category', lang));
    }
    await this.systemMasterService.remove(MaterialCategoryType.MATERIAL_CATEGORY, id, lang);
  }
}