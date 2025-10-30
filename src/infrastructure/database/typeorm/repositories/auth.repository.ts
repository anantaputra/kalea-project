import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { AuthRepository as AuthRepositoryInterface } from '../../../../core/domain/repositories/auth.repository.interface';
import { Auth } from '../../../../core/domain/entities/auth.entity';
import { AuthEntity } from '../entities/Auth.entity';

@Injectable()
export class AuthRepository implements AuthRepositoryInterface {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly ormRepo: Repository<AuthEntity>,
  ) {}

  async findAll(): Promise<Auth[]> {
    const rows = await this.ormRepo.find();
    return rows.map((row) => this.mapToDomain(row));
  }

  async findById(id: string): Promise<Auth | null> {
    const row = await this.ormRepo.findOne({ where: { id } });
    return row ? this.mapToDomain(row) : null;
  }

  async create(entity: Auth): Promise<Auth> {
    const row = this.mapToOrm(entity);
    const saved = await this.ormRepo.save(row);
    return this.mapToDomain(saved);
  }

  async update(entity: Auth): Promise<Auth> {
    const saved = await this.ormRepo.save(this.mapToOrm(entity));
    return this.mapToDomain(saved);
  }

  private mapToDomain(row: AuthEntity): Auth {
    return new Auth(row.id);
  }

  private mapToOrm(entity: Auth): AuthEntity {
    const row = new (AuthEntity)();
    row.id = entity.id;
    return row;
  }
}