import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  CreateSystemMasterUseCase,
  UpdateSystemMasterUseCase,
  FindSystemMasterByTypeUseCase,
  FindSystemMasterByTypeCdUseCase,
  DeleteSystemMasterUseCase,
  FindSystemMasterByTypePaginatedUseCase,
} from '../../core/use-cases/system-master';
import { SystemMaster } from '../../core/domain/entities/system-master.entity';
import type { SystemMasterResponse } from './dto/system-master-response.dto';
import type { CreateSystemMasterDto } from './dto/create-system-master.dto';
import type { UpdateSystemMasterDto } from './dto/update-system-master.dto';
import {
  DomainValidationError,
  DomainConflictError,
  DomainNotFoundError,
} from '../../core/common/exceptions/domain.errors';

@Injectable()
export class SystemMasterService {
  constructor(
    private readonly createUseCase: CreateSystemMasterUseCase,
    private readonly updateUseCase: UpdateSystemMasterUseCase,
    private readonly findByTypeUseCase: FindSystemMasterByTypeUseCase,
    private readonly findByTypeCdUseCase: FindSystemMasterByTypeCdUseCase,
    private readonly deleteUseCase: DeleteSystemMasterUseCase,
    private readonly findByTypePaginatedUseCase: FindSystemMasterByTypePaginatedUseCase,
  ) {}

  async findBySystemType(
    system_type: string,
    lang?: string,
  ): Promise<SystemMaster[]> {
    try {
      return await this.findByTypeUseCase.execute(system_type, lang);
    } catch (err) {
      if (err instanceof DomainValidationError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof DomainNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  async findBySystemTypePaginated(
    system_type: string,
    start: number,
    length: number,
    lang?: string,
  ): Promise<{ items: SystemMaster[]; total: number }> {
    try {
      return await this.findByTypePaginatedUseCase.execute(
        system_type,
        start,
        length,
        lang,
      );
    } catch (err) {
      if (err instanceof DomainValidationError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof DomainNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  async findBySystemTypeSystemCd(
    system_type: string,
    system_cd: string,
    lang?: string,
  ): Promise<SystemMaster | null> {
    try {
      return await this.findByTypeCdUseCase.execute(
        system_type,
        system_cd,
        lang,
      );
    } catch (err) {
      if (err instanceof DomainValidationError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof DomainNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  async create(
    dto: CreateSystemMasterDto,
    lang?: string,
  ): Promise<SystemMaster> {
    try {
      return await this.createUseCase.execute(
        {
          system_type: dto.system_type,
          system_value: dto.system_value,
          system_cd: dto.system_cd,
          user_id: dto.user_id,
        },
        lang,
      );
    } catch (err) {
      if (err instanceof DomainValidationError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof DomainConflictError) {
        throw new ConflictException(err.message);
      }
      throw err;
    }
  }

  async update(
    system_type: string,
    system_cd: string,
    dto: UpdateSystemMasterDto,
    lang?: string,
  ): Promise<SystemMaster> {
    try {
      return await this.updateUseCase.execute(
        {
          system_type,
          system_cd,
          system_value: dto.system_value,
          user_id: dto.user_id,
        },
        lang,
      );
    } catch (err) {
      if (err instanceof DomainValidationError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof DomainNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  async remove(
    system_type: string,
    system_cd: string,
    lang?: string,
  ): Promise<void> {
    try {
      await this.deleteUseCase.execute(system_type, system_cd, lang);
    } catch (err) {
      if (err instanceof DomainValidationError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof DomainNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  async findOptionsBySystemType(
    system_type: string,
    lang?: string,
  ): Promise<SystemMasterResponse[]> {
    const entities = await this.findByTypeUseCase.execute(system_type, lang);
    return entities.map(this.mapTypeToResponse);
  }

  async findOptionsBySystemTypePaginated(
    system_type: string,
    start: number,
    length: number,
    lang?: string,
  ): Promise<{ items: SystemMasterResponse[]; total: number }> {
    const { items, total } = await this.findBySystemTypePaginated(
      system_type,
      start,
      length,
      lang,
    );
    return { items: items.map(this.mapTypeToResponse), total };
  }

  async findOptionBySystemTypeSystemCd(
    system_type: string,
    system_cd: string,
    lang?: string,
  ): Promise<SystemMasterResponse | null> {
    try {
      const entity = await this.findByTypeCdUseCase.execute(
        system_type,
        system_cd,
        lang,
      );
      return entity ? this.mapTypeToResponse(entity) : null;
    } catch (err) {
      if (err instanceof DomainValidationError) {
        throw new BadRequestException(err.message);
      }
      if (err instanceof DomainNotFoundError) {
        throw new NotFoundException(err.message);
      }
      throw err;
    }
  }

  async createMasterOption(
    dto: CreateSystemMasterDto,
    lang?: string,
  ): Promise<SystemMasterResponse> {
    const created = await this.create(dto, lang);
    return this.mapTypeToResponse(created);
  }

  async updateMasterOption(
    system_type: string,
    system_cd: string,
    dto: UpdateSystemMasterDto,
    lang?: string,
  ): Promise<SystemMasterResponse> {
    const updated = await this.update(system_type, system_cd, dto, lang);
    return this.mapTypeToResponse(updated);
  }

  private mapTypeToResponse(e: SystemMaster) {
    return {
      id: e.system_cd,
      name: e.system_value,
      created_by: e.created_by,
      created_dt: e.created_dt,
      changed_by: e.changed_by,
      changed_dt: e.changed_dt,
    };
  }
}
