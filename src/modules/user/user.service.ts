import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { User } from '../../core/domain/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CreateUserUseCase,
  UpdateUserUseCase,
  FindAllUserUseCase,
  FindUserByIdUseCase,
  DeleteUserUseCase,
} from '../../core/use-cases/user';
import { SecurityService } from '../../infrastructure/services/security/security.service';

@Injectable()
export class UserService {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly updateUseCase: UpdateUserUseCase,
    private readonly findAllUseCase: FindAllUserUseCase,
    private readonly findByIdUseCase: FindUserByIdUseCase,
    private readonly deleteUseCase: DeleteUserUseCase,
    private readonly securityService: SecurityService,
  ) {}

  private mapToResponse(entity: User) {
    return {
      id: entity.id,
      first_name: entity.first_name,
      last_name: entity.last_name,
      username: entity.username,
      email: entity.email,
      role: entity.role,
      is_active: entity.is_active,
      created_by: entity.created_by ?? null,
      created_dt: entity.created_dt ? entity.created_dt.toISOString() : null,
      changed_by: entity.changed_by ?? null,
      changed_dt: entity.changed_dt ? entity.changed_dt.toISOString() : null,
    };
  }

  async findAll() {
    const list = await this.findAllUseCase.execute();
    return list.map((e) => this.mapToResponse(e));
  }

  async findOne(id: string) {
    const entity = await this.findByIdUseCase.execute(id);
    return entity ? this.mapToResponse(entity) : null;
  }

  async create(dto: CreateUserDto) {
    const now = new Date();
    const creator = dto.user_id ?? 'system';
    const hashedPassword = await this.securityService.hash(dto.password);
    const entity = new User(
      randomUUID(),
      dto.first_name,
      dto.last_name ?? null,
      dto.username,
      dto.email,
      hashedPassword,
      dto.is_active ?? true,
      dto.role,
      creator,
      now,
      creator,
      now,
    );
    const saved = await this.createUseCase.execute(entity);
    return this.mapToResponse(saved);
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.findByIdUseCase.execute(id);
    if (!existing) throw new NotFoundException('User not found');

    const hashedPassword = dto.password
      ? await this.securityService.hash(dto.password)
      : existing.password;

    const entity = new User(
      id,
      dto.first_name ?? existing.first_name,
      dto.last_name ?? existing.last_name,
      existing.username, // username tidak diubah lewat update
      dto.email ?? existing.email,
      hashedPassword,
      dto.is_active ?? existing.is_active,
      dto.role ?? existing.role,
      existing.created_by,
      existing.created_dt,
      dto.user_id ?? existing.changed_by,
      new Date(),
    );
    const updated = await this.updateUseCase.execute(entity);
    return this.mapToResponse(updated);
  }

  async remove(id: string): Promise<void> {
    await this.deleteUseCase.execute(id);
  }
}
